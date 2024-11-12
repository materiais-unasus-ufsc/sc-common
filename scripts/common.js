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
      figure.classList.add("d-none","d-lg-block");

      let container = document.getElementById(fileName);
      container.insertAdjacentElement("afterbegin", figure);
    });
}

function loadAllFigures() {
  const module = document.querySelector("main").id;
  document.querySelectorAll("figure").forEach((element) => {
    loadFigure(module, element.id);
  });
}

function toggleVisibility(targetSelector) {
  let target = document.querySelector(targetSelector);
  if (target.style.display == "none") {
    target.style.display = "block";
  } else {
    target.style.display = "none";
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadAllFigures();

  /* Custom static component insertion */
  const components = document.querySelectorAll(".component");
  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    loadComponent(component, componentName);
  });

  /* Custom Callout component insertion */
  const callouts = document.querySelectorAll(".callout");
  callouts.forEach((callout) => {
    const calloutType = callout.getAttribute("type");
    loadCallout(callout, calloutType);
  });

  /* Bootstrap Popover component activation */
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
});
