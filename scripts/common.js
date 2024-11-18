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
          // console.log(titleWords);
          spans[Math.floor(count / quocient)].innerHTML += `${words[i]} `;
          count += words[i].length;
        }

        // Add video replacement logic on click over the video container
        const container = svg.querySelector("#video-cover-container");
        container.style.cursor = "pointer";

        const iframe = document.createElement("iframe");
        const att = {
          width: "100%",
          height: container.querySelector("rect").getAttribute("height"),
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

        iframe.style.margin = "50px 0";
        iframe.style.display = "none";
        video.appendChild(iframe);
        video.appendChild(svg);

        container.addEventListener("click", () => {
          hideElement(svg);
          showElement(iframe);
          video.style.backgroundImage =
            "url(sc-common/img/common/video-cover-bg.png)";
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

function navigate(option) {
  (mainPageURL = "https://unasus-cp.moodle.ufsc.br/course/view.php?id=416"),
    (pages = [
      "sobre.html",
      // "desafio.html",
      "un1.html",
      "un2.html",
      "un3.html",
      "un4.html",
      // "reconhecendo-a-realidade.html",
      // "questoes-avaliativas.html",
      // "tomada-de-opiniao.html",
    ]);

  currentPageURL = window.location.href;
  lastSlashIndex = currentPageURL.lastIndexOf("/");
  currentPage = currentPageURL.substring(lastSlashIndex + 1);
  pos = pages.indexOf(currentPage);
  offset = "next" === option ? 1 : -1;

  if (pos + offset < 0 || pos + offset >= pages.length) {
    window.location.href = mainPageURL;
    return;
  }

  window.location.href = currentPageURL.replace(
    currentPage,
    pages[pos + offset]
  );
}

document.addEventListener("DOMContentLoaded", () => {
  loadFigures();
  loadVideos();
  loadComponents();
  loadCallouts();
  setUpPopovers();
});
