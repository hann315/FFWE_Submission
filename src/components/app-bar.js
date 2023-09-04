class AppBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <nav class="navbar">
      <div class="container">
        <p class="navbar-brand" id="logo"><i class="bi bi-clouds"></i> D' Weather</p>
        <div class="clock">
          <p><i class="bi bi-clock"></i> <span class="time"> </span><br>
          <i class="bi bi-calendar"></i> <span class="date">
        </div>
      </div>
    </nav>`;
  }
}
customElements.define('app-bar', AppBar);
