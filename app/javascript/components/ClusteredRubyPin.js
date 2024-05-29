import { stringToHtmlElement } from "helpers/stringToHtmlElement";

export const ClusteredRubyPin = (count) => {
  return stringToHtmlElement(
    `<svg width="31" height="23" xmlns="http://www.w3.org/2000/svg">
      <g>
        <title>Layer 1</title>
        <polygon id="svg_1" fill="#CC342D" points="0.9145336151123047,7.795956611633301 7.9231367111206055,0.7677670121192932 23.07686424255371,0.7677670121192932 30.085466384887695,7.795956611633301 15.499992370605469,22.23223304748535 " stroke="white"/>
        <text stroke="null" x="15.5" y="9.7552" text-anchor="middle" font-size="12" dominant-baseline="middle" font-family="roboto,arial,sans-serif" fill="#fff" id="svg_2">${count}</text>
      </g>
    </svg>`,
    "image/svg+xml"
  );
};
