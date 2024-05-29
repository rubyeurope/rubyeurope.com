export const CustomControlButton = (label, title) => {
  const controlButton = document.createElement("button");

  Object.assign(controlButton.style, {
    backgroundColor: "#fff",
    borderRadius: "2px",
    boxShadow: "0 2px 6px rgba(0,0,0,.3)",
    color: "rgb(25,25,25)",
    cursor: "pointer",
    fontFamily: "Roboto,Arial,sans-serif",
    fontSize: "14px",
    lineHeight: "28px",
    margin: "0 6px",
    padding: "0 17px",
    textAlign: "center",
  });
  controlButton.textContent = label;
  controlButton.title = title;
  controlButton.type = "button";
  controlButton.setAttribute("id", "zoomOutBtn");

  return controlButton;
};
