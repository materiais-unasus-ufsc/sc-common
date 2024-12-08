/**
 * Helper functions for common tasks.
 * @module helper
 */

/**
 * Fetches an SVG file and appends its contents into a `figure` element with `id
 * == fileName`.
 * @param {string} module - Subfolder of the img folder containing the svg file.
 * @param {fileName} fileName - Name of the SVG file / id of the figure element * container.
 * @returns A Promise for the completion of the figure insertion.
 */
export function loadFigure(module, fileName) {
  if (fileName == "") {
    console.error("Tried to load a figure with no name!");
    return;
  }

  return fetch(`img/${module}/${fileName}.svg`)
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

      let container = document.querySelector(`figure[id="${fileName}"]`);
      container.insertAdjacentElement("afterbegin", figure);
    });
}

/**
 * Hides an HTML element by setting its display style to "none".
 * The original display style is stored in a data attribute to allow toggling.
 * @param {HTMLElement} element - The element to hide.
 */
export function hideElement(element) {
  if (!element.hasAttribute("data-original-display")) {
    element.setAttribute("data-original-display", element.style.display);
  }
  element.style.display = "none";
}

/**
 * Shows an HTML element by restoring its original display style.
 * The original display style is retrieved from a data attribute.
 * @param {HTMLElement} element - The element to show.
 */
export function showElement(element) {
  element.style.display = element.getAttribute("data-original-display");
}

/**
 * Toggles the visibility of an HTML element selected by a CSS selector.
 * If the element is currently hidden, it will be shown, and vice versa.
 * @param {string} targetSelector - The CSS selector for the target element.
 */
export function toggleVisibility(targetSelector) {
  let target = document.querySelector(targetSelector);
  if (target.style.display == "none") {
    showElement(target);
  } else {
    hideElement(target);
  }
}
