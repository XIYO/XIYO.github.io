# Using Generators Like Regular Variables

In JavaScript, you can create iterable objects using generators.

## Purpose

You can turn infinite functions, like those calculating Fibonacci numbers, into controllable iterables.

## Syntax

```javascript
function* fibonacciGenerator() {
    let [prev, curr] = [0, 1];
    while (true) {
        yield curr;
        [prev, curr] = [curr, prev + curr];
    }
}

const fibonacci = fibonacciGenerator();

console.log(fibonacci.next().value); // 1
console.log(fibonacci.next().value); // 1
console.log(fibonacci.next().value); // 2

// Alternatively, use a for...of loop to print the Fibonacci sequence (note: termination condition is needed)
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break;
}
```

> This is the most common generator syntax.

However, it lacks encapsulation and feels like simply using the generator as is.

## Improvement

```javascript
const fibonacci = {
    prev: 0,
    curr: 1,

    valueOf() {
        const value = this.curr;
        [this.prev, this.curr] = [this.curr, this.prev + this.curr];
        return value;
    },

    *[Symbol.iterator]() {
        while (true) {
            yield this.valueOf();
        }
    }
};

console.log(fibonacci); // 1
console.log(fibonacci); // 1
console.log(fibonacci); // 2

// Using it as an iterable
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break; // Prevent infinite loop
}
```

> The generator has been encapsulated, allowing it to be called like a variable.

The design of calling the Fibonacci variable itself generates side effects, allowing it to be used in the concept of "activation."

