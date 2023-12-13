class Vector {
  constructor(...components) {
    this.components = components.length > 0 ? components : [];
    ["x", "y", "z"].forEach((name, index) => {
      Object.defineProperty(this, name, {
        get: function () {
          return this.components[index];
        },
        set: function (value) {
          this.components[index] = value;
        },
      });
    });
  }

  get dup() {
    return new Vector(...this.components);
  }

  operate(operation, inPlace, ...operands) {
    const operations = {
      add: (a, b) => a + b,
      subtract: (a, b) => a - b,
      multiply: (a, b) => a * b,
      divide: (a, b) => a / b,
    };

    if (!operations.hasOwnProperty(operation)) {
      throw new Error("Invalid vector operation");
    }

    let operandComponents;
    if (operands.length == 1 && operands[0] instanceof Vector) {
      if (operands[0].components.length !== this.components.length) {
        throw new Error("Vectors must be of the same dimension");
      }
      operandComponents = operands[0].components;
    } else if (operands.length === this.components.length) {
      operandComponents = operands;
    } else if (operands.length == 1 && typeof operands[0] === "number") {
      operandComponents = new Array(this.components.length).fill(operands[0]);
    } else {
      throw new Error("Invalid operand type or dimension");
    }

    const result = new Vector(
      ...this.components.map((component, index) =>
        operations[operation](component, operandComponents[index])
      )
    );

    if (inPlace) {
      this.components = result.components;
      return this;
    } else {
      return result;
    }
  }

  add(...operands) {
    return this.operate("add", false, ...operands);
  }

  add_(...operands) {
    return this.operate("add", true, ...operands);
  }

  subtract(...operands) {
    return this.operate("subtract", false, ...operands);
  }

  subtract_(...operands) {
    return this.operate("subtract", true, ...operands);
  }

  multiply(...operands) {
    return this.operate("multiply", false, ...operands);
  }

  multiply_(...operands) {
    return this.operate("multiply", true, ...operands);
  }

  divide(...operands) {
    return this.operate("divide", false, ...operands);
  }

  divide_(...operands) {
    return this.operate("divide", true, ...operands);
  }

  max(max) {
    if (this.magnitude() > max) {
      return this.normalize().multiply(max);
    }
    return this;
  }

  max_(max) {
    let result = this.max(max);
    this.components = result.components;
    return this;
  }

  min(min) {
    if (this.magnitude() < min) {
      return new Vector(0, 0);
    }
    return this;
  }

  min_(min) {
    let result = this.min(min);
    this.components = result.components;
    return this;
  }

  negate() {
    return this.multiply(-1);
  }

  negate_() {
    return this.multiply_(-1);
  }

  reflect(normal) {
    return this.subtract(normal.multiply(2 * this.dot(normal)));
  }

  equals(other) {
    if (other.components.length !== this.components.length) {
      return false;
    }

    for (let i = 0; i < this.components.length; i++) {
      if (this.components[i] !== other.components[i]) {
        return false;
      }
    }

    return true;
  }

  normalize() {
    const mag = this.magnitude();

    if (!mag || isNaN(mag) || !isFinite(mag)) {
      return new Vector(0, 0);
    }

    let normal = this.divide(mag);

    if (
      isNaN(normal.x) ||
      isNaN(normal.y) ||
      !isFinite(normal.x) ||
      !isFinite(normal.y)
    ) {
      return new Vector(0, 0);
    }

    return normal;
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
