class SimpleTest {
  static test(name, callback) {
    console.log(`Test: ${name}`);
    try {
      callback();
      console.log("✅ Test passed");
    } catch (error) {
      console.error(`❌ Test failed: ${error.message}`);
    }
  }

  static expect(actual) {
    return {
      toBe: function (expected) {
        if (actual !== expected) {
          throw new Error(`${actual} is not equal to ${expected}`);
        }
      },
    };
  }
}
