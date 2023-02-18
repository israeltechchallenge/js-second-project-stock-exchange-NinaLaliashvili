// Get every html element
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const searchResults = document.getElementById("searchResults");
const theLoader = document.getElementById("loader");

//create function to make my spinner visible.
function enableSpinner() {
  theLoader.classList.remove("invisible");
}

//create function to make my spinner unvisible
function disableSpinner() {
  theLoader.classList.add("invisible");
}

//create async function for my API, to display 10 results from the server and create the list.
async function getSearchResults() {
  const searchTerm = searchInput.value;
  const endpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${searchTerm}&limit=10&exchange=NASDAQ`;

  const response = await fetch(endpoint);
  const data = await response.json();

  searchResults.innerHTML = "";
  for (let i = 0; i < data.length; i++) {
    const dataSpecifics = data[i];

    // Get the logo image URL for the company
    const logoEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${dataSpecifics.symbol}`;
    const logoResponse = await fetch(logoEndpoint);
    const logoData = await logoResponse.json();
    const logoUrl = logoData.profile.image;

    // Get the stock change percentage for the company
    const quoteEndpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/quote/${dataSpecifics.symbol}`;
    const quoteResponse = await fetch(quoteEndpoint);
    const quoteData = await quoteResponse.json();
    const stockChange = quoteData[0].changesPercentage;

    let stockChangeColor = "black";
    if (parseFloat(stockChange) < 0) {
      stockChangeColor = "red";
    } else if (parseFloat(stockChange) > 0) {
      stockChangeColor = "lightgreen";
    }

    searchResults.innerHTML += `<li class="company-result">
    <a href="company.html?symbol=${dataSpecifics.symbol}" target="_blank" class="a-href-style">
      <div class="result-details">
        <img src="${logoUrl} " alt="${dataSpecifics.name} logo" class="company-logo2">
        <div class="company-name">
          <span class="symbol">${dataSpecifics.symbol}</span> - <span class="name">${dataSpecifics.name}</span>
        </div>
        <div class="stock-change" style="color: ${stockChangeColor};">${stockChange}</div>
      </div>
    </a>
  </li>`;
  }

  disableSpinner();
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
