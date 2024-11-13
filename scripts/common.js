/**
 * @summary Loads a static component into the target element.
 *
 * @param {*} target
 * @param {*} componentName
 */
function loadComponent(target, componentName) {
  fetch(`sc-common/components/${componentName}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    });
}

function loadComponents() {
  const components = document.querySelectorAll(".component");
  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    loadComponent(component, componentName);
  });
}

function loadVideos() {
  const videos = document.querySelectorAll(".video");
  videos.forEach((video) => {
    fetch("sc-common/img/common/video-cover.svg")
      .then((response) => response.text())
      .then((svgText) => {
        const parser = new DOMParser();
        video.appendChild(
          parser.parseFromString(svgText, "text/html").querySelector("svg")
        );

        // Update cover title with provided value in the title attribute
        const spans = video.querySelector("text").childNodes;
        spans.forEach((span) => (span.innerHTML = ""));
        const titleWords = video.getAttribute("title").split(" ");
        const quocient = Math.ceil(titleWords.length / 4);
        for (let i = 0; i < titleWords.length; i++) {
          console.log(titleWords);
          spans[Math.floor(i / quocient)].innerHTML += `${titleWords[i]} `;
        }

        // Add video replacement logic on click over the video container
        const container = video.querySelector("#video-cover-container");
        container.style.cursor = "pointer";
        const iframe = document.createElement("iframe");
        const att = {
          width: window.getComputedStyle(container.querySelector("rect")).width,
          height: window.getComputedStyle(container.querySelector("rect"))
            .height,
          src: video.getAttribute("src"),
          title: video.getAttribute("title"),
          allow:
            "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share",
          referrerpolicy: "strict-origin-when-cross-origin",
          allowfullscreen: "",
        };
        for (const [key, value] of Object.entries(att)) {
          iframe.setAttribute(key, value);
        }
        container.addEventListener("click", () => {
          container.replaceChildren(iframe);
        });
      });
  });
}

/**
 * @summary Fetches and inserts a callout component into the target element.
 */
function loadCallout(target, calloutType) {
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

function loadCallouts() {
  const callouts = document.querySelectorAll(".callout");
  callouts.forEach((callout) => {
    const calloutType = callout.getAttribute("type");
    loadCallout(callout, calloutType);
  });
}

function loadFigure(module, fileName) {
  if (fileName == "") {
    console.error("Tried to load a figure with no name!");
    return;
  }

  fetch(`img/${module}/${fileName}.svg`)
    .then((response) => response.text())
    .then((figureText) => {
      const parser = new DOMParser();
      let figure = parser
        .parseFromString(figureText, "text/html")
        .querySelector("svg");
      if (figure == null) {
        console.error(`Figure ${fileName} is NULL!`);
        return;
      }
      figure.classList.add("d-none", "d-lg-block");

      let container = document.getElementById(fileName);
      container.insertAdjacentElement("afterbegin", figure);
    });
}

function loadFigures() {
  const module = document.querySelector("main").id;
  document.querySelectorAll("figure").forEach((element) => {
    loadFigure(module, element.id);
  });
}

function hideElement(element) {
  if (!element.hasAttribute("originalDisplay")) {
    element.setAttribute("originalDisplay", element.style.display);
  }
  element.style.display = "none";
}

function showElement(element) {
  element.style.display = element.getAttribute("originalDisplay");
}

function toggleVisibility(targetSelector) {
  let target = document.querySelector(targetSelector);
  if (target.style.display == "none") {
    showElement(target);
  } else {
    hideElement(target);
  }
}

/**
 * @brief Setup for Bootstrap popover components.
 */
function setUpPopovers() {
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

document.addEventListener("DOMContentLoaded", () => {
  loadFigures();
  loadVideos();
  loadComponents();
  loadCallouts();
  setUpPopovers();
});
