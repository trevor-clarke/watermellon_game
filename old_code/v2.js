// checkCollision(other) {
//   let dx = this.position.x - other.position.x;
//   let dy = this.position.y - other.position.y;
//   let distance = Math.sqrt(dx * dx + dy * dy);
//   return distance < this.size + other.size;
// }

// resolveCollision(other) {
//   let overlap =
//     this.size + other.size - Vector.distance(this.position, other.position);
//   let direction = Vector.subtract(this.position, other.position).normalize();

//   let moveBy = direction.multiply(overlap / 2);
//   this.position = this.position.add(moveBy);
//   other.position = other.position.subtract(moveBy);

//   // Momentum exchange formula can be added here if needed
// }

// let vel = this.velocity.dup;
// entities.forEach((entity) => {
//   if (entity === this) return;
//   // calculate the effect of the two entities on each other
// });
// this.velocity = vel;
// this.position = this.position.add(this.velocity);
// // if (this.position.y > this.floorY) {
// //   this.position.y = this.floorY;
// // }

entities
  .filter((e) => e instanceof Fruit)
  .forEach((fruit) => {
    if (fruit === this) return;
    if (!polygonsCollide(nextboundingBox, fruit.boundingBox)) return;

    let overlap = calculateOverlap(nextboundingBox, fruit.boundingBox);
    this.position = this.position.subtract(overlap);

    const collisionNormal = overlap.normalize();

    const relativeVelocity = delta.subtract(fruit.velocity);
    const velocityAlongNormal = relativeVelocity.dot(collisionNormal);
    if (velocityAlongNormal > 0) return;

    const impulseScalar =
      (-(1 + Fruit.restitution) * velocityAlongNormal) /
      (1 / this.mass + 1 / fruit.mass);

    const impulse = collisionNormal.multiply(impulseScalar);

    delta = delta.add(impulse.divide(this.mass)).max(this.terminalVelocity / 2);

    fruit.velocity = fruit.velocity
      .add(impulse.divide(fruit.mass))
      .max(fruit.terminalVelocity / 2);
  });

const nextboundingBox = this.boundingBox.map((point) => {
  let a = new Vector(point.x, point.y).add(delta);
  return { x: a.x, y: a.y };
});
// document.getElementById("output").innerHTML = JSON.stringify(
//   entities.map((e) => e.velocity.magnitude().toFixed(2)),
//   null,
//   2
// );

fruit.forEach((otherFruit) => {
  if (otherFruit === this) return;
  const overlap = calculateOverlap(this.boundingBox, otherFruit.boundingBox);
  if (overlap.magnitude() > 0.1) {
    this.position = this.position.add(overlap);
    const { v1Final, v2Final } = calculateFinalVelocities(
      this.mass,
      otherFruit.mass,
      this.velocity,
      otherFruit.velocity,
      0.2
    );
    this.velocity = v1Final;
    otherFruit.velocity = v2Final;
  }
});
// boundaries.push(
//   new Boundary(
//     new Vector(0, height / 2),
//     new Vector(0, height / 1.5),
//     new Vector(width / 2, height / 1.5)
//   )
// );
// boundaries.push(
//   new Boundary(
//     new Vector(width / 2, height / 1.5),
//     new Vector(width, height / 1.5),
//     new Vector(width, height / 2)
//   )
// );
// boundaries.push(
//   new Boundary(
//     new Vector(10, 10),
//     new Vector(width, height / 1.5),
//     new Vector(width, height / 2)
//   )
// );
// // make a straight ground near the bottom
// boundaries.push(
//   new Boundary(
//     new Vector(0, height),
//     new Vector(width, height),
//     new Vector(width, height - 10)
//   )
// );

//create a little box with no top
