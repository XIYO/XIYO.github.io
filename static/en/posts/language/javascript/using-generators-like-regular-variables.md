# 제터레이터를 일반 변수처럼 사용하기

자바스크립트에서 제너레이터를 이용하여 반복 가능한 객체를 만듭니다.

## 용도

피보나치같은 연산의 끝이 없는 함수를 제어가능한 이터러블로 만들 수 있습니다.

## 문법

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

// 또는 for...of 문을 사용하여 피보나치 수열 출력 (단, 종료 조건 필요)
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break;
}
```
> 가장 보편적인 제너레이터 문법 입니다.

그러나 캡슐화가 되어 있지 않아 단순히 제너레이터를 그대로 사용하는 느낌입니다.

## 개선

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

// 이터러블로 사용
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break; // 무한 루프 방지
}
```

> 제너레이터를 캡슐화 하여 변수를 호출하는 방식처럼 바꾸었습니다.

피보나치 변수를 호출하는 것 자체가 사이드 이펙트를 발생시키게 디자인 되어 "작동 시킨다"라는 개념으로 사용할 수 있게 바뀌었습니다.

