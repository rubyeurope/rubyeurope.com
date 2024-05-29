import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["menu", "openBtn", "closeBtn"];

  connect() {
    const pathname = window.location.pathname;

    Array.from(this.menuTarget.children)
      .find((item) => item.innerHTML.includes(pathname))
      .classList.add("text-red");
  }

  usesNavMenu() {
    return window.innerWidth < 768;
  }

  close() {
    if (!this.usesNavMenu()) return;

    this.closeBtnTarget.classList.add("hidden");
    this.openBtnTarget.classList.remove("hidden");
    this.menuTarget.classList.add("hidden");
    this.menuTarget.classList.remove("open");
    this.menuTarget.classList.remove("shadow-xl");
  }

  open() {
    if (!this.usesNavMenu()) return;

    this.closeBtnTarget.classList.remove("hidden");
    this.openBtnTarget.classList.add("hidden");
    this.menuTarget.classList.remove("hidden");
    this.menuTarget.classList.add("open");
    this.menuTarget.classList.add("shadow-xl");
  }
}
