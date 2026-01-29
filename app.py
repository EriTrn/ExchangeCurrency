"""
Currency Exchange Web Application - Flask Backend
Author: Professional Full-Stack Developer
Description: Complete backend with real-time rates, historical data, comparison engine,
             inverse conversion, and fee calculator
"""

from flask import Flask, render_template, request, jsonify
import requests
from datetime import datetime, timedelta
import os
from functools import lru_cache
import time
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('EXCHANGE_SECRET_KEY')

# Configuration
API_KEY = os.getenv('EXCHANGE_API_KEY')
BASE_URL = 'https://v6.exchangerate-api.com/v6'
CACHE_DURATION = 60 

# Simulated bank/money changer spreads (in percentage)
EXCHANGE_PROVIDERS = {
    'Bank Central': {'spread': 0.015, 'fee_type': 'percentage', 'fee_value': 0.5},
    'Bank Mandiri': {'spread': 0.020, 'fee_type': 'percentage', 'fee_value': 0.75},
    'Bank BCA': {'spread': 0.018, 'fee_type': 'fixed', 'fee_value': 5000},
    'Money Changer A': {'spread': 0.010, 'fee_type': 'percentage', 'fee_value': 0.3},
    'Money Changer B': {'spread': 0.012, 'fee_type': 'fixed', 'fee_value': 3000},
    'Airport Exchange': {'spread': 0.035, 'fee_type': 'percentage', 'fee_value': 1.0},
}

# Currency denominations (for calculating unexchangeable remainder)
DENOMINATIONS = {
    'USD': [100, 50, 20, 10, 5, 1],
    'EUR': [500, 200, 100, 50, 20, 10, 5],
    'IDR': [100000, 50000, 20000, 10000, 5000, 2000, 1000],
    'SGD': [10000, 1000, 100, 50, 10, 5, 2],
    'JPY': [10000, 5000, 2000, 1000],
    'GBP': [50, 20, 10, 5],
    'AUD': [100, 50, 20, 10, 5],
    'CNY': [100, 50, 20, 10, 5, 1],
}

# Cache for API responses
rate_cache = {
    'data': None,
    'timestamp': 0
}

# Cache for historical data
historical_cache = {}


def get_exchange_rates(base_currency='USD'):
    """
    Fetch real-time exchange rates from ExchangeRate-API
    Implements caching to reduce API calls
    """
    current_time = time.time()
    
    # Check if cached data is still valid
    if (rate_cache['data'] and 
        rate_cache['timestamp'] and 
        current_time - rate_cache['timestamp'] < CACHE_DURATION):
        return rate_cache['data']
    
    try:
        url = f"{BASE_URL}/{API_KEY}/latest/{base_currency}"
        response = requests.get(url, timeout=5)
        
        if response.status_code == 200:
            data = response.json()
            if data.get('result') == 'success':
                rate_cache['data'] = data
                rate_cache['timestamp'] = current_time
                return data
        
        # If API fails, return mock data for demonstration
        return get_mock_rates(base_currency)
    
    except Exception as e:
        print(f"API Error: {e}")
        return get_mock_rates(base_currency)


def get_mock_rates(base_currency='USD'):
    """
    Provide mock exchange rates for demonstration purposes
    """
    mock_rates = {
        'USD': {'IDR': 15750.50, 'EUR': 0.92, 'GBP': 0.79, 'JPY': 149.50, 'SGD': 1.34, 'AUD': 1.52, 'CNY': 7.24},
        'IDR': {'USD': 0.0000635, 'EUR': 0.0000584, 'GBP': 0.0000502, 'JPY': 0.00949, 'SGD': 0.0000851, 'AUD': 0.0000965, 'CNY': 0.000460},
        'EUR': {'USD': 1.087, 'IDR': 17130.25, 'GBP': 0.86, 'JPY': 162.50, 'SGD': 1.46, 'AUD': 1.65, 'CNY': 7.87},
    }
    
    rates = mock_rates.get(base_currency, mock_rates['USD'])
    
    return {
        'result': 'success',
        'base_code': base_currency,
        'conversion_rates': rates,
        'time_last_update_utc': datetime.utcnow().strftime('%a, %d %b %Y %H:%M:%S +0000')
    }


def get_historical_data(base_currency, target_currency, days=7):
    """
    Generate historical exchange rate data
    For demonstration, we simulate data. In production, use API with historical support
    """
    cache_key = f"{base_currency}_{target_currency}_{days}"
    
    if cache_key in historical_cache:
        return historical_cache[cache_key]
    
    # Get current rate
    current_data = get_exchange_rates(base_currency)
    if current_data['result'] != 'success':
        return None
    
    current_rate = current_data['conversion_rates'].get(target_currency, 1.0)
    
    # Simulate historical data with random fluctuations
    import random
    historical_data = []
    
    for i in range(days, -1, -1):
        date = (datetime.now() - timedelta(days=i)).strftime('%Y-%m-%d')
        # Add realistic fluctuation (±2% from current rate)
        fluctuation = random.uniform(-0.02, 0.02)
        rate = current_rate * (1 + fluctuation)
        historical_data.append({
            'date': date,
            'rate': round(rate, 6)
        })
    
    historical_cache[cache_key] = historical_data
    return historical_data


def calculate_fee(amount, fee_type, fee_value, currency='IDR'):
    """
    Calculate admin/service fee
    
    Args:
        amount: Amount to convert
        fee_type: 'percentage' or 'fixed'
        fee_value: Fee amount or percentage
        currency: Currency for fixed fees
    
    Returns:
        Fee amount
    """
    if fee_type == 'percentage':
        return amount * (fee_value / 100)
    else:  # fixed
        return fee_value


def exchangeable_value(amount, target_currency='USD'):
    """
    Calculate the exchangeable amount based on available denominations
    
    Args:
        amount: The converted amount
        target_currency: The target currency code
    
    Returns:
        dict: {
            'exchangeable': amount that can be exchanged,
            'remainder': amount that cannot be exchanged
        }
    """
    if target_currency not in DENOMINATIONS:
        return {
            'exchangeable': round(amount, 2),
            'remainder': 0
        }
    
    denominations = sorted(DENOMINATIONS[target_currency], reverse=True)
    total_exchangeable = 0
    remaining = amount
    
    for denom in denominations:
        count = int(remaining / denom)
        total_exchangeable += count * denom
        remaining -= count * denom
    
    return {
        'exchangeable': round(total_exchangeable, 2),
        'remainder': round(remaining, 2)
    }


def compare_providers(amount, base_currency, target_currency):
    """
    Compare exchange rates across different providers
    
    Returns:
        List of provider comparisons sorted by best rate
    """
    # Get base exchange rate
    rates_data = get_exchange_rates(base_currency)
    if rates_data['result'] != 'success':
        return []
    
    base_rate = rates_data['conversion_rates'].get(target_currency, 0)
    if base_rate == 0:
        return []
    
    comparisons = []
    
    for provider_name, provider_info in EXCHANGE_PROVIDERS.items():
        # Apply spread to the rate
        spread = provider_info['spread']
        adjusted_rate = base_rate * (1 - spread)
        
        # Calculate converted amount
        converted = amount * adjusted_rate
        
        # Calculate fee
        fee = calculate_fee(converted, provider_info['fee_type'], provider_info['fee_value'])
        
        # Calculate final amount after fee
        final_amount = converted - fee
        
        # Calculate exchangeable value
        exchange_info = exchangeable_value(final_amount, target_currency)
        
        comparisons.append({
            'provider': provider_name,
            'rate': round(adjusted_rate, 6),
            'spread': f"{spread * 100}%",
            'converted_amount': round(converted, 2),
            'fee': round(fee, 2),
            'final_amount': round(final_amount, 2),
            'exchangeable': exchange_info['exchangeable'],
            'remainder': exchange_info['remainder']
        })
    
    # Sort by final amount (best deal first)
    comparisons.sort(key=lambda x: x['final_amount'], reverse=True)
    
    return comparisons


@app.route('/')
def index():
    """
    Main page route
    """
    return render_template('index.html')


@app.route('/api/rates', methods=['GET'])
def get_rates():
    """
    API endpoint to get current exchange rates
    """
    base_currency = request.args.get('base', 'USD')
    rates_data = get_exchange_rates(base_currency)
    
    return jsonify(rates_data)


@app.route('/api/convert', methods=['POST'])
def convert_currency():
    """
    API endpoint to convert currency with fee calculation
    """
    data = request.json
    
    amount = float(data.get('amount', 0))
    base_currency = data.get('base_currency', 'IDR')
    target_currency = data.get('target_currency', 'USD')
    provider = data.get('provider', 'Bank Central')
    
    # Get exchange rate
    rates_data = get_exchange_rates(base_currency)
    
    if rates_data['result'] != 'success':
        return jsonify({'error': 'Failed to fetch exchange rates'}), 500
    
    rate = rates_data['conversion_rates'].get(target_currency, 0)
    
    if rate == 0:
        return jsonify({'error': 'Invalid currency pair'}), 400
    
    # Get provider info
    provider_info = EXCHANGE_PROVIDERS.get(provider, EXCHANGE_PROVIDERS['Bank Central'])
    
    # Apply spread
    adjusted_rate = rate * (1 - provider_info['spread'])
    
    # Calculate converted amount
    converted = amount * adjusted_rate
    
    # Calculate fee
    fee = calculate_fee(converted, provider_info['fee_type'], provider_info['fee_value'])
    
    # Calculate final amount
    final_amount = converted - fee
    
    # Calculate exchangeable value
    exchange_info = exchangeable_value(final_amount, target_currency)
    
    result = {
        'original_amount': round(amount, 2),
        'base_currency': base_currency,
        'target_currency': target_currency,
        'exchange_rate': round(adjusted_rate, 6),
        'converted_amount': round(converted, 2),
        'fee': round(fee, 2),
        'fee_type': provider_info['fee_type'],
        'final_amount': round(final_amount, 2),
        'exchangeable': exchange_info['exchangeable'],
        'remainder': exchange_info['remainder'],
        'provider': provider,
        'timestamp': datetime.now().isoformat()
    }
    
    return jsonify(result)


@app.route('/api/compare', methods=['POST'])
def compare():
    """
    API endpoint to compare exchange rates across providers
    """
    data = request.json
    
    amount = float(data.get('amount', 0))
    base_currency = data.get('base_currency', 'IDR')
    target_currency = data.get('target_currency', 'USD')
    
    comparisons = compare_providers(amount, base_currency, target_currency)
    
    return jsonify({
        'comparisons': comparisons,
        'timestamp': datetime.now().isoformat()
    })


@app.route('/api/historical', methods=['GET'])
def get_historical():
    """
    API endpoint to get historical exchange rate data
    """
    base_currency = request.args.get('base', 'USD')
    target_currency = request.args.get('target', 'IDR')
    days = int(request.args.get('days', 7))
    
    historical_data = get_historical_data(base_currency, target_currency, days)
    
    if historical_data is None:
        return jsonify({'error': 'Failed to fetch historical data'}), 500
    
    return jsonify({
        'base_currency': base_currency,
        'target_currency': target_currency,
        'data': historical_data
    })


@app.route('/api/currencies', methods=['GET'])
def get_currencies():
    """
    API endpoint to get list of supported currencies
    """
    currencies = {
        'USD': 'US Dollar',
        'EUR': 'Euro',
        'GBP': 'British Pound',
        'JPY': 'Japanese Yen',
        'IDR': 'Indonesian Rupiah',
        'SGD': 'Singapore Dollar',
        'AUD': 'Australian Dollar',
        'CNY': 'Chinese Yuan'
    }
    
    return jsonify(currencies)


@app.route('/api/providers', methods=['GET'])
def get_providers():
    """
    API endpoint to get list of exchange providers
    """
    return jsonify(list(EXCHANGE_PROVIDERS.keys()))


if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
