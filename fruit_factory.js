class Watermelon extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 37;
    this.color = "green";
    this.polygon = new Polygon(...getCircularBoundingBox(0, 0, this.size));
  }
}

class Orange extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 22;
    this.color = "orange";
    this.polygon = new Polygon(...getCircularBoundingBox(0, 0, this.size));
  }
}

class FruitFactory {
  static types = [Orange, Watermelon];

  static create(x, y, type) {
    return new type(x, y);
  }

  static random(x, y) {
    const type =
      FruitFactory.types[Math.floor(Math.random() * FruitFactory.types.length)];
    return new type(x, y);
  }
}
