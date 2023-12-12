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

    // draw arrows for axes pointing out of each edge
    const axes = getAxes(this.points);
    const centers = getCenterOfEachEdge(this.points);
    axes.forEach((axis, i) => {
      const center = centers[i];
      const arrow = new Arrow("red", center, center.add(axis.multiply(20)));
      arrow.draw();
    });
  }
}
