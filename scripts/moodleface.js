/* Configuração do Moodleface. */

const main = document.querySelector("main");
fetch("sc-common/img/moodleface/moodleface.svg")
  .then((response) => response.text())
  .then((svg) => {
    main.insertAdjacentHTML("afterbegin", svg);
  })
  .then(() => {
    for (let i = 1; i <= 3; i++) {
      const un = main.querySelector(`#un${i}`);
      un.style.cursor = "pointer";
      un.addEventListener("click", () => {
        window.open(`/src/un${i}.html`);
      });
    }

    for (let i = 1; i <= 3; i++) {
      const questions = main.querySelector(`#questions-${i}`);
      questions.style.cursor = "pointer";
    }

    const about = main.querySelector("#about");
    about.style.cursor = "pointer";
    main.querySelector("#about").addEventListener("click", () => {
      window.open("/src/sobre.html");
    });

    const booklet = main.querySelector("#booklet");
    booklet.style.cursor = "pointer";

    const guide = main.querySelector("#guide");
    guide.style.cursor = "pointer";

    const media = main.querySelector("#media");
    media.style.cursor = "pointer";
  });
