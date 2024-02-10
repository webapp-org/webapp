const sum = require("./sum.js");

test("Add two numbers", () => {
  expect(sum(4, 6)).toBe(10);
});
