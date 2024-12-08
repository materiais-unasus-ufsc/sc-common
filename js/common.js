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

export function loadHeader(target) {
  fetch(`sc-common/components/header.html`)
    .then((response) => response.text())
    .then((headerStr) => {
      const parser = new DOMParser();
      const headerElement = parser
        .parseFromString(headerStr, "text/html")
        .querySelector(".container");
      headerElement.querySelector(".un-tag").textContent =
        target.getAttribute("un-tag");

      target.appendChild(headerElement);
    });
}

export function loadComponents() {
  let promises = [];
  const components = document.querySelectorAll(".component");
  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    switch (componentName) {
      case "header":
        loadHeader(component);
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
  const module = document.querySelector("main").id.slice(-1);
  const videos = document.querySelectorAll(".video");
  videos.forEach((video) => {
    fetch(`img/common/video-cover-${module}.svg`)
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        const svg = parser
          .parseFromString(svgText, "text/html")
          .querySelector("svg");

        // Update cover title with provided value in the title attribute
        const spans = svg.querySelector("text").childNodes;
        spans.forEach((span) => (span.innerHTML = ""));

        const title = video.getAttribute("title");
        const words = title.split(" ");
        const quocient = Math.ceil(
          words.reduce((sum, str) => sum + str.length, 0) / 4
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

        iframe.style.margin = "20px 0";
        iframe.style.display = "none";
        video.appendChild(iframe);
        video.appendChild(svg);

        container.addEventListener("click", () => {
          helper.hideElement(svg);
          helper.showElement(iframe);
          video.style.backgroundImage = "url(img/common/video-cover-bg.png)";
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
  fetch(`sc-common/components/callout-${calloutType}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    })
    .then(() => {
      if (calloutType == "glossary") {
        target.querySelector("h6").innerText = target.getAttribute("title");
      }
      target.querySelector("p").innerHTML = target.getAttribute("text");
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
  const module = document.querySelector("main").id;
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
    '[data-bs-toggle="popover"]'
  );
  popoverTriggerList.forEach((popoverTriggerEl) => {
    const popover = new bootstrap.Popover(popoverTriggerEl, {
      html: true,
    });

    popoverTriggerEl.addEventListener("focus", () => {
      popover.show();
    });

    popoverTriggerEl.addEventListener("focusout", () => {
      const _this = popoverTriggerEl;
      if (!document.querySelector(".popover:focus")) {
        popover.hide();
      } else {
        document
          .querySelector(".popover")
          .addEventListener("mouseleave", function handler() {
            popover.hide();
            this.removeEventListener("mouseleave", handler);
          });
      }
    });
  });
}

export function navigate(option) {
  const mainPageURL = "https://unasus-cp.moodle.ufsc.br/course/view.php?id=416";
  const pages = [
    "sobre.html",
    // "desafio.html",
    "un1.html",
    "un2.html",
    "un3.html",
    "un4.html",
    // "reconhecendo-a-realidade.html",
    // "questoes-avaliativas.html",
    // "tomada-de-opiniao.html",
  ];

  const currentPageURL = window.location.href;
  const currentPage = currentPageURL.substring(
    currentPageURL.lastIndexOf("/") + 1
  );
  const currentPageIndex = pages.indexOf(currentPage);
  const offset = option === "next" ? 1 : -1;

  if (
    currentPageIndex === -1 ||
    currentPageIndex + offset < 0 ||
    currentPageIndex + offset >= pages.length
  ) {
    window.location.href = mainPageURL;
    return;
  }

  const nextPage = pages[currentPageIndex + offset];
  window.location.href = currentPageURL.replace(currentPage, nextPage);
}
