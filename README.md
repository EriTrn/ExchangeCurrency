# Currency Exchange Web Application 💱

A professional, full-featured currency exchange web application built with Flask (Python) backend and modern HTML5, CSS3, JavaScript, and Bootstrap frontend.

![Currency Exchange Pro](https://img.shields.io/badge/Python-3.8+-blue.svg)
![Flask](https://img.shields.io/badge/Flask-3.0.0-green.svg)
![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3.0-purple.svg)

## 🌟 Features

### ✅ Core Functionality

1. **Real-Time Exchange Rates**
   - Integration with ExchangeRate-API for live currency data
   - Automatic refresh every 60 seconds
   - Caching mechanism to optimize API calls
   - Support for 8+ major currencies (USD, EUR, GBP, JPY, IDR, SGD, AUD, CNY)

2. **Historical Charts**
   - 7-day trend visualization
   - 30-day trend visualization
   - Interactive Chart.js graphs with smooth animations
   - Real-time data fetching and rendering

3. **Multi-Provider Comparison Engine**
   - Compare rates across 6 different providers
   - Includes banks and money changers
   - Shows spreads, fees, and final amounts
   - Automatic ranking (best deal highlighted)

4. **Inverse Conversion**
   - One-click currency swap functionality
   - Automatic recalculation after swap
   - Smooth animations for better UX

5. **Fee Calculator**
   - Transparent fee breakdown
   - Support for both percentage and fixed fees
   - Clear display of:
     - Exchange rate
     - Converted amount (before fees)
     - Service fee
     - Final amount (after fees)

6. **Denomination-Based Calculation**
   - Calculates exchangeable amount based on actual currency denominations
   - Shows remainder that cannot be exchanged
   - Supports denomination systems for all major currencies

### 🎨 Design Features

- **Modern UI/UX**: Clean, professional interface with deep ocean theme
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices
- **Smooth Animations**: Polished interactions and transitions
- **Custom Typography**: Outfit and JetBrains Mono fonts for elegant readability
- **Color-Coded Results**: Easy-to-read result displays with gradient accents
- **Dark Theme**: Eye-friendly dark interface with blue accents

## 🏗️ Architecture

### Backend (Flask)

```
app.py
├── Exchange Rate Management
│   ├── get_exchange_rates() - Fetch live rates with caching
│   ├── get_mock_rates() - Fallback mock data
│   └── get_historical_data() - Generate historical trends
│
├── Conversion Logic
│   ├── calculate_fee() - Fee calculation (percentage/fixed)
│   ├── exchangeable_value() - Denomination-based calculation
│   └── compare_providers() - Multi-provider comparison
│
└── API Endpoints
    ├── GET  /api/rates - Get current exchange rates
    ├── POST /api/convert - Convert currency
    ├── POST /api/compare - Compare providers
    ├── GET  /api/historical - Get historical data
    ├── GET  /api/currencies - List supported currencies
    └── GET  /api/providers - List exchange providers
```

### Frontend

```
templates/index.html
static/
├── css/
│   └── style.css - Modern custom styles
└── js/
    └── app.js - Main application logic
```

## 📦 Installation & Setup

### Prerequisites

- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Step 1: Clone or Download the Project

```bash
git clone https://github.com/EriTrn/ExchangeCurrency.git
cd currency-exchange-app
```

### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

### Step 3: Configure API Key

To get a free API key:
1. Visit [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Sign up for a free account
3. Copy your API key
4. Paste it in the `app.py` file

### Step 4: Run the Application

```bash
python app.py
```

The application will start on `http://localhost:5000`

### Step 5: Access the Application

Open your web browser and navigate to:
```
http://localhost:5000
```

## 🚀 Usage Guide

### Converting Currency

1. Enter the amount you want to convert
2. Select the source currency (From)
3. Select the target currency (To)
4. Choose an exchange provider
5. Click "Convert Now"
6. View detailed results including fees and exchangeable amount

### Swapping Currencies

- Click the swap button (↕️) between the currency selectors
- Currencies will be swapped instantly
- Conversion will be recalculated automatically

### Comparing Providers

1. Enter your amount and select currencies
2. Scroll to the "Provider Comparison" section
3. Click "Compare All Providers"
4. View a ranked table of all providers
5. Best deal is highlighted at the top

### Viewing Historical Charts

- Charts automatically update when you change currencies
- 7-day chart shows weekly trends
- 30-day chart shows monthly trends
- Hover over data points for detailed information

## 📊 API Endpoints Documentation

### GET /api/rates

Get current exchange rates for a base currency.

**Parameters:**
- `base` (optional): Base currency code (default: USD)

**Response:**
```json
{
  "result": "success",
  "base_code": "USD",
  "conversion_rates": {
    "IDR": 15750.50,
    "EUR": 0.92,
    "GBP": 0.79
  }
}
```

### POST /api/convert

Convert currency with fee calculation.

**Request Body:**
```json
{
  "amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD",
  "provider": "Bank Central"
}
```

**Response:**
```json
{
  "original_amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD",
  "exchange_rate": 0.0000625,
  "converted_amount": 62.50,
  "fee": 0.31,
  "final_amount": 62.19,
  "exchangeable": 62.00,
  "remainder": 0.19
}
```

### POST /api/compare

Compare rates across all providers.

**Request Body:**
```json
{
  "amount": 1000000,
  "base_currency": "IDR",
  "target_currency": "USD"
}
```

**Response:**
```json
{
  "comparisons": [
    {
      "provider": "Money Changer A",
      "rate": 0.0000629,
      "spread": "1.0%",
      "fee": 0.19,
      "final_amount": 62.71,
      "exchangeable": 62.00,
      "remainder": 0.71
    }
  ]
}
```

### GET /api/historical

Get historical exchange rate data.

**Parameters:**
- `base`: Base currency code
- `target`: Target currency code
- `days`: Number of days (7 or 30)

**Response:**
```json
{
  "base_currency": "USD",
  "target_currency": "IDR",
  "data": [
    {
      "date": "2025-01-20",
      "rate": 15723.45
    }
  ]
}
```

## 🔧 Configuration

### Exchange Providers

Edit `EXCHANGE_PROVIDERS` in `app.py` to customize providers:

```python
EXCHANGE_PROVIDERS = {
    'Your Bank': {
        'spread': 0.015,  # 1.5% spread
        'fee_type': 'percentage',  # or 'fixed'
        'fee_value': 0.5  # 0.5% or fixed amount
    }
}
```

### Supported Currencies

Add more currencies by editing the `/api/currencies` endpoint and adding denominations:

```python
DENOMINATIONS = {
    'YOUR_CURRENCY': [100, 50, 20, 10, 5, 1]
}
```

### Cache Duration

Modify cache duration in `app.py`:

```python
CACHE_DURATION = 60  # seconds
```

## 🎨 Customization

### Changing Colors

Edit CSS variables in `static/css/style.css`:

```css
:root {
    --primary: #0066FF;
    --secondary: #00D9FF;
    --accent: #FF3D71;
    /* ... more colors */
}
```

### Modifying Fonts

Update Google Fonts in `templates/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=YourFont:wght@400;700&display=swap" rel="stylesheet">
```

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🔒 Security Notes

1. **API Key Security**: Never commit your API key to version control
2. **Input Validation**: All user inputs are validated on both client and server side
3. **HTTPS**: Use HTTPS in production environments
4. **Rate Limiting**: Consider implementing rate limiting for production use

## 🐛 Troubleshooting

### Application won't start
- Ensure all dependencies are installed: `pip install -r requirements.txt`
- Check if port 5000 is available
- Verify Python version (3.8+)

### Exchange rates not updating
- Verify your API key is correct
- Check your internet connection
- Review API usage limits

### Charts not displaying
- Ensure Chart.js is loaded (check browser console)
- Verify historical data is being fetched
- Clear browser cache

### Styling issues
- Clear browser cache
- Ensure all CSS files are loaded
- Check browser console for errors

## 📈 Performance Optimization

- **Caching**: Rates are cached for 60 seconds to reduce API calls
- **Lazy Loading**: Charts load only when needed
- **Minification**: Consider minifying CSS/JS for production
- **CDN**: Using CDN for Bootstrap, Chart.js, and fonts

## 🚢 Deployment

### Production Checklist

1. Set `debug=False` in `app.py`
2. Use environment variables for API key
3. Configure proper WSGI server (Gunicorn, uWSGI)
4. Set up reverse proxy (Nginx)
5. Enable HTTPS
6. Implement rate limiting
7. Set up monitoring and logging

### Example with Gunicorn

```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:5000 app:app
```

## 📝 License

This project is provided as-is for educational and commercial use.

## 👨‍💻 Author

Professional Full-Stack Developer

## 🙏 Acknowledgments

- [ExchangeRate-API](https://www.exchangerate-api.com/) - Exchange rate data
- [Bootstrap](https://getbootstrap.com/) - UI framework
- [Chart.js](https://www.chartjs.org/) - Charting library
- [Google Fonts](https://fonts.google.com/) - Typography

## 📞 Support

For issues or questions:
1. Check the troubleshooting section
2. Review the API documentation
3. Check browser console for errors

---

**Built with ❤️ using Flask, Bootstrap, and modern web technologies**
