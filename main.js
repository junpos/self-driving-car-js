const canvas = document.getElementById("canvas");
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50, "PLAYER", 3);
const traffic = [new Car(road.getLaneCenter(1), -100, 30, 50, "DUMMY")];

car.draw(ctx);

animate();

function animate() {
  // refresh canvas
  canvas.height = window.innerHeight;

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, []);
  }

  car.update(road.borders, traffic);
  ctx.save();
  // move the canvas vertically based on the car's y position
  // so that the car is always in the same place
  ctx.translate(0, -car.y + canvas.height * 0.7);

  road.draw(ctx);
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(ctx);
  }
  car.draw(ctx);

  if (car.damaged) {
    // Game over
    return;
  }

  ctx.restore();
  requestAnimationFrame(animate);
}
