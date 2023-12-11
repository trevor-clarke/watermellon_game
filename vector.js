class Vector {
  constructor(...components) {
    this.components = components.length > 0 ? components : [];
  }

  get dup() {
    return new Vector(...this.components);
  }

  get x() {
    return this.components[0];
  }

  set x(value) {
    this.components[0] = value;
  }

  get y() {
    return this.components[1];
  }

  set y(value) {
    this.components[1] = value;
  }

  get z() {
    return this.components[2];
  }

  set z(value) {
    this.components[2] = value;
  }

  add(...operands) {
    return this.operate("add", ...operands);
  }

  subtract(...operands) {
    return this.operate("subtract", ...operands);
  }

  multiply(...operands) {
    return this.operate("multiply", ...operands);
  }

  divide(...operands) {
    return this.operate("divide", ...operands);
  }

  operate(operation, ...operand) {
    const validOperations = ["add", "subtract", "multiply", "divide"];

    if (!validOperations.includes(operation)) {
      throw new Error("Invalid vector operation");
    }
    // debugger;
    let operandComponents;

    if (operand.length == 1 && operand[0] instanceof Vector) {
      if (operand[0].components.length !== this.components.length) {
        throw new Error("Vectors must be of the same dimension");
      }
      operandComponents = operand[0].components;
    } else if (operand.length === this.components.length) {
      operandComponents = operand;
    } else if (operand.length == 1 && typeof operand[0] === "number") {
      operandComponents = new Array(this.components.length).fill(operand[0]);
    } else {
      throw new Error("Invalid operand type or dimension");
    }

    return new Vector(
      ...this.components.map((component, index) => {
        if (operation === "add") return component + operandComponents[index];
        if (operation === "subtract")
          return component - operandComponents[index];
        if (operation === "multiply")
          return component * operandComponents[index];
        if (operation === "divide") return component / operandComponents[index];
        throw new Error("Invalid vector operation");
      })
    );
  }

  normalize() {
    let magnitude = this.magnitude();
    if (magnitude === 0) {
      magnitude = 0.25;
      // throw new Error("Cannot normalize a vector with magnitude 0");
    }
    return this.divide(magnitude);
  }

  magnitude() {
    return Math.sqrt(
      this.components.reduce((sum, component) => sum + component * component, 0)
    );
  }

  distance(other) {
    return Vector.distance(this, other);
  }

  dot(other) {
    return Vector.dot(this, other);
  }

  static dot(v1, v2) {
    if (v1.components.length !== v2.components.length) {
      throw new Error(
        "Vectors must be of the same dimension for dot product calculation"
      );
    }

    let sum = 0;
    for (let i = 0; i < v1.components.length; i++) {
      sum += v1.components[i] * v2.components[i];
    }
    return sum;
  }

  static distance(v1, v2) {
    if (v1.components.length !== v2.components.length) {
      throw new Error(
        "Vectors must be of the same dimension for distance calculation"
      );
    }

    let sum = 0;
    for (let i = 0; i < v1.components.length; i++) {
      let diff = v1.components[i] - v2.components[i];
      sum += diff * diff;
    }
    return Math.sqrt(sum);
  }

  static direction(v1, v2) {
    if (v1.components.length !== v2.components.length) {
      throw new Error(
        "Vectors must be of the same dimension for direction calculation"
      );
    }

    let direction = v2.subtract(v1);
    return direction.normalize();
  }

  static subtract(v1, v2) {
    return v1.subtract(v2);
  }
}
