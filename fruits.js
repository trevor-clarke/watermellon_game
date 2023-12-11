
class Orange extends Fruit {
    constructor(x, y) {
      super(x, y);
      this.color = "orange";
      this.size = 30;
    }
  
    draw() {
      super.draw();
      ellipse(this.position.x, this.position.y, this.size * 2); // Use this.size * 2
    }
  
    get boundingBox() {
      return getCircularBoundingBox(this.position.x, this.position.y, this.size);
    }
  }
  
  class Blueberry extends Fruit {
    constructor(x, y) {
      super(x, y);
      this.color = "blue";
      this.size = 40;
      this.shape = "square";
    }
  
    draw() {
      super.draw();
      rectMode(CENTER);
      rect(this.position.x, this.position.y, this.size, this.size);
    }
  
    get boundingBox() {
      return getRectangularBoundingBox(
        this.position.x,
        this.position.y,
        this.size,
        this.size
      );
    }
  }
  
  
  
  Fruit.types = [Blueberry, Apple, Orange];
  