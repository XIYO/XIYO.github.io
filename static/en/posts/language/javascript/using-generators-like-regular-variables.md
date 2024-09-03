# Using Generators Like Regular Variables

In JavaScript, generators are used to create iterable objects.

## Use Case

Generators can be used to create controllable iterables for functions with infinite sequences, such as Fibonacci calculations.

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

// Or use a for...of loop to print the Fibonacci sequence (with a termination condition)
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break;
}
```
> This is the most common generator syntax.

However, this approach lacks encapsulation, making it feel like you're directly using the generator as-is.

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

// Using as an iterable
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break; // Prevent infinite loop
}
```
> The generator is encapsulated and can now be used similarly to a variable.

The Fibonacci variable itself is designed to produce side effects upon being accessed, allowing it to be used with the concept of "activating" or "running" the sequence.
