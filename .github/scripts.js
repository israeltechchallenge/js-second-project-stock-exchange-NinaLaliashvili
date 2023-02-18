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

    searchResults.innerHTML += `<li class="company-result"><a href="company.html?symbol=${dataSpecifics.symbol}"  target="_blank" class="a-href-style"><span class="symbol">${dataSpecifics.symbol}</span> - <span class="name">${dataSpecifics.name}</span></a></li>`;
  }
  disableSpinner();
  searchInput.value = "";
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
