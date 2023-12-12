class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "red";
    this.size = 20;
    this.drawStrategy = new AppleDrawStrategy();
  }
  get boundingBox() {
    return getCircularBoundingBox(
      this.position.x,
      this.position.y,
      this.size
    ).reverse();
  }
}

class DrawStrategy {
  draw() {
    throw new Error("Method 'draw' must be implemented.");
  }
}
class AppleDrawStrategy extends DrawStrategy {
  draw(fruit) {
    fill(fruit.color);
    noStroke();
    beginShape();
    const points = fruit.boundingBox;
    points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);

    const axes = getAxes(points);
    const centers = getCenterOfEachEdge(points);
    axes.forEach((axis, i) => {
      const center = centers[i];
      const arrow = new Arrow("blue", center, center.add(axis.multiply(10)));
      arrow.draw();
    });

    // draw the velocity
    const velocity = fruit.velocity;
    new Arrow(
      "green",
      fruit.position,
      fruit.position.add(velocity.multiply(10))
    ).draw();
  }
}
class FruitFactory {
  static types = [Apple];

  static create(x, y, type) {
    return new type(x, y);
  }

  static random(x, y) {
    const type =
      FruitFactory.types[Math.floor(Math.random() * FruitFactory.types.length)];
    return new type(x, y);
  }
}
