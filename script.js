// Reduce repetitive code
const api = axios.create({
    baseURL: "https://www.coinbase.com/api/v2/assets/prices",
});

// this will be uses with  api.get
const coins = ["bitcoin", "ethereum"];

// For chart.js 
function createChart(Chart, coinId, labels, data, symbol){
    const chartSection = document.querySelector("#chartSection");

    // canvas tag is just a rectangle box
    const canvas = document.createElement("canvas");
    canvas.id = coinId;
    chartSection.appendChild(canvas);

    // creating line chart using Chart.js
    new Chart(canvas, {
        // draw a line chart 
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: `${symbol}, price`,
                data: data,
                borderColor: "rgba(58, 166, 237, 0.78)",
                backgroundColor: "rgba(54, 163, 235, 0.2)",
                borderWidth: 2,
                // fill is like a shadow
                fill: true,
            }],
        },
        // Automatically resize if the screen changes size
        options: {
            responsive: true,
        },
    });
}

async function makeCharts() {
    const chartSection = document.querySelector("#chartSection");
    // add loading spinner
    chartSection.innerHTML = `<div class="loader"></div>`
    const responses = await Promise.all(
        coins.map(async(coin) => {
            // access api
            const response = await api.get(`/${coin}`);
            const prices = response.data.data.prices.hour.prices.slice(0,24).reverse();
            // using _ is disregard the prices we only want hour
            const labels = prices.map(([_, timestamp]) => 
                // creates a new Date object representing that moment in time.
                // Unit is second so i need to * 1000 to make it millisecond for JS
                new Date(timestamp * 1000).toLocaleTimeString()
            );
            const data = prices.map(([price]) => Number(price));
            return {
                coinId: coin, labels, data, 
                symbol: response.data.data.base,
            };
        })
    );

    chartSection.innerHTML = "";

    responses.forEach((res) => 
        createChart(Chart, res.coinId, res.labels, res.data, res.symbol)
    );
}

makeCharts();

// repeat makeCHarts funciton every 10000 millisecond or 10 second
setInterval(makeCharts, 10000);