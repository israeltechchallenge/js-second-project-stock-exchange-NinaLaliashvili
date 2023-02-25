// Get every html element
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const theLoader = document.getElementById("loader");
const baseUrl =
  "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";

// Function to make the spinner visible
function enableSpinner() {
  theLoader.classList.remove("invisible");
}

// Function to make the spinner invisible
function disableSpinner() {
  theLoader.classList.add("invisible");
}

// Function to display search results from the API
async function getSearchResults() {
  const searchTerm = searchInput.value;
  const endpoint = `${baseUrl}search?query=${searchTerm}&limit=10&exchange=NASDAQ`;

  try {
    const response = await fetch(endpoint);
    const data = await response.json();

    searchResults.innerHTML = "";
    for (let i = 0; i < data.length; i++) {
      try {
        const dataSpecifics = data[i];
        const logoUrl = await getLogoUrl(dataSpecifics.symbol);
        const stockChange = await getStockChange(dataSpecifics.symbol);
        const stockChangeColor = getStockChangeColor(stockChange);

        const resultHtml = createResultHtml(
          dataSpecifics,
          logoUrl,
          stockChange,
          stockChangeColor
        );
        searchResults.innerHTML += resultHtml;
      } catch (error) {
        console.log("Error from server");
      }
    }

    disableSpinner();
    updateUrlQuery(searchTerm);
  } catch (error) {
    console.log("Error from server");
  }
}

// Function to get the logo image URL for a given company
async function getLogoUrl(symbol) {
  const logoEndpoint = `${baseUrl}company/profile/${symbol}`;
  const logoResponse = await fetch(logoEndpoint);
  const logoData = await logoResponse.json();
  return logoData.profile.image;
}

// Function to get the stock change percentage for a given company
async function getStockChange(symbol) {
  const quoteEndpoint = `${baseUrl}quote/${symbol}`;
  const quoteResponse = await fetch(quoteEndpoint);
  const quoteData = await quoteResponse.json();
  return quoteData[0].changesPercentage;
}

// Function to get the color of the stock change based on its value
function getStockChangeColor(stockChange) {
  let stockChangeColor = "black";
  if (parseFloat(stockChange) < 0) {
    stockChangeColor = "red";
  } else if (parseFloat(stockChange) > 0) {
    stockChangeColor = "lightgreen";
  }
  return stockChangeColor;
}

// Function to create the HTML for a single search result
function createResultHtml(
  dataSpecifics,
  logoUrl,
  stockChange,
  stockChangeColor
) {
  return `
    <li class="company-result">
      <a href="company.html?symbol=${dataSpecifics.symbol}" target="_blank" class="a-href-style">
        <div class="result-details">
          <img src="${logoUrl}" alt="${dataSpecifics.name} logo" class="company-logo2">
          <div class="company-name">
            <span class="symbol">${dataSpecifics.symbol}</span> - <span class="name">${dataSpecifics.name}</span>
          </div>
          <div class="stock-change" style="color: ${stockChangeColor};">${stockChange}</div>
        </div>
      </a>
    </li>`;
}

// Function to update the URL query with the search term
function updateUrlQuery(searchTerm) {
  const newUrl = new URL(window.location.href);
  newUrl.searchParams.set("query", searchTerm);
  window.history.pushState(null, null, newUrl);
}
//My main function.
function mainFunction() {
  enableSpinner();
  getSearchResults();
}

// Enter key function..
function handleInputUp(e) {
  if (e.keyCode === 13) {
    enableSpinner();
    getSearchResults();
  }
}
searchButton.addEventListener("click", mainFunction);
searchInput.addEventListener("keyup", handleInputUp);

// Auto search option to the main page
let timeout;
function debounce(func, delay) {
  clearTimeout(timeout);
  timeout = setTimeout(func, delay);
}
searchInput.addEventListener("input", function () {
  enableSpinner();
  debounce(getSearchResults, 500);
});

// check if there is a query string with a search value when the page loads.
window.onload = function () {
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get("query");

  if (searchQuery) {
    searchInput.value = searchQuery;
    mainFunction();
  }
};
