# ジェネレーターを通常の変数のように使用する

JavaScriptでは、ジェネレーターを使用して反復可能なオブジェクトを作成します。

## 用途

フィボナッチのような無限の計算を制御可能なイテラブルにすることができます。

## 文法

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

// または for...of 文を使用してフィボナッチ数列を出力（終了条件が必要）
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break;
}
```

> 最も一般的なジェネレーターの文法です。

しかし、カプセル化されていないため、単にジェネレーターをそのまま使用している感じです。

## 改善

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

// イテラブルとして使用
for (const value of fibonacci) {
    console.log(value); // 3, 5, 8, ...
    if (value >= 13) break; // 無限ループ防止
}
```

> ジェネレーターをカプセル化し、変数を呼び出す方法に変更しました。

フィボナッチ変数を呼び出すこと自体が副作用を引き起こすように設計されており、「動作させる」という概念で使用できるようになりました。

