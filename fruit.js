class Fruit extends Entity {
  static G = new Vector(0, 3 / 10);
  static damping = 0.99;
  static restitution = 0.5;

  static random(x, y) {
    const type = Fruit.types[Math.floor(Math.random() * Fruit.types.length)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  update(entities) {


    

    this.velocity = this.velocity.add(Fruit.G).multiply(Fruit.damping);

    //calculate air resistance based on surface area
    let airResistance = this.velocity.dup.multiply(-1).multiply(0.01 * this.size * this.size);

    let newPos = this.position.add(this.velocity);
    this.position = newPos;


    if(polygonsCollide(this.boundingBox, entities[0].boundingBox)) {
      // move the fruit out of the collision
      this.position = this.position.add(this.velocity.dup.multiply(-1));
      // update the velocity
      this.velocity = this.velocity.multiply(-1 * Fruit.restitution);
    }


  }

  updateVelocity(delta) {
    this.velocity = this.velocity.add(delta);
  }

  updatePosition() {
    this.position = this.position.add(this.velocity.dup);
  }

  draw() {
    fill(this.color);
    noStroke();
  }

  get mass() {
    return this.size * this.size * this.size;
  }
}

class Apple extends Fruit {
  constructor(x, y) {
    super(x, y);
    this.color = "red";
    this.size = 20;
  }

  draw() {
    super.draw();
    ellipse(this.position.x, this.position.y, this.size * 2); // Use this.size * 2
  }

  get boundingBox() {
    return getCircularBoundingBox(this.position.x, this.position.y, this.size);
  }
}
