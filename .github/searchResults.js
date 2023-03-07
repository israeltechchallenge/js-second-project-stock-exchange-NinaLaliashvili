class SearchResults {
  constructor(container) {
    this.container = container;
    this.resultsList = this.container.querySelector("#searchResults");
    this.theLoader = document.getElementById("loader");
    this.baseUrl =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";
    this.timeout = null;
    this.currentSearchTerm = "";
  }

  async search(searchTerm) {
    this.enableSpinner();
    const endpoint = `${this.baseUrl}search?query=${searchTerm}&limit=10&exchange=NASDAQ`;

    // Save search term in query string params
    const params = new URLSearchParams(window.location.search);
    params.set("query", searchTerm);
    const newUrl = window.location.pathname + "?" + params.toString();
    window.history.pushState({}, "", newUrl);

    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      this.renderResults(data);
      return data;
    } catch (error) {
      console.log("Error from server");
    }
  }

  async renderResult(result) {
    const listItem = document.createElement("li");
    const symbol = result.symbol;
    const name = result.name;
    const logoUrl = await this.getLogoUrl(symbol);
    const stockChange = await this.getStockChange(symbol);
    const stockChangeColor = this.getStockChangeColor(stockChange);
    listItem.innerHTML = `
    <a href="company.html?symbol=${symbol}" target="_blank" class="a-href-style">
      <div class="result-details">
        <img src="${logoUrl}" alt="${name} logo" class="company-logo2">
        <div class="company-name">
          <span class="symbol">${symbol}</span> - <span class="name">${name}</span>
        </div>
        <div class="stock-change" style="color: ${stockChangeColor};">${stockChange}</div>
      </div>
    </a>`;
    this.resultsList.appendChild(listItem);
  }

  async renderResults(results) {
    this.resultsList.innerHTML = "";
    for (let i = 0; i < results.length; i++) {
      try {
        const result = results[i];
        await this.renderResult(result);
      } catch (error) {
        console.log("Error rendering result", error);
      }
    }
    this.disableSpinner();
  }

  async getLogoUrl(symbol) {
    const logoEndpoint = `${this.baseUrl}company/profile/${symbol}`;
    const logoResponse = await fetch(logoEndpoint);
    const logoData = await logoResponse.json();
    return logoData.profile.image;
  }

  async getStockChange(symbol) {
    const quoteEndpoint = `${this.baseUrl}quote/${symbol}`;
    const quoteResponse = await fetch(quoteEndpoint);
    const quoteData = await quoteResponse.json();
    return quoteData[0].changesPercentage;
  }

  getStockChangeColor(stockChange) {
    let stockChangeColor = "black";
    if (parseFloat(stockChange) < 0) {
      stockChangeColor = "red";
    } else if (parseFloat(stockChange) > 0) {
      stockChangeColor = "lightgreen";
    }
    return stockChangeColor;
  }

  enableSpinner() {
    this.theLoader.classList.remove("invisible");
  }

  disableSpinner() {
    this.theLoader.classList.add("invisible");
  }
}
