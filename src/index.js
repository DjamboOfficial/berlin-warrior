import { Ryu } from "./entities/fighters/Ryu.js";
import { Ken } from "./entities/fighters/Ken.js";
import { Stage } from "./entities/Stage.js";
import { FpsCounter } from "./entities/FpsCounter.js";
import { STAGE_FLOOR } from "./constants/stage.js";
import { FighterDirection, FighterState } from "./constants/Fighter.js";

function populateMoveDropdown() {
  const dropdown = document.getElementById("state-dropdown");

  Object.entries(FighterState).forEach(([, value]) => {
    const option = document.createElement("option");
    option.setAttribute("value", value);
    option.innerText = value;
    dropdown.appendChild(option);
  });
}

window.addEventListener("load", function () {
  populateMoveDropdown();

  const canvasEl = document.querySelector("canvas");
  const context = canvasEl.getContext("2d");
  context.imageSmoothingEnabled = false;

  const entities = [
    new Stage(),
    new Ryu(104, STAGE_FLOOR, FighterDirection.RIGHT),
    new Ken(280, STAGE_FLOOR, FighterDirection.LEFT),
    new FpsCounter(),
  ];

  let frameTime = {
    previous: 0,
    secondsPassed: 0,
  };

  function frame(time) {
    window.requestAnimationFrame(frame);

    frameTime = {
      secondsPassed: (time - frameTime.previous) / 1000,
      previous: time,
    };
    for (const entity of entities) {
      entity.update(frameTime, context);
    }

    for (const entity of entities) {
      entity.draw(context);
    }
  }
  window.requestAnimationFrame(frame);
});
