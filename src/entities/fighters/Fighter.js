import { FighterState, FighterDirection } from "../../constants/Fighter.js";

export class Fighter {
  constructor(name, x, y, direction) {
    this.name = name;
    this.image = new Image();
    this.frames = new Map();
    this.position = { x, y };
    this.direction = direction;
    this.velocity = 0;
    this.animationFrame = 0;
    this.animationTimer = 0;
    this.animations = {};
    this.states = {
      [FighterState.WALK_FORWARD]: {
        init: this.handleWalkForwardInit.bind(this),
        update: this.handleWalkForwardState.bind(this),
      },
      [FighterState.WALK_BACKWARD]: {
        init: this.handleWalkBackwardInit.bind(this),
        update: this.handleWalkBackwardState.bind(this),
      },
    };
    this.changeState(FighterState.WALK_BACKWARD);
  }

  changeState(newState) {
    this.currentState = newState;
    this.animationFrame = 0;
    this.states[this.currentState].init();
  }

  handleWalkForwardInit() {
    this.velocity = 150 * this.direction;
  }

  handleWalkForwardState() {}

  handleWalkBackwardInit() {
    this.velocity = -150 * this.direction;
  }

  handleWalkBackwardState() {}

  updateStateConstraints(context) {
    const WIDTH = 32;

    if (this.position.x > context.canvas.width - WIDTH) {
      this.position.x = context.canvas.width - WIDTH;
    }

    if (this.position.x < WIDTH) {
      this.position.x = WIDTH;
    }
  }

  update(time, context) {
    const [[, , width]] = this.frames.get(
      this.animations[this.currentState][this.animationFrame]
    );

    if (time.previous > this.animationTimer + 60) {
      this.animationFrame++;
      this.animationTimer = time.previous;
      if (this.animationFrame > 5) this.animationFrame = 0;
    }
    this.position.x += this.velocity * time.secondsPassed;
    this.states[this.currentState].update(time, context);
    this.updateStateConstraints(context);
  }
  /* drawDebug(context) {
    context.lineWidth = 1;
    context.beginPath();
    context.strokeStyle = "white";
    context.moveTo(this.position.x - 5, this.position.x);
    context.lineTo(this.position.x + 4, this.position.y);
    context.moveTo(this.position.x, this.position.y - 5);
    context.lineTo(this.position.x, this.position.y + 4);
    context.stroke();
  } */

  draw(context) {
    const [[x, y, width, height], [originX, originY]] = this.frames.get(
      this.animations[this.currentState][this.animationFrame]
    );

    context.scale(this.direction, 1);

    context.drawImage(
      this.image,
      x,
      y,
      width,
      height,
      Math.floor(this.position.x * this.direction) - originX,
      Math.floor(this.position.y) - originY,
      width,
      height
    );
    context.setTransform(1, 0, 0, 1, 0, 0);
    //    this.drawDebug(context);
  }
}
