class Car {
  constructor(x, y, width, height, carType, maxSpeed = 1.75) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;

    this.speed = 0;
    this.acceleration = 0.2;
    this.maxSpeed = maxSpeed;
    this.friction = 0.03;
    this.angle = 0;

    this.damaged = false;

    this.carType = carType;
    this.controls = new Controls(carType);
    this.polygon = [];

    if (this.carType === "PLAYER") {
      this.sensor = new Sensor(this);
    }
  }

  update(roadBorders, traffic) {
    if (!this.damaged) {
      this.#move();
      this.polygon = this.#createPolygon();
      this.damaged = this.#assessDamage(roadBorders, traffic);
    }
    this.sensor?.update(roadBorders, traffic);
  }

  #assessDamage(roadBorders, traffic) {
    for (let i = 0; i < roadBorders.length; i++) {
      if (polysIntersect(this.polygon, roadBorders[i])) {
        return true;
      }
    }

    for (let i = 0; i < traffic.length; i++) {
      if (polysIntersect(this.polygon, traffic[i].polygon)) {
        return true;
      }
    }

    return false;
  }

  #createPolygon() {
    const radius = Math.hypot(this.width, this.height) / 2;
    const alpha = Math.atan2(this.width, this.height);

    const topLeft = {
      x: this.x - Math.sin(this.angle + alpha) * radius,
      y: this.y - Math.cos(this.angle + alpha) * radius,
    };

    const topRight = {
      x: this.x - Math.sin(this.angle - alpha) * radius,
      y: this.y - Math.cos(this.angle - alpha) * radius,
    };

    const bottomLeft = {
      x: this.x - Math.sin(this.angle + Math.PI - alpha) * radius,
      y: this.y - Math.cos(this.angle + Math.PI - alpha) * radius,
    };

    const bottomRight = {
      x: this.x - Math.sin(this.angle + Math.PI + alpha) * radius,
      y: this.y - Math.cos(this.angle + Math.PI + alpha) * radius,
    };

    return [topLeft, topRight, bottomRight, bottomLeft];
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration;
    }

    if (this.controls.reverse) {
      this.speed -= this.acceleration;
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed;
    }

    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2;
    }

    if (this.speed > 0) {
      this.speed -= this.friction;
    }

    if (this.speed < 0) {
      this.speed += this.friction;
    }

    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0;
    }

    if (this.speed !== 0) {
      const flip = this.speed > 0 ? 1 : -1;

      if (this.controls.left) {
        this.angle += 0.03 * flip;
      }

      if (this.controls.right) {
        this.angle -= 0.03 * flip;
      }
    }

    this.x -= Math.sin(this.angle) * this.speed;
    this.y -= Math.cos(this.angle) * this.speed;
  }

  draw(ctx) {
    if (this.damaged) {
      ctx.fillStyle = "gray";
    } else {
      ctx.fillStyle = this.carType === "PLAYER" ? "blue" : "black";
    }

    // Draw car with polygon points
    ctx.beginPath();
    this.polygon.forEach((point, i) => {
      if (i == 0) {
        ctx.moveTo(point.x, point.y);
      } else {
        ctx.lineTo(point.x, point.y);
      }
    });
    ctx.fill();

    // Draw sensor
    this.sensor?.draw(ctx);
  }
}
