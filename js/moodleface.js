/**
 * Moodleface script file.
 * @module moodleface
 */

import { links } from "../../js/variables.js";

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

    const chapterButtons = main.querySelectorAll("#chapter-buttons > *");
    const quizButtons = main.querySelectorAll("#quiz-buttons > *");
    const sideMenu = main.querySelectorAll("#side-menu > *");

    const buttons = [chapterButtons, quizButtons, sideMenu];
    buttons.forEach((group) => {
      group.forEach((button) => {
        button.style.cursor = "pointer";
        button.addEventListener("click", () => {
          window.open(`${links[button.id]}`);
        });
      });
    });
  });
