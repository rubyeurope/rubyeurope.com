export const RubyPin = (href) => {
  const pinContainer = document.createElement("div");
  const svgContainer = document.createElement("div");

  Object.assign(pinContainer.style, { width: "28px", height: "21px" });
  Object.assign(svgContainer.style, {
    background: `url(${href}) no-repeat center`,
    backgroundSize: "contain",
    width: "100%",
    height: "100%",
  });

  pinContainer.append(svgContainer);

  return pinContainer;
};
