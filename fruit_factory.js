class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "red";
    this.size = 20;
    this.drawStrategy = new AppleDrawStrategy();
  }
  get boundingBox() {
    return getCircularBoundingBox(this.position.x, this.position.y, this.size);
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
    fruit.boundingBox.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);
  }
}
class FruitFactory {
  static types = [Apple];

  static random(x, y) {
    const type =
      FruitFactory.types[Math.floor(Math.random() * FruitFactory.types.length)];
    return new type(x, y);
  }
}
