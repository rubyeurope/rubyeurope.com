const navigation = document.querySelector("[data-site-header]");

if (navigation) {
  const toggle = navigation.querySelector("[data-nav-toggle]");
  const menu = navigation.querySelector("[data-site-nav]");
  const desktop = window.matchMedia("(min-width: 48rem)");
  let isOpen = false;

  const render = () => {
    const menuIsOpen = !desktop.matches && isOpen;

    menu.hidden = !desktop.matches && !menuIsOpen;
    toggle.setAttribute("aria-expanded", String(menuIsOpen));
    navigation.toggleAttribute("data-menu-open", menuIsOpen);
  };

  const close = ({ returnFocus = false } = {}) => {
    isOpen = false;
    render();

    if (returnFocus) toggle.focus();
  };

  toggle.addEventListener("click", () => {
    isOpen = !isOpen;
    render();
  });

  menu.addEventListener("click", (event) => {
    if (event.target.closest("a") && !desktop.matches) close();
  });

  navigation.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isOpen) close({ returnFocus: true });
  });

  desktop.addEventListener("change", () => {
    isOpen = false;
    render();
  });

  render();
}
