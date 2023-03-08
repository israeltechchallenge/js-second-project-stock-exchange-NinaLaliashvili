class SearchForm {
  constructor(container) {
    this.container = container;
    this.form = this.container.querySelector("#searchForm");
    this.input = this.container.querySelector("#searchInput");
    this.onSubmit = null;
    this.form.addEventListener("submit", this.handleSubmit.bind(this));
  }

  handleSubmit(event) {
    event.preventDefault();
    const searchTerm = this.input.value;
    if (this.onSubmit) {
      this.onSubmit(searchTerm);
    }
  }
}
