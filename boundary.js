class Boundary {
  constructor(...points) {
    this.points = points;
  }

  draw() {
    fill(220, 200, 200);
    noStroke();
    beginShape();
    this.points.forEach((p) => vertex(p.x, p.y));
    endShape(CLOSE);
  }
}
