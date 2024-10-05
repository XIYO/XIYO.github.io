# 클래스의 정적 초기화

저의 블로그에서 카테고리를 만들고 관리하는 코드에서 사용하는 정적 초기화 방법과 조금 더 올바른 코드로 개선한 사례를 소개합니다.

블로그 프로젝트에서, 카테고리를 관리하기 위해 클래스 문법을 활용한 [Category.js](https://github.com/XIYO/xiyo.github.io/blob/a1bbc44ebd12986ce1d06d74273c6242efbae4f2/src/lib/post/Category.js "클래스 초기화를 외부에서 수행한 코드")를 설계했습니다.  
설계 시 가장 중점을 둔 부분은 멤버의 노출 최소화 였습니다.
모든 멤버를 `#`을 붙여 프라이빗으로 선언하여 외부에서 직접 접근하지 못하도록 했으며,
멤버의 노출이 필요할 경우 필드는 게터만 제공하여 쓰기의 제한을, 메서드는 공개 메서드로 전환했습니다. 

## 최초의 설계

`Category.js` 는 `new` 키워드를 통해 인스턴스화하지 않고, [정적 메서드로 카테고리 인스턴스를 반환](https://github.com/XIYO/xiyo.github.io/blob/a1bbc44ebd12986ce1d06d74273c6242efbae4f2/src/lib/post/Category.js#L84-L100)하는 구조를 원했습니다.

```js
import Category from '$lib/post/Category.js';

Category.getCategory("Windows") // 윈도우즈 카테고리 인스턴스를 반환
```

> 정적 메서드를 통해 이미 생성된 카테고리 인스턴스를 가져오는 디자인

이 방식으로 사용하려면, 별도의 초기화 없이 임포트와 동시에 [내부에서 초기화](https://github.com/XIYO/xiyo.github.io/blob/a1bbc44ebd12986ce1d06d74273c6242efbae4f2/src/lib/post/Category.js#L178)가 이루어져야 했습니다. 이때 메서드를 외부에 노출하지 않고도 임포트와 동시에 초기화하는 방법을 고민한 끝에,
- 클래스 외부에 "Symbol"을 선언하고, 
- 클래스 내부에 "Symbol"을 메서드 이름으로 사용한 후,
- 해당 메서드를 실행해 외부에 노출되지 않는 초기화 메서드를 구현할 수 있었습니다.

```js data-title="Category.js"
const symbol = Symbol('Category initialization');

export default class Category {
	static [symbol]() {
	    // ...init
	}
}

Category[symbol]();
```

> 심볼을 활용한 메서드 이름 정의로 외부 접근을 방지한 초기화 방식

그러나 이 방식에는 단점이 있었습니다. 
리플렉션을 사용하면 초기화 메서드에 접근할 수 있으며, 
이를 통해 초기화가 다시 실행될 가능성이 있었습니다. 
향후 이 문제를 방지하기 위한 개선이 필요했습니다.

## 정적 초기화 블럭으로 개선

자바에서 `{}` 블럭을 통해 정적 멤버와 인스턴스 멤버를 초기화할 수 있습니다.
[자바스크립트에서도 클래스 문법에 적용](https://github.com/XIYO/xiyo.github.io/blob/ebd7d90f357ef507654a1a6b08aa4ece8f42d0d1/src/lib/post/Category.js#L5 "정적 초기화 블럭을 사용한 코드")하여 코드를 더욱 간결하게 만들 수 있습니다.

> [!NOTE]
> 프로토타입은 즉시 실행 함수 표현식, "IIFE"를 사용하여 정적 초기화 로직을 구현할 수 있습니다.

```js data-title="Category.js"
const symbol = Symbol('Category initialization'); // [!code --]

export default class Category {
	static [symbol]() { // [!code --]
	static { // [!code ++]
	    this.#member = data; // 정적 초기화에서 this 키워드 사용 가능 // [!code ++]
	    // ...init
	}
}

Category[symbol](); // [!code --]
```

> 정적 초기화 블럭을 통한 클래스 내부에서 초기화

### 자바와 자바스크립트의 초기화 블럭 차이점

자바에서는 두 가지 초기화 블럭을 사용할 수 있습니다.
- `static {}`, 정적 초기화 블럭
- `{}`, 객체 초기화 블럭

반면, 자바스크립트에서는 한가지 초기화 블럭만 사용할 수 있습니다. 
- `static {}`, 정적 초기화 블럭

추가적으로 자바와 자바스크립트는 초기화 블럭에서 `this` 키워드 사용에 차이가 있습니다. 
자바는 인스턴스 생성 후에만 `this`를 사용할 수 있지만, 
자바스크립트는 1급 객체로서 정적 초기화 블럭에서도 `this`를 사용하여 정적 멤버에 접근할 수 있습니다. 
이러한 차이는 자바스크립트가 함수형 프로그래밍 특성을 더 잘 지원하기 때문입니다.
