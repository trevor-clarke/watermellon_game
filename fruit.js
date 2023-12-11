class Fruit extends Entity {
  static G = new Vector(0, 3 / 10);
  static damping = 0.99;
  static restitution = 0.5;

  static random(x, y) {
    console.error(Fruit.types);
    const type = Fruit.types[Math.floor(Math.random() * 3)];
    return new type(x, y);
  }

  constructor(x, y) {
    super(x, y);
  }

  update(entities) {
    this.velocity = this.velocity.add(Fruit.G).multiply(Fruit.damping);
    this.position = this.position.add(this.velocity);

    for (let i = 0; i < entities.length; i++) {
      if (entities[i] === this) continue;
      if (polygonsCollide(this.boundingBox, entities[i].boundingBox)) {
        this.position = this.position.add(this.velocity.dup.multiply(-1));
        this.velocity = this.velocity.multiply(-1 * Fruit.restitution);
      }
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
    //
  }

  get mass() {
    return this.size * this.size * this.size;
  }
}
