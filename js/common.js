/**
 * A module for setup functions common across courses.
 * @module common
 */

import * as helper from "./helper.js";

/**
 * Loads a static component into the target element.
 * @param {HTMLElement} target
 * @param {string} componentName
 */
export async function loadComponent(target, componentName) {
  return fetch(`sc-common/components/${componentName}.html`)
    .then((response) => response.text())
    .then((html) => {
      const parser = new DOMParser();
      const componentBody = parser.parseFromString(html, "text/html").body;
      console.log(componentBody);

      const scripts = componentBody.querySelectorAll("script");
      scripts.forEach((script) => {
        const newScript = document.createElement("script");
        newScript.textContent = script.textContent;
        newScript.setAttribute("type", "module");
        document.body.appendChild(newScript);
        script.remove();
      });

      target.innerHTML = "";
      target.appendChild(componentBody);
    });
}

export function loadHeader(target, uTag) {
  fetch(`sc-common/components/header.html`)
    .then((response) => response.text())
    .then((headerStr) => {
      const parser = new DOMParser();
      const headerElement = parser
        .parseFromString(headerStr, "text/html")
        .querySelector(".container");

      if (document.body.id.startsWith("un")) {
        headerElement.querySelector(".un-tag").textContent =
          String(uTag).charAt(0).toUpperCase() + String(uTag).slice(1);
      }

      target.appendChild(headerElement);
    });
}

export function loadHero(target, uTag) {
  fetch(`sc-common/components/hero.html`)
    .then((response) => response.text())
    .then((heroStr) => {
      const parser = new DOMParser();
      const heroElement = parser
        .parseFromString(heroStr, "text/html")
        .querySelector(".container");

      // Set number image and title
      heroElement
        .querySelector("img")
        .setAttribute("src", `img/${uTag}/title-number.png`);
      heroElement.querySelector("h1").textContent =
        target.getAttribute("data-title");

      target.appendChild(heroElement);
    });
}

export function loadComponents() {
  let promises = [];
  const components = document.querySelectorAll(".component");
  const uTag = document.querySelector("body").id;

  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    switch (componentName) {
      case "header":
        loadHeader(component, uTag);
        break;

      case "hero":
        loadHero(component, uTag);
        break;

      default:
        promises.push(loadComponent(component, componentName));
        break;
    }
  });

  Promise.allSettled(promises).then(() => {
    const event = new CustomEvent("ComponentsLoaded");
    document.dispatchEvent(event);
    console.log("All components loaded");
  });
}

export function loadVideos() {
  const module = document.querySelector("body").id.slice(-1);
  const videos = document.querySelectorAll(".video");

  fetch(`img/common/video-cover-${module}.svg`)
    .then((response) => response.text())
    .then((svgText) => {
      const parser = new DOMParser();
      const svgTemplate = parser
        .parseFromString(svgText, "text/html")
        .querySelector("svg");

      videos.forEach((video) => {
        // Clone the SVG template for each video
        const svg = svgTemplate.cloneNode(true);

        // Update cover title with provided value in the title attribute
        const spans = svg.querySelector("text[id='video-title']").childNodes;
        spans.forEach((span) => (span.innerHTML = ""));

        const title = video.getAttribute("title");
        const words = title.split(" ");
        const quocient = Math.ceil(
          words.reduce((sum, str) => sum + str.length, 0) / 4,
        );
        let count = 0;
        for (let i = 0; i < words.length; i++) {
          spans[Math.floor(count / quocient)].innerHTML += `${words[i]} `;
          count += words[i].length;
        }

        // Add video replacement logic on click over the video container
        const container = svg.querySelector("#video-cover-container");
        container.style.cursor = "pointer";

        const iframe = document.createElement("iframe");
        const att = {
          width: "100%",
          height: "255px",
          src: video.getAttribute("src"),
          title: video.getAttribute("title"),
          frameborder: 0,
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: "",
        };
        for (const [key, value] of Object.entries(att)) {
          iframe.setAttribute(key, value);
        }

        iframe.style.margin = "30px 0";
        iframe.style.display = "none";
        video.appendChild(iframe);
        video.appendChild(svg);

        container.addEventListener("click", () => {
          helper.hideElement(svg);
          helper.showElement(iframe);
          video.style.backgroundImage = "url(img/common/video-cover-bg.svg)";
          video.style.backgroundSize = "cover";
          video.style.backgroundPosition = "center";
          video.style.backgroundRepeat = "no-repeat";
        });
      });
    });
}

/**
 * @summary Fetches and inserts a callout component into the target element.
 */
export function loadCallout(target, calloutType) {
  return fetch(`sc-common/components/callout-${calloutType}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    })
    .then(() => {
      if (calloutType == "glossary") {
        target.querySelector("h6").innerHTML = target.getAttribute("title");
      }
      target.querySelector("div.callout-body").innerHTML =
        target.getAttribute("text");
    });
}

export function loadCallouts() {
  const callouts = document.querySelectorAll(".callout");
  callouts.forEach((callout) => {
    const calloutType = callout.getAttribute("type");
    loadCallout(callout, calloutType);
  });
}

export function loadFigures() {
  const module = document.querySelector("body").id;
  let promises = [];
  document.querySelectorAll("figure").forEach((element) => {
    promises.push(helper.loadFigure(module, element.id));
  });

  Promise.allSettled(promises).then(() => {
    const event = new CustomEvent("SVGsLoaded");
    document.dispatchEvent(event);
    console.log("All SVG figures loaded");
  });
}

/**
 * @brief Setup for Bootstrap popover components.
 */
export function setUpPopovers() {
  const popoverTriggerList = document.querySelectorAll(
    '[data-bs-toggle="popover"]',
  );
  popoverTriggerList.forEach(async (popoverTriggerEl) => {
    const popover = new bootstrap.Popover(popoverTriggerEl, {
      html: true,
      trigger: "focus",
    });
  });
}

export function navigate(option, mainURL, pages) {
  const localURL = window.location.href;
  const currentDomain = localURL.substring(0, localURL.lastIndexOf("/"));
  const currentPage = localURL.substring(localURL.lastIndexOf("/") + 1);
  const currentPageIndex = pages.indexOf("./" + currentPage);
  const offset = option === "next" ? 1 : -1;

  if (
    currentPageIndex === -1 ||
    currentPageIndex + offset < 0 ||
    currentPageIndex + offset >= pages.length
  ) {
    window.location.href = mainURL;
    return;
  }

  const nextURL = pages[currentPageIndex + offset];
  const nextPage = nextURL.substring(nextURL.lastIndexOf("/") + 1);
  const nextDomain = nextURL.substring(0, nextURL.lastIndexOf("/"));
  if (currentDomain != nextDomain && nextDomain != ".") {
    window.location.href = nextURL;
    return;
  }
  window.location.href = localURL.replace(currentPage, nextPage);
}

/**
 * @brief Setup for the dropdown menu in the custom header component.
 * @param {object} links Object containing the links for the course.
 */
export function setupDropdownMenu(links) {
  const menu = document.getElementById("header-dropdown-menu");
  if (!menu) {
    console.error("Header dropdown menu not found!");
    return;
  }

  for (const item of menu.children) {
    const linkElement = item.querySelector("a");
    linkElement.setAttribute(
      "href",
      links[linkElement.getAttribute("data-name")],
    );
  }
}

/**
 * @brief Setup for the quiz call to action component.
 * @param {object} links Object containing the links for the course.
 */
export function setupQuizCTA(links) {
  const quizCTA = document.querySelector(".quiz-cta");
  if (!quizCTA) {
    console.error("No quiz call to action component found!");
    return;
  }

  const unNumber = document.body.id.at(-1);
  console.log(unNumber);
  quizCTA.querySelector("button").addEventListener("click", () => {
    window.open(links[`quiz${unNumber}`]);
  });

  console.debug("[ DEBUG ] Quiz CTA component set up.");
}
