const api = axios.create({
    baseURL: "https://www.coinbase.com/api/v2/assets/prices",
});

const coins = ["bitcoin", "ethereum"];

// the Chart is for chart.js 
function createChart(Chart, coinId, labels, data, symbol){
    const chartSection = document.querySelector("#chartSection");

    // canvas tag is just a rectangle box
    const canvas = document.createElement("canvas");
    // assign ID
    // i will display 2 chart bitcoin and ethereum so that why we need ID
    canvas.id = coinId;
    chartSection.appendChild(canvas);

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
        // set responsive
        options: {
            responsive: true,
        },
    });
}

async function makeCharts() {
    const chartSection = document.querySelector("#chartSection");
    // add loader spinner
    chartSection.innerHTML = `<div class="loader"></div>`
    const responses = await Promise.all(
        coins.map(async(coin) => {
            // access api
            const response = await api.get(`/${coin}`);
            const prices = response.data.data.prices.hour.prices.slice(0,24).reverse();
            // using _ is disregard the prices we only want hour
            const labels = prices.map(([_, timestamp]) => 
                // creates a new Date object representing that moment in time.
                // my api unit is second so i need to * 1000 to make it millisecond for JS
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