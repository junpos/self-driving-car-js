class Sensor {
  constructor(car) {
    this.car = car;
    this.rayCount = 5;
    this.rayLength = 120;
    this.raySpread = Math.PI / 2;

    this.rays = [];
    this.readings = [];
  }

  update(roadBorders, traffic) {
    this.#castRays();

    this.readings = [];
    this.rays.forEach((ray) => {
      this.readings.push(this.#getReading(ray, roadBorders, traffic));
    });
  }

  #getReading(ray, roadBorders, traffic) {
    const touches = [];

    for (const border of roadBorders) {
      // { x, y, offset }
      const touch = getIntersection(ray[0], ray[1], border[0], border[1]);

      if (touch) {
        touches.push(touch);
      }
    }

    for (const otherCar of traffic) {
      for (let i = 0; i < car.polygon.length; i++) {
        const touch = getIntersection(
          ray[0],
          ray[1],
          otherCar.polygon[i],
          otherCar.polygon[(i + 1) % otherCar.polygon.length]
        );
        if (touch) {
          touches.push(touch);
        }
      }
    }

    if (touches.length === 0) {
      return null;
    }

    const touchWithMinOffset = touches.reduce(
      (acc, touch) => (touch.offset < acc.offset ? touch : acc),
      { offset: 1000000 }
    );

    return touchWithMinOffset;
  }

  #castRays() {
    this.rays = [];

    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(this.raySpread / 2, -this.raySpread / 2, i / (this.rayCount - 1)) +
        this.car.angle;

      const start = { x: this.car.x, y: this.car.y };
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      };

      this.rays.push([start, end]);
    }
  }

  draw(ctx) {
    this.rays.forEach(([start, end], i) => {
      if (this.readings[i]) {
        // ray ends at the reading which is the closest intersection with the road borders
        end = this.readings[i];
      }

      // Draw the rays
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "yellow";

      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();

      // Draw the readings
      if (this.readings[i]) {
        ctx.beginPath();
        ctx.lineWidth = 3;
        ctx.strokeStyle = "red";

        ctx.moveTo(end.x, end.y);
        ctx.lineTo(this.rays[i][1].x, this.rays[i][1].y);
        ctx.stroke();
      }
    });
  }
}
