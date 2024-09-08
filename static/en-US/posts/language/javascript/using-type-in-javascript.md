# Using Types in JavaScript

When working on a project in JavaScript, it is common to encounter situations where it is unclear what values should be passed as arguments to a library or what form the returned values will take. In such cases, it can be challenging to determine the correct usage without consulting the documentation, which can complicate development.

To address this issue, **JSDoc** was created. JSDoc is a tool that helps document JavaScript code by allowing developers to annotate functions, variables, objects, and more, clearly explaining their types and roles. This enhances code readability and supports collaboration by making it easier for other developers to understand the code. JSDoc particularly provides features like code autocompletion and type checking, enabling type safety even in JavaScript.

However, as the demand for type management in JavaScript has grown, **TypeScript** has emerged. TypeScript is a superset of JavaScript that supports static type checking, allowing developers to catch type errors at the time of writing code. This provides stronger type safety and significantly improves code maintainability.

Despite this, many developers still prefer to use pure JavaScript. The reason is that code written in TypeScript ultimately compiles down to JavaScript for execution. Therefore, if you want to ensure type safety during the coding process, using JSDoc to manage types directly in JavaScript can be a good approach. By using JSDoc, you can enhance type safety without making significant changes to the existing JavaScript codebase, allowing for a more convenient use of JavaScript.

## Using JSDoc

### Before You Start

JSDoc is primarily a documentation tool, not a type-checking tool. Type checking is performed by modern IDEs that infer and check types using JSDoc comments.

Thus, to explicitly declare and use types in JavaScript, you need to use an IDE that supports JSDoc syntax.

The IDEs that provide basic support include:

- Visual Studio Code
- WebStorm
- IntelliJ IDEA

### Types You Can Declare

Using JSDoc, you can declare various types. This section introduces the main types that can be specified in JSDoc.

#### Basic Primitive Types

Basic primitive types represent the fundamental data types in JavaScript, and JSDoc allows you to specify the following types:

- **`number`**: Represents numeric types, including both integers and floating-point numbers.

  ```javascript
  /**
   * @type {number}
   */
  let count = 42;
  ```

- **`string`**: Represents string types, used for text data.

  ```javascript
  /**
   * @type {string}
   */
  let name = 'Alice';
  ```

- **`boolean`**: Represents boolean types, which can hold either true (`true`) or false (`false`) values.

  ```javascript
  /**
   * @type {boolean}
   */
  let isActive = true;
  ```

- **`null`**: Represents the `null` value, explicitly indicating "no value."

  ```javascript
  /**
   * @type {null}
   */
  let emptyValue = null;
  ```

- **`undefined`**: Represents the `undefined` value, indicating that a variable has been declared but not assigned a value.

  ```javascript
  /**
   * @type {undefined}
   */
  let notDefined;
  ```

- **`symbol`**: Represents a symbol type used to create unique and immutable primitive values.

  ```javascript
  /**
   * @type {symbol}
   */
  let uniqueKey = Symbol('key');
  ```

- **`bigint`**: Represents a type that can express very large integers, typically used for numbers larger than 2^53.
  
  ```javascript
  /**
   * @type {bigint}
   */
  let largeNumber = 9007199254740991n;
  ```

#### Complex Types

In addition to basic primitive types, JSDoc allows you to specify complex types that combine multiple types:

- **Object Type (`Object`)**: Specifies the structure of an object.

  ```javascript
  /**
   * @typedef {Object} User
   * @property {number} id - The user's ID
   * @property {string} name - The user's name
   * @property {boolean} isActive - The user's active status
   */

  /**
   * @type {User}
   */
  const user = {
  	id: 1,
  	name: 'Alice',
  	isActive: true
  };
  ```

- **Array Type (`Array`)**: Specifies the type of each element in an array.

  ```javascript
  /**
   * @type {number[]}
   */
  let scores = [95, 85, 76];

  /**
   * @type {Array<string>}
   */
  let fruits = ['apple', 'banana', 'cherry'];
  ```

- **Union Types**: Indicates that a variable or parameter can be one of several types.

  ```javascript
  /**
   * @type {string | number}
   */
  let id;
  ```

- **Intersection Types**: Combines multiple types into a single type.

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
  	name: 'Alice',
  	age: 30,
  	employeeId: 12345
  };
  ```

#### Function Types

You can specify the types of parameters and return values for functions:

- **Specifying Function Types**: Declare the types of parameters and return values for a function.

  ```javascript
  /**
   * @param {number} x - The first number
   * @param {number} y - The second number
   * @returns {number} The sum of x and y
   */
  function add(x, y) {
  	return x + y;
  }
  ```

- **Defining Function Types**: You can also specify types for arrow functions and others.

  ```javascript
  /**
   * @type {(a: string, b: string) => string}
   */
  const concatenate = (a, b) => `${a}${b}`;
  ```

#### Generic Types

Using generic types allows you to apply the same logic to multiple types:

- **Generic Function**: Define a function that handles various types using type parameters.

  ```javascript
  /**
   * @template T
   * @param {T} value - The value to wrap
   * @returns {{ value: T }} The wrapped value
   */
  function wrapValue(value) {
  	return { value };
  }
  ```

#### Literal Types

You can specify literal types that only allow specific values:

- **Literal Types**: Restrict a variable or parameter to specific values.

  ```javascript
  /**
   * @type {"success" | "error" | "pending"}
   */
  let status = 'success';
  ```

In addition to these, JSDoc supports various types like `Promise`, `Record`, `Tuple`, and `Any`. Utilizing these can help ensure clearer type safety in your JavaScript code.

#### Type Importing

JSDoc allows you to import types defined in external modules for reuse. This is particularly useful for types or interfaces declared in TypeScript libraries.

- **Importing Types and Defining Separately**: Use `import` to bring in types from external modules.

  ```javascript
  /** @typedef {import('some-module').SomeType} SomeType */

  /**
   * @type {SomeType}
   */
  let someVariable;
  ```

- **Importing Types and Using Immediately**: You can declare types directly for immediate use.

  ```javascript
  /**
   * @type {import('some-module').SomeType}
   */
  let someVariable;
  ```

In the above example, the `SomeType` type is imported from an external module called `some-module`. This allows for type reuse and maintains code consistency.

#### Nullable Types

Nullable types indicate that a variable or parameter can hold `null` or `undefined` values. In JSDoc, you can specify nullable types using `?` or `| null`, `| undefined`.

- **Nullable Types**: Indicate that a specific value can be `null` or `undefined`.

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

In this example, `nickname` can be `null`, and `age` can be `undefined`. This clearly indicates that the variables may be empty as intended.

#### Asynchronous Function Types (Promise Types)

JavaScript's asynchronous functions typically return a `Promise` object. In JSDoc, you can specify the return type of an asynchronous function as `Promise<Type>`.

- **Promise Types**: Specify the type of the `Promise` returned by an asynchronous function.

  ```javascript
  /**
   * Fetches data asynchronously.
   * @returns {Promise<string>} A Promise that resolves to a string
   */
  async function fetchData() {
  	return 'data';
  }
  ```

Here, the `fetchData` function is clearly defined as an asynchronous function that returns a `Promise` resolving to a string. This helps in understanding the behavior of asynchronous functions better.

#### Any Type

JSDoc allows the use of the `any` type, which permits any type but should be used sparingly.

- **Any Type**: Used when you do not want to specify a particular type, allowing all types. However, this can reduce type safety, so it should be used cautiously.

  ```javascript
  /**
   * @type {any}
   */
  let anything;

  anything = 42; // Can be used as a number
  anything = 'Hello'; // Can be used as a string
  ```

The `any` type is flexible but poses challenges in preventing errors due to incorrect type usage.

#### Record and Mapping Types

Record and mapping types allow you to specify the types of keys and values in an object. This is particularly useful when object properties are created dynamically.

- **Record Types**: Specify the types of keys and values.

  ```javascript
  /**
   * @type {Record<string, number>}
   */
  const nameToAgeMap = {
  	Alice: 30,
  	Bob: 25
  };
  ```

In this example, the `nameToAgeMap` object is specified to have string keys and number values, clarifying the structure of the object and helping to prevent incorrect key-value pair usage.

JSDoc supports various type specifications for different scenarios, helping maintain type safety in JavaScript code while enhancing readability and maintainability. By actively utilizing JSDoc, you can write clearer and more reliable code.

### Limitations of JSDoc

- **Lack of Type Guarantees**: JSDoc is comment-based, so it does not provide actual type guarantees. Unlike TypeScript, it does not offer strong type checking at compile time, which limits its ability to prevent runtime errors.

- **IDE Dependency**: Many features of JSDoc heavily rely on the support of IDEs or code editors. In environments with poor support, you may not be able to fully utilize the type information or autocompletion features provided by JSDoc.

- **Synchronization Issues Between Documentation and Code**: Since JSDoc is comment-based, if the code changes and the comments are not updated, it can lead to incorrect information. This can complicate code maintenance.

- **Limitations in Handling Complex Types**: JSDoc has limitations in handling complex or advanced type features. For example, accurately representing complex generics, advanced union, and intersection types can be challenging in JSDoc.

- **Lack of Integration with TypeScript**: JSDoc does not provide static type checking like TypeScript, making it less suitable for projects that require type safety. JSDoc is merely comments and does not offer the strong type guarantees that TypeScript provides as part of the code.

