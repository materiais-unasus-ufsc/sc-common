function loadComponent(target, componentName) {
  fetch(`/src/sc-common/components/${componentName}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const components = document.querySelectorAll(".component");

  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    loadComponent(component, componentName);
  });
});
