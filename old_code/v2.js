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
