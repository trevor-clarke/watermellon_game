class Arrow {
  constructor(color, location, vector) {
    this.color = color;
    this.location = location;
    this.vector = vector;
  }

  draw() {
    push();
    strokeWeight(1);
    stroke(this.color);
    fill(this.color);
    line(this.location.x, this.location.y, this.vector.x, this.vector.y);
    translate(this.vector.x, this.vector.y);
    circle(0, 0, 5);
    pop();
  }
}
