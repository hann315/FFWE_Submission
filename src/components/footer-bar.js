class FooterBar extends HTMLElement {
  connectedCallback() {
    this.render();
  }
  render() {
    this.innerHTML = `
    <footer class="py-3 my-4">
      <p class="text-center">with 💙 <a href="https://github.com/hann315" target="_blank" rel="noreferrer">hann315</a><br>
      Sumber data oleh <a href="https://data.bmkg.go.id/prakiraan-cuaca/" target="_blank" rel="noreferrer">BMKG</a>
      dengan bantuan <a href="https://ibnux.github.io/BMKG-importer/" target="_blank" rel="noreferrer">IBNUX</a>
      </p>
    </footer>`;
  }
}
customElements.define("footer-bar", FooterBar);
