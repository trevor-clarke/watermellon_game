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

  static calculateImpulseAndVelocity(
    v1,
    v2,
    m1,
    m2,
    normal,
    displacementProportion
  ) {
    const relativeVelocity = v1.subtract(v2);
    const velocityAlongNormal = relativeVelocity.dot(normal);
    if (velocityAlongNormal > 0) return { v1, v2 };

    const impulse =
      (2 * velocityAlongNormal * displacementProportion) / (m1 + m2);
    const v1f = v1.subtract(normal.multiply(impulse * m2));
    const v2f = v2.add(normal.multiply(impulse * m1));

    return { v1: v1f, v2: v2f };
  }

  static reflectAndScaleVelocity(v, normal, scale) {
    const reflectedVelocity = v.reflect(normal);
    const scaledVelocity = reflectedVelocity.multiply(scale);
    return scaledVelocity;
  }
}
