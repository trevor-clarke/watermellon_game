class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 27;
    //pastel red
    this.color = "#ff6961";
    this.polygon = new Polygon(...Polygon.generateCircle(0, 0, this.size, 5));
  }
}

class Watermelon extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 37;
    this.color = "green";
    this.polygon = new Polygon(...Polygon.generateCircle(0, 0, this.size, 12));
  }
}

class Orange extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 22;
    this.color = "orange";
    this.polygon = new Polygon(...Polygon.generateCircle(0, 0, this.size, 3));
  }
}

class Banana extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.size = 20;
    // banana yellow
    this.color = "#ffe135";
    this.polygon = new Polygon(
      new Vector(0, 0),
      new Vector(0, this.size * 3),
      new Vector(this.size, this.size * 3),
      new Vector(this.size, 0)
    );
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
