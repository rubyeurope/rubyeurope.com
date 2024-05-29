import { Controller } from "@hotwired/stimulus";

export default class extends Controller {
  static targets = ["greeting"];

  scroll() {
    this.greetingTarget.scrollIntoView({ behavior: "smooth", block: "start" });
  }
}
