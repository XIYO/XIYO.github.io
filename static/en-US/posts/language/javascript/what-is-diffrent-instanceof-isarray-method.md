# How to Accurately Validate an Array

There was a need for a deep copy of an object. \
Since I am not using any libraries, I am implementing it myself. 🤣\
Among the methods to accurately check an array, let's explore whether `instanceof` or `Array.isArray` is the wiser choice.

> \[!note]
> `Array.isArray` was introduced in ES5.

## Conclusion: Which Should You Use?

If `instanceof Array` yields different results, it is likely due to code designed within an iframe. If code consistency is a priority, you can use `instanceof Array`.

However, if you are using `iframe`, you should opt for `Array.isArray`.

I conducted extensive tests to find significant performance differences, but in actual usage environments, no meaningful differences were observed.

## Performance Test

I conducted a performance test validating an empty array ten billion times in both Edge and Deno.

```javascript
/** @type {Array<Array<number>>} */
const arr = [];
const time = 10_000_000_000;

// 1st
console.time('Array.isArray');
for (let i = 0; i < time; i++) {
	Array.isArray(arr);
}
console.timeEnd('Array.isArray');

// 2nd
console.time('instanceof');
for (let i = 0; i < time; i++) {
	arr instanceof Array;
}
console.timeEnd('instanceof');

Array.polyfillIsArray = function (obj) {
	return Object.prototype.toString.call(obj) === '[object Array]';
};

// 3rd
console.time('Array.polyfillIsArray');
for (let i = 0; i < time; i++) {
	Array.polyfillIsArray(arr);
}
console.timeEnd('Array.polyfillIsArray');
```

## Results

The lower the number, the better the performance.

[![Performance Check of Array Validation Method in Deno](https://mermaid.ink/img/pako:eNpFkE9PwzAMxb-K5RNIbdVS_owekIBx4ICEBCeWHbzUXaO1SZWkUqtp3510YSIX51m_9-L4iNLUjBVOs2zJ-nTHnoSGcLzyHYPAZ2tphteW5QE-2TbG9qQlg9KwZm2gyOElwD07gdE5pTQpB5s_b6bcuQpMQpzSzi9-00QdkcF0c6O67v2CbmPUHKMEvk0sR6-Mhu_wFFw5ltcCIYc0fYJVHukdWdgUeXZ3c5tA-Zg9lGUC96usKIstJthzGF3V4bfHhRfoW-5ZYBWuNdnDMv8pcDR68zVriZW3IydozbhvL2IcavK8VrS31GPVUOdCdyD9Y8y_5lp5Yz_ibs8rPv0C4mF0cw?type=png)](https://mermaid.live/edit#pako:eNpFkE9PwzAMxb-K5RNIbdVS_owekIBx4ICEBCeWHbzUXaO1SZWkUqtp3510YSIX51m_9-L4iNLUjBVOs2zJ-nTHnoSGcLzyHYPAZ2tphteW5QE-2TbG9qQlg9KwZm2gyOElwD07gdE5pTQpB5s_b6bcuQpMQpzSzi9-00QdkcF0c6O67v2CbmPUHKMEvk0sR6-Mhu_wFFw5ltcCIYc0fYJVHukdWdgUeXZ3c5tA-Zg9lGUC96usKIstJthzGF3V4bfHhRfoW-5ZYBWuNdnDMv8pcDR68zVriZW3IydozbhvL2IcavK8VrS31GPVUOdCdyD9Y8y_5lp5Yz_ibs8rPv0C4mF0cw)

[![Performance Check of Array Validation Method in Edge](https://mermaid.ink/img/pako:eNpFkMFuwjAMhl_F8gmktipoha2HSWPjsMOkSdtphINJXRrRJihJtVaId18gQ-SS_NGXz7FPKE3FWOIwyoasT3fsSWgIyyvfMgh8sZZGeG1YHuCTbW1sR1oyKA0ra34dW5isqz1PYZbDKjzr2AmMjiGlQTnY_Fsy5a67wCSIlXb-YjJ1zBE5mnasVdu-39BtVI1RJXA9sOy9Mhq-QymYOJZTgZBDmj7DYx7pHVnYzJbZfFEkUDxkxdM8gWWRLfJ8iwl2HJpQVej7dOEF-oY7FliGY0X2cPn_OXDUe_M1aomltz0naE2_b26hP1bk-U3R3lKHZU2tC7dH0j_G3DNXyhv7Ead8Hfb5D6fxd78?type=png)](https://mermaid.live/edit#pako:eNpFkMFuwjAMhl_F8gmktipoha2HSWPjsMOkSdtphINJXRrRJihJtVaId18gQ-SS_NGXz7FPKE3FWOIwyoasT3fsSWgIyyvfMgh8sZZGeG1YHuCTbW1sR1oyKA0ra34dW5isqz1PYZbDKjzr2AmMjiGlQTnY_Fsy5a67wCSIlXb-YjJ1zBE5mnasVdu-39BtVI1RJXA9sOy9Mhq-QymYOJZTgZBDmj7DYx7pHVnYzJbZfFEkUDxkxdM8gWWRLfJ8iwl2HJpQVej7dOEF-oY7FliGY0X2cPn_OXDUe_M1aomltz0naE2_b26hP1bk-U3R3lKHZU2tC7dH0j_G3DNXyhv7Ead8Hfb5D6fxd78)

To achieve meaningful results, I ran the tests ten billion times, and `Array.isArray` emerged as the fastest.

## Why is `Array.isArray` Faster?

The reason is that `Array.isArray` is optimized internally.

## Why is `instanceof` Slower?

`instanceof` checks the prototype chain of the object. \
In other words, it validates from the parent to the ancestor.

## Why is `Array.polyfillIsArray` Slower?

`Array.polyfillIsArray` is slower because this method calls the `Object.prototype.toString` method and goes through the process of checking the resulting string. \
This process requires more operations than the built-in function `Array.isArray`, making it relatively slower.

