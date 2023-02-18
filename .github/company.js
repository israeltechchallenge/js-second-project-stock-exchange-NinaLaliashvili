window.onload = function () {
  const companySymbol = getQueryVariable("symbol");
  const companyImage = document.getElementById("companyImage");
  const companyName = document.getElementById("companyName");
  const companyDescription = document.getElementById("companyDescription");
  const companyStockPrice = document.getElementById("companyStockPrice");
  const companyChangePercentage = document.getElementById(
    "companyChangePercentage"
  );
  const companyLink = document.getElementById("companyLink");
  const companyChange = document.getElementById("companyChange");

  async function getCompanyProfile() {
    showLoadingIndicator();
    const endpoint = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${companySymbol}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    const dataResults = data.profile;
    console.log(dataResults);
    companyImage.src = dataResults.image;
    companyName.textContent = dataResults.companyName;
    companyDescription.textContent = dataResults.description;
    companyStockPrice.textContent = "$" + dataResults.price;
    companyChangePercentage.textContent = dataResults.changesPercentage;
    companyLink.href = dataResults.website;
    companyLink.textContent = dataResults.website;
    companyChange.textContent = "(" + dataResults.changes + "%)";

    // parse a string and return a floating point number, then check it.
    if (parseFloat(dataResults.changesPercentage) >= 0) {
      companyChange.classList.add("light-green");
    } else {
      companyChange.classList.add("red");
    }
    hideLoadingIndicator();
  }
  getCompanyProfile();

  async function historyOfStockPrice() {
    const endpointHistory = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${companySymbol}?serietype=line`;
    const res = await fetch(endpointHistory);
    const dataHistory = await res.json();
    return dataHistory.historical.map((point) => ({
      date: point.date,
      close: point.close,
    }));
  }

  let stockPriceHistory = [];
  async function loadChart() {
    showLoadingIndicator();
    stockPriceHistory = await historyOfStockPrice();

    const ctx = document.getElementById("myChart");
    new Chart(ctx, {
      type: "line",
      data: {
        labels: stockPriceHistory.map((point) => point.date),
        datasets: [
          {
            label: "Stock Price",
            data: stockPriceHistory.map((point) => point.close),
            borderWidth: 1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      },
    });
    hideLoadingIndicator();
  }

  loadChart();
};

function getQueryVariable(variable) {
  const query = window.location.search.substring(1);
  const queryParam = query.split("&");
  for (let i = 0; i < queryParam.length; i++) {
    const pair = queryParam[i].split("=");
    if (pair[0] === variable) {
      return pair[1];
    }
  }
  return false;
}

function showLoadingIndicator() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "flex";
}

function hideLoadingIndicator() {
  const loadingIndicator = document.getElementById("loadingIndicator");
  loadingIndicator.style.display = "none";
}
