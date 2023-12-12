class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "red";
    this.size = 20;
  }

  draw() {
    super.draw();
    noStroke();
    beginShape();
    this.boundingBox.forEach((p) => vertex(p.x, p.y));

    endShape(CLOSE);
  }

  get boundingBox() {
    return getCircularBoundingBox(this.position.x, this.position.y, this.size);
  }
}

Fruit.types = [Apple];
