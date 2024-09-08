# 配列を正確に検証する方法

オブジェクトの深いコピーが必要になりました。\
ライブラリを一切使用していない状況なので、直接実装しています。🤣\
その中で、配列を正確に確認する方法として `instanceof` と `Array.isArray` のどちらが賢明な方法かを考えてみましょう。

> \[!note]
> ES5 から `Array.isArray` が追加されました。

## 結論、どちらを使うべきでしょうか？

`instanceof Array` が異なる結果を返すのは、iframe でデザインされたコードの外に限られます。\
コードの統一性を重視するのであれば、`instanceof Array` を使用すれば良いでしょう。

ただし、`iframe` を使用する場合は `Array.isArray` を使用することをお勧めします。

パフォーマンスに有意義な差をつけるために過剰な実験を行いましたが、実際の使用環境では有意義な差を感じることはできませんでした。

## パフォーマンステスト

空の配列を100億回検証するパフォーマンステストを Edge と Deno で実施しました。

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

## 結果

数値が低いほどパフォーマンスが良いです。

[![Deno での配列確認メソッドのパフォーマンスチェック](https://mermaid.ink/img/pako:eNpFkE9PwzAMxb-K5RNIbdVS_owekIBx4ICEBCeWHbzUXaO1SZWkUqtp3510YSIX51m_9-L4iNLUjBVOs2zJ-nTHnoSGcLzyHYPAZ2tphteW5QE-2TbG9qQlg9KwZm2gyOElwD07gdE5pTQpB5s_b6bcuQpMQpzSzi9-00QdkcF0c6O67v2CbmPUHKMEvk0sR6-Mhu_wFFw5ltcCIYc0fYJVHukdWdgUeXZ3c5tA-Zg9lGUC96usKIstJthzGF3V4bfHhRfoW-5ZYBWuNdnDMv8pcDR68zVriZW3IydozbhvL2IcavK8VrS31GPVUOdCdyD9Y8y_5lp5Yz_ibs8rPv0C4mF0cw?type=png)](https://mermaid.live/edit#pako:eNpFkE9PwzAMxb-K5RNIbdVS_owekIBx4ICEBCeWHbzUXaO1SZWkUqtp3510YSIX51m_9-L4iNLUjBVOs2zJ-nTHnoSGcLzyHYPAZ2tphteW5QE-2TbG9qQlg9KwZm2gyOElwD07gdE5pTQpB5s_b6bcuQpMQpzSzi9-00QdkcF0c6O67v2CbmPUHKMEvk0sR6-Mhu_wFFw5ltcCIYc0fYJVHukdWdgUeXZ3c5tA-Zg9lGUC96usKIstJthzGF3V4bfHhRfoW-5ZYBWuNdnDMv8pcDR68zVriZW3IydozbhvL2IcavK8VrS31GPVUOdCdyD9Y8y_5lp5Yz_ibs8rPv0C4mF0cw)

[![Edge での配列確認メソッドのパフォーマンスチェック](https://mermaid.ink/img/pako:eNpFkMFuwjAMhl_F8gmktipoha2HSWPjsMOkSdtphINJXRrRJihJtVaId18gQ-SS_NGXz7FPKE3FWOIwyoasT3fsSWgIyyvfMgh8sZZGeG1YHuCTbW1sR1oyKA0ra34dW5isqz1PYZbDKjzr2AmMjiGlQTnY_Fsy5a67wCSIlXb-YjJ1zBE5mnasVdu-39BtVI1RJXA9sOy9Mhq-QymYOJZTgZBDmj7DYx7pHVnYzJbZfFEkUDxkxdM8gWWRLfJ8iwl2HJpQVej7dOEF-oY7FliGY0X2cPn_OXDUe_M1aomltz0naE2_b26hP1bk-U3R3lKHZU2tC7dH0j_G3DNXyhv7Ead8Hfb5D6fxd78?type=png)](https://mermaid.live/edit#pako:eNpFkMFuwjAMhl_F8gmktipoha2HSWPjsMOkSdtphINJXRrRJihJtVaId18gQ-SS_NGXz7FPKE3FWOIwyoasT3fsSWgIyyvfMgh8sZZGeG1YHuCTbW1sR1oyKA0ra34dW5isqz1PYZbDKjzr2AmMjiGlQTnY_Fsy5a67wCSIlXb-YjJ1zBE5mnasVdu-39BtVI1RJXA9sOy9Mhq-QymYOJZTgZBDmj7DYx7pHVnYzJbZfFEkUDxkxdM8gWWRLfJ8iwl2HJpQVej7dOEF-oY7FliGY0X2cPn_OXDUe_M1aomltz0naE2_b26hP1bk-U3R3lKHZU2tC7dH0j_G3DNXyhv7Ead8Hfb5D6fxd78)

有意義な結果を得るために100億回実行した結果、`Array.isArray` が最も速い結果となりました。

## なぜ `Array.isArray` が速いのか？

理由は `Array.isArray` が内部的に最適化されているからです。

## なぜ `instanceof` が遅いのか？

`instanceof` はオブジェクトのプロトタイプチェーンを確認します。\
つまり、親から祖先まで検証します。

## なぜ `Array.polyfillIsArray` が遅いのか？

`Array.polyfillIsArray` が遅い理由は、この方法が `Object.prototype.toString` メソッドを呼び出し、結果の文字列を検査する過程を経るためです。\
この過程は組み込み関数 `Array.isArray` よりも多くの演算を必要とするため、相対的に遅くなる可能性があります。
