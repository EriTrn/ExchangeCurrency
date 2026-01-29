/**
 * Currency Exchange Pro - Frontend JavaScript
 * Handles all client-side interactions, API calls, and chart rendering
 */

// Global state
let currentRates = null;
let chart7days = null;
let chart30days = null;

// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
    setupEventListeners();
    startAutoRefresh();
});

/**
 * Initialize the application
 */
function initializeApp() {
    console.log('Initializing Currency Exchange Pro...');
    fetchExchangeRates();
    updateLastUpdateTime();
}

/**
 * Setup all event listeners
 */
function setupEventListeners() {
    // Convert button
    document.getElementById('convertBtn').addEventListener('click', convertCurrency);
    
    // Swap currencies button
    document.getElementById('swapCurrencies').addEventListener('click', swapCurrencies);
    
    // Compare button
    document.getElementById('compareBtn').addEventListener('click', compareProviders);
    
    // Refresh rates button
    document.getElementById('refreshRates').addEventListener('click', function() {
        fetchExchangeRates(true);
    });
    
    // Auto-convert on currency change
    document.getElementById('fromCurrency').addEventListener('change', function() {
        if (document.getElementById('resultSection').style.display !== 'none') {
            convertCurrency();
        }
        loadHistoricalCharts();
    });
    
    document.getElementById('toCurrency').addEventListener('change', function() {
        if (document.getElementById('resultSection').style.display !== 'none') {
            convertCurrency();
        }
        loadHistoricalCharts();
    });
    
    // Amount input - trigger conversion on Enter key
    document.getElementById('amount').addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            convertCurrency();
        }
    });
    
    // Load charts on page load
    loadHistoricalCharts();
}

/**
 * Fetch exchange rates from API
 */
async function fetchExchangeRates(forceRefresh = false) {
    try {
        const baseCurrency = document.getElementById('fromCurrency').value;
        const response = await fetch(`/api/rates?base=${baseCurrency}`);
        
        if (!response.ok) {
            throw new Error('Failed to fetch rates');
        }
        
        const data = await response.json();
        currentRates = data;
        
        if (forceRefresh) {
            showNotification('Exchange rates updated successfully', 'success');
        }
        
        updateLastUpdateTime();
        
        return data;
    } catch (error) {
        console.error('Error fetching rates:', error);
        showNotification('Failed to fetch exchange rates', 'error');
        return null;
    }
}

/**
 * Convert currency
 */
async function convertCurrency() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    const provider = document.getElementById('provider').value;
    
    // Validation
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'warning');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        showNotification('Please select different currencies', 'warning');
        return;
    }
    
    // Show loading state
    const convertBtn = document.getElementById('convertBtn');
    const originalText = convertBtn.innerHTML;
    convertBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Converting...';
    convertBtn.disabled = true;
    
    try {
        const response = await fetch('/api/convert', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                base_currency: fromCurrency,
                target_currency: toCurrency,
                provider: provider
            })
        });
        
        if (!response.ok) {
            throw new Error('Conversion failed');
        }
        
        const result = await response.json();
        displayConversionResult(result);
        
    } catch (error) {
        console.error('Conversion error:', error);
        showNotification('Conversion failed. Please try again.', 'error');
    } finally {
        // Restore button state
        convertBtn.innerHTML = originalText;
        convertBtn.disabled = false;
    }
}

/**
 * Display conversion result
 */
function displayConversionResult(result) {
    // Show result section
    const resultSection = document.getElementById('resultSection');
    resultSection.style.display = 'block';
    
    // Update main result
    document.getElementById('convertedAmount').textContent = formatCurrency(result.final_amount);
    document.getElementById('resultCurrency').textContent = result.target_currency;
    
    // Update details
    document.getElementById('exchangeRate').textContent = 
        `1 ${result.base_currency} = ${formatNumber(result.exchange_rate)} ${result.target_currency}`;
    
    document.getElementById('grossAmount').textContent = 
        formatCurrency(result.converted_amount) + ' ' + result.target_currency;
    
    document.getElementById('feeAmount').textContent = 
        formatCurrency(result.fee) + ' ' + result.target_currency;
    
    document.getElementById('finalAmount').textContent = 
        formatCurrency(result.final_amount) + ' ' + result.target_currency;
    
    document.getElementById('exchangeable').textContent = 
        formatCurrency(result.exchangeable) + ' ' + result.target_currency;
    
    document.getElementById('remainder').textContent = 
        formatCurrency(result.remainder) + ' ' + result.target_currency;
    
    // Smooth scroll to result
    resultSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
}

/**
 * Swap currencies (Inverse Conversion)
 */
function swapCurrencies() {
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    
    // Swap values
    const temp = fromCurrency.value;
    fromCurrency.value = toCurrency.value;
    toCurrency.value = temp;
    
    // Trigger conversion if result is visible
    if (document.getElementById('resultSection').style.display !== 'none') {
        convertCurrency();
    }
    
    // Reload charts with new currency pair
    loadHistoricalCharts();
    
    // Fetch new rates for the swapped base currency
    fetchExchangeRates();
}

/**
 * Compare all providers
 */
async function compareProviders() {
    const amount = parseFloat(document.getElementById('amount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    // Validation
    if (!amount || amount <= 0) {
        showNotification('Please enter a valid amount', 'warning');
        return;
    }
    
    if (fromCurrency === toCurrency) {
        showNotification('Please select different currencies', 'warning');
        return;
    }
    
    // Show loading state
    const compareBtn = document.getElementById('compareBtn');
    const originalText = compareBtn.innerHTML;
    compareBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Comparing...';
    compareBtn.disabled = true;
    
    try {
        const response = await fetch('/api/compare', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                amount: amount,
                base_currency: fromCurrency,
                target_currency: toCurrency
            })
        });
        
        if (!response.ok) {
            throw new Error('Comparison failed');
        }
        
        const data = await response.json();
        displayComparisonResults(data.comparisons);
        
    } catch (error) {
        console.error('Comparison error:', error);
        showNotification('Comparison failed. Please try again.', 'error');
    } finally {
        // Restore button state
        compareBtn.innerHTML = originalText;
        compareBtn.disabled = false;
    }
}

/**
 * Display comparison results
 */
function displayComparisonResults(comparisons) {
    const tableBody = document.getElementById('comparisonTableBody');
    tableBody.innerHTML = '';
    
    comparisons.forEach((comp, index) => {
        const row = document.createElement('tr');
        
        // Add badge for best deal
        const rankCell = index === 0 
            ? `<td><span class="badge badge-best">🏆 Best</span></td>`
            : `<td>${index + 1}</td>`;
        
        row.innerHTML = `
            ${rankCell}
            <td><strong>${comp.provider}</strong></td>
            <td class="text-gradient">${formatNumber(comp.rate)}</td>
            <td><span class="badge bg-secondary">${comp.spread}</span></td>
            <td class="text-danger">${formatCurrency(comp.fee)}</td>
            <td><strong class="text-success">${formatCurrency(comp.final_amount)}</strong></td>
            <td>${formatCurrency(comp.exchangeable)}</td>
            <td class="text-warning">${formatCurrency(comp.remainder)}</td>
        `;
        
        tableBody.appendChild(row);
    });
    
    // Show comparison results section
    const comparisonResults = document.getElementById('comparisonResults');
    comparisonResults.style.display = 'block';
    
    // Scroll to comparison section
    comparisonResults.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

/**
 * Load historical charts
 */
async function loadHistoricalCharts() {
    const fromCurrency = document.getElementById('fromCurrency').value;
    const toCurrency = document.getElementById('toCurrency').value;
    
    // Load 7-day chart
    await loadChart(fromCurrency, toCurrency, 7, 'chart7days');
    
    // Load 30-day chart
    await loadChart(fromCurrency, toCurrency, 30, 'chart30days');
}

/**
 * Load a specific chart
 */
async function loadChart(baseCurrency, targetCurrency, days, canvasId) {
    try {
        const response = await fetch(
            `/api/historical?base=${baseCurrency}&target=${targetCurrency}&days=${days}`
        );
        
        if (!response.ok) {
            throw new Error('Failed to fetch historical data');
        }
        
        const data = await response.json();
        renderChart(data, canvasId, days);
        
    } catch (error) {
        console.error('Error loading chart:', error);
    }
}

/**
 * Render chart using Chart.js
 */
function renderChart(data, canvasId, days) {
    const ctx = document.getElementById(canvasId);
    
    if (!ctx) return;
    
    // Destroy existing chart if it exists
    if (canvasId === 'chart7days' && chart7days) {
        chart7days.destroy();
    } else if (canvasId === 'chart30days' && chart30days) {
        chart30days.destroy();
    }
    
    const labels = data.data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    });
    
    const rates = data.data.map(d => d.rate);
    
    // Create gradient
    const gradient = ctx.getContext('2d').createLinearGradient(0, 0, 0, 400);
    gradient.addColorStop(0, 'rgba(0, 102, 255, 0.3)');
    gradient.addColorStop(1, 'rgba(0, 102, 255, 0.01)');
    
    const chartConfig = {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: `${data.base_currency} to ${data.target_currency}`,
                data: rates,
                borderColor: '#0066FF',
                backgroundColor: gradient,
                borderWidth: 3,
                fill: true,
                tension: 0.4,
                pointRadius: 4,
                pointHoverRadius: 6,
                pointBackgroundColor: '#0066FF',
                pointBorderColor: '#fff',
                pointBorderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: true,
                    labels: {
                        color: '#E2E8F0',
                        font: {
                            family: 'Outfit',
                            size: 12
                        }
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(10, 22, 40, 0.95)',
                    titleColor: '#E2E8F0',
                    bodyColor: '#E2E8F0',
                    borderColor: '#0066FF',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    callbacks: {
                        label: function(context) {
                            return 'Rate: ' + formatNumber(context.parsed.y);
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#CBD5E1',
                        font: {
                            family: 'Outfit',
                            size: 11
                        }
                    }
                },
                y: {
                    grid: {
                        color: 'rgba(255, 255, 255, 0.05)',
                        drawBorder: false
                    },
                    ticks: {
                        color: '#CBD5E1',
                        font: {
                            family: 'JetBrains Mono',
                            size: 11
                        },
                        callback: function(value) {
                            return formatNumber(value);
                        }
                    }
                }
            }
        }
    };
    
    const chart = new Chart(ctx, chartConfig);
    
    // Store chart instance
    if (canvasId === 'chart7days') {
        chart7days = chart;
    } else if (canvasId === 'chart30days') {
        chart30days = chart;
    }
}

/**
 * Update last update time
 */
function updateLastUpdateTime() {
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit' 
    });
    
    document.getElementById('updateTime').textContent = `Updated ${timeString}`;
}

/**
 * Start auto-refresh for exchange rates (every 60 seconds)
 */
function startAutoRefresh() {
    setInterval(() => {
        fetchExchangeRates();
    }, 60000); // 60 seconds
}

/**
 * Format currency number
 */
function formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    }).format(amount);
}

/**
 * Format number with appropriate precision
 */
function formatNumber(number) {
    if (number >= 1000) {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        }).format(number);
    } else {
        return new Intl.NumberFormat('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 6
        }).format(number);
    }
}

/**
 * Show notification to user
 */
function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `alert alert-${type} position-fixed top-0 start-50 translate-middle-x mt-5`;
    notification.style.zIndex = '9999';
    notification.style.minWidth = '300px';
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="bi bi-${type === 'success' ? 'check-circle' : type === 'error' ? 'x-circle' : 'info-circle'} me-2"></i>
            ${message}
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Auto-remove after 3 seconds
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

/**
 * Smooth scroll functionality
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Log initialization
console.log('Currency Exchange Pro initialized successfully');
