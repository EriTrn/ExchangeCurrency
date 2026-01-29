# Quick Start Guide 🚀

Get your Currency Exchange application up and running in 5 minutes!

## Prerequisites

Before you begin, make sure you have:
- ✅ Python 3.8 or higher installed
- ✅ pip (Python package installer)
- ✅ A modern web browser (Chrome, Firefox, Safari, or Edge)
- ✅ Internet connection
- ✅ A free ExchangeRate-API key

## Step-by-Step Installation

### 1. Download the Project

If you haven't already, download and extract the project files to your computer.

### 2. Open Terminal/Command Prompt

Navigate to the project directory:

```bash
cd path/to/currency-exchange-app
```

### 3. Install Dependencies

Run the following command:

```bash
pip install -r requirements.txt
```

This will install:
- Flask 3.0.0
- requests 2.31.0
- Werkzeug 3.0.1

### 4. Get Your Free API Key

1. Visit [ExchangeRate-API](https://www.exchangerate-api.com/)
2. Click "Get Free Key"
3. Sign up with your email
4. Copy your API key

### 5. Configure the Application

Open `app.py` in a text editor and find this line:

```python
API_KEY = 'your_api_key_here'
```

Replace `'your_api_key_here'` with your actual API key:

```python
API_KEY = 'abc123def456ghi789'  # Your actual key
```

### 6. Start the Server

Run the application:

```bash
python app.py
```

You should see output like:

```
 * Running on http://0.0.0.0:5000
 * Running on http://127.0.0.1:5000
Press CTRL+C to quit
```

### 7. Open in Browser

Open your web browser and go to:

```
http://localhost:5000
```

🎉 **Congratulations!** Your Currency Exchange application is now running!

## First Use

### Converting Currency

1. **Enter an amount** in the amount field (e.g., 1000000)
2. **Select source currency** from the "From" dropdown (default: IDR)
3. **Select target currency** from the "To" dropdown (default: USD)
4. **Choose a provider** from the provider dropdown
5. Click **"Convert Now"**
6. View your results below the converter

### Swapping Currencies

- Click the **swap button** (↕️) between the currency selectors
- The currencies will switch automatically
- Click "Convert Now" again to see the reversed conversion

### Comparing Providers

1. Scroll down to the **"Provider Comparison"** section
2. Click **"Compare All Providers"**
3. See a ranked table showing all providers
4. The best deal is highlighted at the top with a 🏆 badge

### Viewing Charts

- Scroll to the **"Historical Trends"** section
- View the **7-day** and **30-day** trend charts
- Charts update automatically when you change currencies
- Hover over chart points to see exact values

## Common Issues & Solutions

### Problem: "Module not found" error

**Solution:** Make sure you installed all dependencies:
```bash
pip install -r requirements.txt
```

### Problem: "Address already in use" error

**Solution:** Port 5000 is being used by another application. Either:
1. Stop the other application, or
2. Change the port in `app.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Changed to 5001
```

### Problem: Exchange rates not loading

**Solution:** 
1. Check your API key is correctly configured in `app.py`
2. Verify your internet connection
3. Check if you've exceeded your API limit (free tier: 1,500 requests/month)

### Problem: Charts not showing

**Solution:**
1. Make sure JavaScript is enabled in your browser
2. Check the browser console for errors (F12 → Console)
3. Try refreshing the page (Ctrl+F5 or Cmd+Shift+R)

### Problem: Styling looks broken

**Solution:**
1. Clear your browser cache
2. Hard refresh the page (Ctrl+F5 or Cmd+Shift+R)
3. Check if all static files are in the correct folders

## Features Overview

### ✨ Real-Time Exchange Rates
- Live rates updated every 60 seconds
- Support for 8+ major currencies
- Automatic caching for better performance

### 💰 Fee Transparency
- Clear breakdown of all fees
- Shows both percentage and fixed fees
- Displays final amount after fees

### 📊 Historical Charts
- 7-day trend visualization
- 30-day trend visualization
- Interactive Chart.js graphs

### 🔄 Inverse Conversion
- One-click currency swap
- Automatic recalculation
- Smooth animations

### 🏆 Provider Comparison
- Compare 6 different providers
- Automatic ranking by best rate
- Shows spreads, fees, and final amounts

### 💵 Denomination Calculator
- Calculates exchangeable amount
- Shows remainder that can't be exchanged
- Based on actual currency denominations

## Keyboard Shortcuts

- **Enter** in amount field → Convert currency
- **Ctrl+R** or **Cmd+R** → Refresh page
- **F5** → Refresh exchange rates

## Tips for Best Results

1. **Keep the application running** - Rates update automatically every minute
2. **Compare providers** before converting to get the best deal
3. **Check historical charts** to see if rates are trending up or down
4. **Consider the remainder** - small amounts might not be exchangeable

## Next Steps

Now that your application is running:

1. **Explore all features** - Try converting different amounts and currencies
2. **Compare providers** - See which gives you the best rates
3. **Check the charts** - Understand market trends
4. **Read the full documentation** - See README.md for advanced features
5. **Customize it** - Modify colors, add currencies, or adjust providers

## Getting Help

If you encounter any issues:

1. Check this Quick Start Guide
2. Review the [README.md](README.md) file
3. Check the [API_DOCUMENTATION.md](API_DOCUMENTATION.md) for API details
4. Review browser console for JavaScript errors (F12 → Console)
5. Check the terminal/command prompt for Python errors

## Development Mode

The application runs in development mode by default with:
- Debug mode enabled
- Automatic reload on code changes
- Detailed error messages

For production use, see the "Deployment" section in README.md.

## Stopping the Application

To stop the server:
- Press **Ctrl+C** in the terminal/command prompt
- The server will shut down gracefully

To restart:
```bash
python app.py
```

## File Structure

Your project should look like this:

```
currency-exchange-app/
├── app.py                  # Main Flask application
├── requirements.txt        # Python dependencies
├── README.md              # Full documentation
├── QUICK_START.md         # This file
├── API_DOCUMENTATION.md   # API reference
├── .gitignore            # Git ignore rules
├── .env.example          # Environment config example
├── templates/
│   └── index.html        # Main HTML template
└── static/
    ├── css/
    │   └── style.css     # Custom styles
    └── js/
        └── app.js        # Frontend JavaScript
```

## System Requirements

**Minimum:**
- Python 3.8+
- 100 MB free disk space
- 512 MB RAM
- Modern web browser

**Recommended:**
- Python 3.10+
- 500 MB free disk space
- 1 GB RAM
- Latest browser version
- Fast internet connection

## Browser Compatibility

Tested and working on:
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## API Rate Limits

**Free Tier (ExchangeRate-API):**
- 1,500 requests per month
- Updates every 24 hours
- No historical data

**Pro Tier:**
- Unlimited requests
- Real-time updates
- Historical data access
- Priority support

With caching enabled, the application minimizes API calls.

---

**Happy Converting! 💱**

If you find this application useful, consider:
- ⭐ Starring the project
- 📝 Providing feedback
- 🐛 Reporting bugs
- 🎨 Suggesting improvements

---

*Built with ❤️ using Flask and Bootstrap*
