async function createMarquee() {
  try {
    // list of stocks from the API
    const response = await fetch(
      "https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list"
    );
    const data = await response.json();
    const stocks = data.slice(0, 30);

    const marquee = document.createElement("div");
    marquee.id = "marquee";
    document.body.insertBefore(marquee, document.body.firstChild);
    const container = document.createElement("div");
    container.classList.add("marquee-container");
    container.style.width = "100%";
    marquee.appendChild(container);

    //stock symbols and prices to the container
    stocks.forEach((stock) => {
      const symbol = document.createElement("span");
      symbol.textContent = `${stock.symbol}: `;
      container.appendChild(symbol);

      const price = document.createElement("span");
      price.classList.add("green");
      price.textContent = stock.price;
      container.appendChild(price);

      const separator = document.createElement("span");
      separator.textContent = " | ";
      container.appendChild(separator);
    });
  } catch (error) {
    console.error(error);
  }
}

createMarquee();
