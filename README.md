# Crypto Price Chart (Bitcoin & Ethereum)

This project displays real-time cryptocurrency price charts for **Bitcoin** and **Ethereum**, using the [Coinbase API]
(https://www.coinbase.com/) and **Chart.js** for visualization.
The data automatically refreshes every 10 seconds to show the latest hourly prices.

---

## Features

* Interactive line charts built with Chart.js
* Fetches live data from the Coinbase API
* Automatically updates every 10 seconds
* Responsive design for different screen sizes
* Loading spinner shown while data is being fetched

---

## Technologies Used

* **HTML5** — structure
* **CSS3** — styling and animations
* **JavaScript (ES6)** — logic and DOM manipulation
* **Axios** — HTTP requests
* **Chart.js** — data visualization

---

## Project Structure

```
├── index.html        # Main HTML file
├── style.css         # Styles and spinner animation
├── script.js         # Main JavaScript logic
└── README.md         # Project documentation
```

---

## How It Works

### 1. Create an Axios instance

```js
const api = axios.create({
    baseURL: "https://www.coinbase.com/api/v2/assets/prices",
});
```

This defines a reusable Axios instance for making requests to the Coinbase API.

---

### 2. Fetch data

The app retrieves hourly price data for Bitcoin and Ethereum:

```js
const coins = ["bitcoin", "ethereum"];
const response = await api.get(`/${coin}`);
```

---

### 3. Process data

Extract the latest 24 hourly prices and convert timestamps to readable times:

```js
const prices = response.data.data.prices.hour.prices.slice(0, 24).reverse();
const labels = prices.map(([_, timestamp]) =>
    new Date(timestamp * 1000).toLocaleTimeString()
);
const data = prices.map(([price]) => Number(price));
```

---

### 4. Render the charts

Each chart is created with Chart.js:

```js
new Chart(canvas, {
    type: "line",
    data: { labels, datasets: [...] },
    options: { responsive: true },
});
```

---

### 5. Auto-update every 10 seconds

The charts refresh automatically using `setInterval`:

```js
setInterval(makeCharts, 10000);
```

---


## Example API Response

Example data from: `https://www.coinbase.com/api/v2/assets/prices/bitcoin`

```json
{
  "data": {
    "base": "BTC",
    "prices": {
      "hour": {
        "prices": [
          ["67234.12", 1697557200],
          ["67220.57", 1697553600]
        ]
      }
    }
  }
}
```

---

