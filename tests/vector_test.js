// // // Tests for Vector class
// // SimpleTest.test("Vector creation with no components", () => {
// //   const v = new Vector();
// //   SimpleTest.expect(v.components).toBe([]);
// // });

// SimpleTest.test("Vector creation with one component", () => {
//   const v = new Vector(1);
//   SimpleTest.expect(v.x).toBe(1);
// });

// SimpleTest.test("Vector creation with multiple components", () => {
//   const v = new Vector(1, 2, 3);
//   SimpleTest.expect(v.x).toBe(1);
//   SimpleTest.expect(v.y).toBe(2);
//   SimpleTest.expect(v.z).toBe(3);
// });

// SimpleTest.test("Duplicate a vector", () => {
//   const v = new Vector(1, 2, 3);
//   const d = v.dup;
//   SimpleTest.expect(d.x).toBe(1);
//   SimpleTest.expect(d.y).toBe(2);
//   SimpleTest.expect(d.z).toBe(3);
// });

// SimpleTest.test("Add two vectors", () => {
//   const v1 = new Vector(1, 2, 3);
//   const v2 = new Vector(3, 2, 1);
//   const result = v1.add(v2);
//   SimpleTest.expect(result.x).toBe(4);
//   SimpleTest.expect(result.y).toBe(4);
//   SimpleTest.expect(result.z).toBe(4);
// });

// SimpleTest.test("Subtract two vectors", () => {
//   const v1 = new Vector(1, 2, 3);
//   const v2 = new Vector(3, 2, 1);
//   const result = v1.subtract(v2);
//   SimpleTest.expect(result.x).toBe(-2);
//   SimpleTest.expect(result.y).toBe(0);
//   SimpleTest.expect(result.z).toBe(2);
// });

// SimpleTest.test("Multiply two vectors", () => {
//   const v1 = new Vector(1, 2, 3);
//   const v2 = new Vector(3, 2, 1);
//   const result = v1.multiply(v2);
//   SimpleTest.expect(result.x).toBe(3);
//   SimpleTest.expect(result.y).toBe(4);
//   SimpleTest.expect(result.z).toBe(3);
// });

// SimpleTest.test("Add scalar to vector", () => {
//   const v = new Vector(1, 2, 3);
//   const result = v.add(2);
//   SimpleTest.expect(result.x).toBe(3);
//   SimpleTest.expect(result.y).toBe(4);
//   SimpleTest.expect(result.z).toBe(5);
// });

// SimpleTest.test("Subtract scalar from vector", () => {
//   const v = new Vector(1, 2, 3);
//   const result = v.subtract(1);
//   SimpleTest.expect(result.x).toBe(0);
//   SimpleTest.expect(result.y).toBe(1);
//   SimpleTest.expect(result.z).toBe(2);
// });

// SimpleTest.test("Multiply vector by scalar", () => {
//   const v = new Vector(1, 2, 3);
//   const result = v.multiply(2);
//   SimpleTest.expect(result.x).toBe(2);
//   SimpleTest.expect(result.y).toBe(4);
//   SimpleTest.expect(result.z).toBe(6);
// });

// // Test for invalid operations
// SimpleTest.test("Invalid operation", () => {
//   const v = new Vector(1, 2, 3);
//   try {
//     v.operate("divide", 2);
//     console.error("This should not pass");
//   } catch (error) {
//     SimpleTest.expect(error.message).toBe("Invalid vector operation");
//   }
// });

// // Test for mismatched vector dimensions
// SimpleTest.test("Mismatched vector dimensions", () => {
//   const v1 = new Vector(1, 2, 3);
//   const v2 = new Vector(1, 2);
//   try {
//     v1.add(v2);
//     console.error("This should not pass");
//   } catch (error) {
//     SimpleTest.expect(error.message).toBe(
//       "Vectors must be of the same dimension"
//     );
//   }
// });

// // Test for invalid operand type
// SimpleTest.test("Invalid operand type", () => {
//   const v = new Vector(1, 2, 3);
//   try {
//     v.add("invalid");
//     console.error("This should not pass");
//   } catch (error) {
//     SimpleTest.expect(error.message).toBe("Invalid operand type or dimension");
//   }
// });

// SimpleTest.test("Operation with mismatched scalar array length", () => {
//   const v = new Vector(1, 2, 3);
//   try {
//     v.add([1, 2]); // This should throw an error
//     console.error("This should not pass");
//   } catch (error) {
//     SimpleTest.expect(error.message).toBe("Invalid operand type or dimension");
//   }
// });

// SimpleTest.test("Add two vectors", () => {
//   const v1 = new Vector(0, 0);
//   const result = v1.add(0, 1);
//   SimpleTest.expect(result.x).toBe(0);
//   SimpleTest.expect(result.y).toBe(1);
// });

SimpleTest.test("Subtract two vectors", () => {
  v1 = new Vector(0, 1).multiply(1).multiply(-1);
  SimpleTest.expect(v1.x).toBe(0);
  SimpleTest.expect(v1.y).toBe(-1);
});
