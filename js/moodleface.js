/* Configuração do Moodleface. */

const main = document.querySelector("main");
fetch("img/moodleface/moodleface.svg")
  .then((response) => response.text())
  .then((svg) => {
    main.insertAdjacentHTML("afterbegin", svg);
  })
  .then(() => {
    const svg = main.querySelector("svg");
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    for (let i = 1; i <= 4; i++) {
      const un = main.querySelector(`#un${i}`);
      un.style.cursor = "pointer";
      un.addEventListener("click", () => {
        window.open(`./un${i}.html`);
      });
    }

    for (let i = 1; i <= 4; i++) {
      const questions = main.querySelector(`#q${i}`);
      questions.style.cursor = "pointer";
    }

    const about = main.querySelector("#about");
    about.style.cursor = "pointer";
    main.querySelector("#about").addEventListener("click", () => {
      window.open("sobre.html");
    });

    const booklet = main.querySelector("#booklet");
    booklet.style.cursor = "pointer";

    const guide = main.querySelector("#guide");
    guide.style.cursor = "pointer";

    const media = main.querySelector("#media");
    media.style.cursor = "pointer";
  });
