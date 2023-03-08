const params = new URLSearchParams(window.location.search);
const searchTerm = params.get("query");

if (searchTerm) {
  const input = document.querySelector("#searchInput");
  input.value = searchTerm;
  const results = new SearchResults(
    document.querySelector("#searchResultsContainer")
  );
  results.search(searchTerm);
}
