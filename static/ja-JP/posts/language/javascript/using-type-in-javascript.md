# JavaScriptでの型の使用

JavaScriptでプロジェクトを進めていると、ライブラリを使用する際にどの値を引数として渡すべきか、返される値がどのような形になるのかが明確でない場合がよくあります。このような状況では、ドキュメントを一つ一つ探さなければ正確な使用方法を知ることが難しく、開発が複雑になることがあります。

このような問題を解決するために、**JSDoc**が誕生しました。JSDocはJavaScriptコードにコメントを付けて、関数、変数、オブジェクトなどの型と役割を明確に説明できるようにするツールです。これによりコードの可読性が向上し、協力する際に他の開発者がコードを簡単に理解できるようにサポートします。JSDocは特にコードの自動補完や型検査などの機能を提供し、JavaScriptでも型の安全性を確保できるようにします。

しかし、JavaScriptの型管理に対する要求がますます高まる中で、**TypeScript**が登場しました。TypeScriptはJavaScriptの上位集合であり、静的型検査をサポートして、コード作成時に型エラーを発見できるようにします。これにより、より強力な型の安全性を提供し、コードの保守性を大幅に向上させました。

それにもかかわらず、多くの開発者は依然として純粋なJavaScriptを使用したいと考えることが多いです。その理由は、TypeScriptで書かれたコードは最終的にJavaScriptにコンパイルされて実行されるからです。したがって、コード作成過程で型の安全性を確保したい場合、JSDocを活用してJavaScriptで直接型を管理することも良い方法となるでしょう。JSDocを使用すれば、既存のJavaScriptコードベースを大きく変更することなく型の安全性を高めることができるため、より簡便にJavaScriptを活用できます。

## JSDocの使用

### 使用する前に

実際、JSDocは文書化のためのツールです。型検査のためのツールではありません。型検査は、現代のIDEがJSDocを利用して型を推論し、検査する方式で行われます。

そのため、JavaScriptで型を明示し使用するためには、JSDoc文法をサポートするIDEを使用する必要があります。

基本的にサポートされているIDEは以下の通りです。

- Visual Studio Code
- WebStorm
- IntelliJ IDEA

### 明示可能な型

JSDocを使用すると、さまざまな型を明示できます。このセクションでは、JSDocで明示できる主要な型を紹介します。

#### 基本原始型 (Primitive Types)

基本原始型はJavaScriptの最も基本的なデータ型を表し、JSDocでは以下のような型を明示できます：

- **`number`**: 数字型。整数と浮動小数点数の両方を含みます。

  ```javascript
  /**
   * @type {number}
   */
  let count = 42;
  ```

- **`string`**: 文字列型。テキストデータを表現します。

  ```javascript
  /**
   * @type {string}
   */
  let name = 'アリス';
  ```

- **`boolean`**: ブール型。真(`true`)または偽(`false`)の値を持ちます。

  ```javascript
  /**
   * @type {boolean}
   */
  let isActive = true;
  ```

- **`null`**: `null`値。明示的に「値がない」ことを示します。

  ```javascript
  /**
   * @type {null}
   */
  let emptyValue = null;
  ```

- **`undefined`**: `undefined`値。変数は宣言されたが値が割り当てられていない状態を示します。

  ```javascript
  /**
   * @type {undefined}
   */
  let notDefined;
  ```

- **`symbol`**: ユニークで変更不可能な原始値を生成するために使用されるシンボル型。

  ```javascript
  /**
   * @type {symbol}
   */
  let uniqueKey = Symbol('key');
  ```

- **`bigint`**: 非常に大きな整数を表現できる型。通常、2^53以上の整数を扱うときに使用します。
  ```javascript
  /**
   * @type {bigint}
   */
  let largeNumber = 9007199254740991n;
  ```

#### 複合型 (Complex Types)

基本原始型の他にも、JSDocは複数の型を組み合わせた複合型を明示できます：

- **オブジェクト型 (`Object`)**: オブジェクトの構造を明示します。

  ```javascript
  /**
   * @typedef {Object} User
   * @property {number} id - ユーザーのID
   * @property {string} name - ユーザーの名前
   * @property {boolean} isActive - ユーザーのアクティブ状態
   */

  /**
   * @type {User}
   */
  const user = {
  	id: 1,
  	name: 'アリス',
  	isActive: true
  };
  ```

- **配列型 (`Array`)**: 配列の各要素がどの型であるかを明示します。

  ```javascript
  /**
   * @type {number[]}
   */
  let scores = [95, 85, 76];

  /**
   * @type {Array<string>}
   */
  let fruits = ['りんご', 'バナナ', 'さくらんぼ'];
  ```

- **ユニオン型 (`Union Types`)**: 変数や引数が複数の型のいずれかであることを示します。

  ```javascript
  /**
   * @type {string | number}
   */
  let id;
  ```

- **インターセクション型 (`Intersection Types`)**: 複数の型を組み合わせて一つの型を作ります。

  ```javascript
  /**
   * @typedef {Object} Person
   * @property {string} name
   * @property {number} age
   */

  /**
   * @typedef {Object} Employee
   * @property {number} employeeId
   */

  /**
   * @type {Person & Employee}
   */
  const employee = {
  	name: 'アリス',
  	age: 30,
  	employeeId: 12345
  };
  ```

#### 関数型 (Function Types)

関数の引数と返り値の型を明示できます：

- **関数の型明示**: 関数の引数と返り値の型を明示します。

  ```javascript
  /**
   * @param {number} x - 最初の数
   * @param {number} y - 二番目の数
   * @returns {number} xとyの合計
   */
  function add(x, y) {
  	return x + y;
  }
  ```

- **関数の型定義**: アロー関数などにも型を明示できます。
  ```javascript
  /**
   * @type {(a: string, b: string) => string}
   */
  const concatenate = (a, b) => `${a}${b}`;
  ```

#### ジェネリック型 (Generic Types)

ジェネリック型を使用すると、複数の型に対して同じロジックを適用できます：

- **ジェネリック関数**: 型パラメータを使用してさまざまな型を処理する関数を定義します。
  ```javascript
  /**
   * @template T
   * @param {T} value - ラップする値
   * @returns {{ value: T }} ラップされた値
   */
  function wrapValue(value) {
  	return { value };
  }
  ```

#### リテラル型 (Literal Types)

特定の値のみを許可するリテラル型を明示できます：

- **リテラル型**: 変数や引数が特定の値のみを持つことを制限します。
  ```javascript
  /**
   * @type {"success" | "error" | "pending"}
   */
  let status = 'success';
  ```

この他にもJSDocは`Promise`、`Record`、`Tuple`、`Any`などさまざまな型明示をサポートしています。これらを活用することで、JavaScriptコードでより明確な型の安全性を確保できます。

#### 型定義のインポート (Type Importing)

JSDocでは外部モジュールで定義された型をインポートして使用できます。これにより、他のファイルやライブラリで提供される型を再利用できます。

特に、TypeScriptで書かれたライブラリの場合でも、宣言された型やインターフェースをJSDocを通じてインポートして使用できます。

- **型のインポートと別定義**: `import`を使用して外部モジュールの型をインポートし、別に定義できます。

  ```javascript
  /** @typedef {import('some-module').SomeType} SomeType */

  /**
   * @type {SomeType}
   */
  let someVariable;
  ```

- **型のインポートと即時使用**: 型を直接宣言して使用できます。

  ```javascript
  /**
   * @type {import('some-module').SomeType}
   */
  let someVariable;
  ```

  上記の例では、`some-module`という外部モジュールから`SomeType`型をインポートして使用しています。これにより型を再利用し、コードの一貫性を保つことができます。

#### Nullable型 (Nullable Types)

Nullable型は変数や引数が`null`または`undefined`の値を持つことができることを示します。JSDocでは`?`または`| null`、`| undefined`を使用してNullable型を明示できます。

- **Nullable型**: 特定の値が`null`または`undefined`になる可能性があることを示します。

  ```javascript
  /**
   * @type {?string}
   */
  let nickname = null;

  /**
   * @type {number | undefined}
   */
  let age;
  ```

  この例では、`nickname`は`null`である可能性があり、`age`は`undefined`である可能性があることを明示しています。これにより、コードで意図した通りに変数が空である可能性を明確に示すことができます。

#### 非同期関数型 (Promise Types)

JavaScriptの非同期関数は主に`Promise`オブジェクトを返します。JSDocでは非同期関数の返り値の型を`Promise<Type>`形式で明示できます。

- **Promise型**: 非同期関数が返す`Promise`の型を明示します。

  ```javascript
  /**
   * データを非同期で取得します。
   * @returns {Promise<string>} 非同期関数の結果として文字列を返すPromise
   */
  async function fetchData() {
  	return 'data';
  }
  ```

  ここで`fetchData`関数は文字列を返す`Promise`を返す非同期関数であることを明確にしています。これにより非同期関数の動作をよりよく理解できます。

#### Any型

JSDocでは`any`型を使用できます。`any`型はすべての型を許可しますが、可能な限り使用を避けるべきです。

- **Any型**: 特定の型を指定せず、すべての型を許可する場合に使用します。しかし、これは型の安全性を低下させる可能性があるため、慎重に使用する必要があります。

  ```javascript
  /**
   * @type {any}
   */
  let anything;

  anything = 42; // number型として使用可能
  anything = 'こんにちは'; // string型として使用可能
  ```

  `any`型は柔軟ですが、誤った型の使用によるエラーを防ぐことが難しいという欠点があります。

#### レコードとマッピング型 (Record Types)

レコードとマッピング型を使用すると、オブジェクトのキーと値の型を明示できます。これは特にオブジェクトのプロパティが動的に生成される場合に便利です。

- **Record型**: キーと値の型を明示します。

  ```javascript
  /**
   * @type {Record<string, number>}
   */
  const nameToAgeMap = {
  	アリス: 30,
  	ボブ: 25
  };
  ```

  上記の例では、`nameToAgeMap`オブジェクトが文字列キー(`string`)と数字値(`number`)を持つレコードであることを明示しています。これはオブジェクトの構造を明確にし、誤ったキー-値ペアの使用を防ぐのに役立ちます。

この他にもJSDocはさまざまな状況に応じた型明示をサポートしています。これによりJavaScriptコードで型の安全性を維持し、コードの可読性と保守性を向上させることができます。JSDocを積極的に活用して、より明確で安定したコードを作成できます。

### JSDocの限界

- **型保証の不足**: JSDocはコメントベースであるため、実際に型を保証しません。TypeScriptのようにコンパイル時に強力な型検査を提供しないため、ランタイムエラーを事前に防ぐことに限界があります。

- **IDE依存性**: JSDocの多くの機能はIDEやコードエディタのサポートに大きく依存します。十分にサポートされていない環境では、JSDocが提供する型情報や自動補完機能を適切に活用できません。

- **文書とコードの同期問題**: JSDocはコメントに基づいているため、コードが変更されたときにコメントが更新されないと誤った情報を提供する可能性があります。これはコードの保守に困難をもたらすことがあります。

- **複雑な型処理の限界**: JSDocは複雑な型や高度な型機能を処理するのに限界があります。たとえば、複雑なジェネリック、高度なユニオンおよびインターセクション型などはJSDocで正確に表現することが難しいです。

- **TypeScriptとの統合不足**: JSDocはTypeScriptのようにJavaScriptの静的型検査を提供しないため、型の安全性を必要とするプロジェクトではTypeScriptに比べて不足しています。JSDocは単なるコメントであり、TypeScriptのようにコードの一部として強力な型保証を提供しません。
