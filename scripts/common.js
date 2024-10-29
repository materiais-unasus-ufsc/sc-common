function loadComponent(target, componentName) {
  fetch(`/src/sc-common/components/${componentName}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    });
}

function loadCallout(target, calloutType) {
  fetch(`/src/sc-common/components/callout-${calloutType}.html`)
    .then((response) => response.text())
    .then((html) => {
      target.innerHTML = html;
    })
    .then(() => {
      target.querySelector("p").innerHTML = target.getAttribute("text");
    });
}

document.addEventListener("DOMContentLoaded", () => {
  const components = document.querySelectorAll(".component");
  components.forEach((component) => {
    const componentName = component.getAttribute("name");
    loadComponent(component, componentName);
  });

  const callouts = document.querySelectorAll(".callout");
  callouts.forEach((callout) => {
    const calloutType = callout.getAttribute("type");
    loadCallout(callout, calloutType);
  });

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
      if (!document.querySelector(".popover:hover")) {
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
