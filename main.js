const canvas = document.getElementById("canvas");
canvas.height = window.innerHeight;
canvas.width = 200;

const ctx = canvas.getContext("2d");
const road = new Road(canvas.width / 2, canvas.width * 0.9);
const car = new Car(road.getLaneCenter(1), 100, 30, 50);
car.draw(ctx);

animate();

function animate() {
  // refresh canvas
  canvas.height = window.innerHeight;

  car.update();
  road.draw(ctx);
  car.draw(ctx);
  requestAnimationFrame(animate);
}
