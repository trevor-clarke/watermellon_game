class Physics {
  static gravity = new Vector(0, 9.81 / 31);
  static perfectlyElasticCollision(v1, m1, v2, m2) {
    const v1f = v1
      .multiply(m1 - m2)
      .add(v2.multiply(2 * m2))
      .divide(m1 + m2);

    const v2f = v2
      .multiply(m2 - m1)
      .add(v1.multiply(2 * m1))
      .divide(m1 + m2);

    return { v1: v1f, v2: v2f };
  }
}
