class Entity {
  constructor(x, y) {
    this.position = new Vector(x, y);
    this.velocity = new Vector(0, 0);
  }

  get x() {
    return this.position.x;
  }

  get y() {
    return this.position.y;
  }

  updatePosition(G) {}

  draw() {
    throw new Error("draw method not implemented");
  }

  get mass() {
    throw new Error("mass property not implemented");
  }

  update() {
    throw new Error("update method not implemented");
  }
}
