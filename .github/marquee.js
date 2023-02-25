class Marquee {
  constructor(container) {
    this.container = container;
    this.baseUrlMarquee =
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/";
  }

  async fetchStocks() {
    const endpoint = `${this.baseUrlMarquee}stock/list`;
    const response = await fetch(endpoint);
    const data = await response.json();
    return data.slice(0, 30);
  }

  createStockElement(stock) {
    const stockEl = document.createElement("div");

    const symbol = document.createElement("span");
    symbol.textContent = `${stock.symbol}: `;
    stockEl.appendChild(symbol);

    const price = document.createElement("span");
    price.classList.add("green");
    price.textContent = stock.price;
    stockEl.appendChild(price);

    const separator = document.createElement("span");
    separator.textContent = " | ";
    stockEl.appendChild(separator);

    return stockEl;
  }

  async createMarquee() {
    const stocks = await this.fetchStocks();

    const marqueeEl = document.createElement("div");
    marqueeEl.id = "marquee";

    const containerEl = document.createElement("div");
    containerEl.classList.add("marquee-container");
    containerEl.style.width = "100%";
    marqueeEl.appendChild(containerEl);

    stocks.forEach((stock) => {
      const stockEl = this.createStockElement(stock);
      containerEl.appendChild(stockEl);
    });

    this.container.insertBefore(marqueeEl, this.container.firstChild);
  }

  async init() {
    try {
      await this.createMarquee();
    } catch (error) {
      console.error(error);
    }
  }
}

const container = document.querySelector(".container");
const marquee = new Marquee(container);
marquee.init();
