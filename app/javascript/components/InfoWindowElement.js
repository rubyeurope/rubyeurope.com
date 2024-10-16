import { stringToHtmlElement } from "helpers/stringToHtmlElement";

export const InfoWindowElementContent = ({ img, link, description, event_date, location }) => {
  return `
    <div id="content">
      <div class="flex">
        <img src=${img} class="mr-5 w-20 h-20" />
        <div class="w-2/3">
         ${event_date ? `<p>${event_date}</p>` : ""}
         ${location ? `<p class="mb-2">${location}</p>` : ""}
          <a
            href="${link}"
            rel="noopener noreferrer"
            target="_blank"
            class="underline text-gray-dark"
          >
            Go to the website
          </a>
        </div>
      </div>
      <p class="mt-4 text-gray border-t border-gray-light py-4">${description}</p>
    </div>
  `;
};

export const InfoWindowElementHeader = (name) => {
  return stringToHtmlElement(`<h3 class="mb-3 font-bold text-base text-red">${name}</h3>`);
};
