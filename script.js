const PAIRS = ['BTCUSDT', 'BNBUSDT', 'BNBBUSD', 'USDTBRL', 
    'ETHUSDT', 'BATUSDT', 'ADAUSDT', 'DOGEUSDT', 'SHIBUSDT',
    'DASHUSDT', 'ALICEUSDT',];

const URL_API = 'https://api.binance.com/api/v3/ticker/24hr';

let table = document.querySelector('table');
let tbody = table.querySelector('tbody');

function newRow(obj) {
    let tr            = document.createElement('tr');
    let tdPair        = document.createElement('td');
    let tdLastPrice   = document.createElement('td');
    let tdPriceChange = document.createElement('td');
    let tdHighPrice   = document.createElement('td');
    let tdLowPrice    = document.createElement('td');
    let tdVolume24h   = document.createElement('td');
    tdPair.classList.add('first-column');
    tdPair.textContent        = obj.symbol;
    tdLastPrice.textContent   = obj.lastPrice;
    tdPriceChange.textContent = `${Number(obj.priceChangePercent).toFixed(2)}%`;
    tdPriceChange.style.color = obj.priceChangePercent < 0 ? 'red' : '#16c79a';
    tdHighPrice.textContent   = obj.highPrice;
    tdLowPrice.textContent    = obj.lowPrice;
    tdVolume24h.textContent   = `$${(Number(obj.quoteVolume) / 1e6).toFixed(2)}M`;
    tr.append(tdPair, tdLastPrice, tdPriceChange, tdHighPrice, tdLowPrice, tdVolume24h);
    tbody.appendChild(tr);
}

async function getData(pair) {
    let query = `${URL_API}?symbol=${pair}`;
    let response = await fetch(query);
    if (!response.ok) {
        throw new Error(response.status);
    }
    let obj = await response.json();
    return obj;
}

function fillTable() {
    for (let pair of PAIRS) {
        let tr = document.createElement('tr');
        let td = document.createElement('td');
        td.textContent = 'Fetching pair informations...';
        tr.appendChild(td);
        tbody.appendChild(tr);
        let obj = getData(pair);
        obj.then(function (data) {
            tbody.removeChild(tr);
            newRow(data)
        })
        .catch(error => {
            td.textContent = `${error.name}: ${error.message}`;
        });
    }
}

function clearTable() {
    tbody.innerHTML = '';
}

function showLoading() {
    tbody.innerHTML = 'Fetching data...';
}

window.addEventListener('DOMContentLoaded', fillTable);