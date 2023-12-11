class Boundary {
  // a boundary is a line, that defines the physical boundaries of the game
  // a boundary has a `depth` deep box below it to visually represent the ground

  constructor(...points) {
    this.points = points;
  }

  draw() {
    //draw the box
    fill(255);
    noStroke();
    beginShape();
    this.points.forEach((p) => vertex(p.x, p.y));

    endShape(CLOSE);
  }
}
