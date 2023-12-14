function startTest() {
  // Reset the test start time
  testStartTime = millis();
  for (let i = 0; i < 10; i++) {
    objects.push(
      FruitFactory.create(random(0, width), random(0, height), Orange)
    );
  }
  // Start the interval to add fruits every 10 seconds
  testInterval = setInterval(() => {
    // Log the average frame rate and render time for the last 10 seconds
    console.log(`Average frame rate: ${average(frameRates).toFixed(2)}`);
    console.log(`Average render time: ${average(renderTimes).toFixed(4)}`);
    console.log(`Number of fruits: ${objects.length}`);

    // If the frame rate is 30 or below, stop the test
    if (average(frameRates) <= 30) {
      stopTest();
      return;
    }

    // Add 10 fruits
    for (let i = 0; i < 10; i++) {
      objects.push(
        FruitFactory.create(random(0, width), random(0, height), Orange)
      );
    }

    // Reset the frame rates and render times arrays for the next 10 seconds
    frameRates = [];
    renderTimes = [];
  }, 10000); // 10 seconds
}

function stopTest() {
  // Stop the interval
  clearInterval(testInterval);

  // Calculate the test duration
  let testDuration = millis() - testStartTime;

  // Log the test results
  console.log(`Test duration: ${testDuration} ms`);
  console.log(`Final number of fruits: ${objects.length}`);
  console.log(`Final frame rate: ${average(frameRates).toFixed(2)}`);
  console.log(`Final render time: ${average(renderTimes).toFixed(4)}`);
}

function average(arr) {
  if (arr.length === 0) return 0;
  let sum = arr.reduce((a, b) => a + b, 0);
  return sum / arr.length;
}
