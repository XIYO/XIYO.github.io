# 이터레이터

컬렉션의 순회 방법을 정해줌으로써 사용

> [!TIP]
> 컬렉션은 배열, 리스트, 스택, 큐 등의 여러 요소의 집합을 의미합니다.

## 언제 사용할까?

코드 작성시 컬렉션을 만들 경우가 생길때, 집합을 순회하는 방법을 표준 방법으로 제공하고 싶을때 사용합니다.

## 비교

### 이터레이터 패턴 없이 직접 순회를 만든 경우

```javascript
class KingArr {
	#arr;

	constructor([]) {
		this.#arr = [];
	}

	i = 0;

	// 네이밍 컨벤션이 없어서 자신만의 네이밍을 사용했다.
	get kingElement() {
		if (this.i >= this.#arr.length) {
			return undefined;
		}
		return this.#arr[i++];
	}

	kigeReset() {
		this.i = 0;
	}
}

const myArr = new KingArr();

// MyArr 클래스의 element가 이름이 변경되면 아래의 코드도 수정이 필요하다.
try {
	while (myArr.kingElement)
        console.log(myArr.kingElement);
} catch (e) {
    console.error(e);
} finally {
    myArr.kigeRestart();
}
```

어떤 개발자가 `KingArr` 첫 번째 버전을 만들었는데, 순회 도중에 오류가 날 수있기 때문에 사용시에는 항상 `try catch` 문장을 사용해야하는 불편함이 있습니다.

`KingArr`의 순회 사용법을 모르는 개발자는 예외 처리를 하지 않고, 순회를 할 수도 있습니다.
이름도 의미가 와닿지 않기 때문에 메서드 이름이 충분히 변경될 가능성이 많고, 그렇게 될 경우 이것을 사용하는 코드에서도 같이 수정이 발생해야하는 일이 생깁니다.

### 이터레이터 패턴을 적용한 경우

모든 언어에서 구현되 있으며 많은 라이브러리도 이터레이터를 사용중이기 때문에 이터레이터를 구현하면 호환 가능하빈다.

```javascript
class KingArr {
  #arr;
  
  constructor(arr = []) {
    this.#arr = arr;
  }

  // 이터레이터 메서드 정의
  [Symbol.iterator]() {
    let index = 0;
    const items = this.#arr;

	// next 메서드를 가진 오브젝트로 반환 
    return {
      // done, value 필드를 가진 오브젝트로 반환
      next() {
        if (index < items.length) {
          return { value: items[index++], done: false };
        }
        return { done: true };
      }
    };
  }
}

// 사용 예시
const myArr = new KingArr([10, 20, 30, 40]);

// for...of로 안전한 순회
for (const item of myArr) {
  console.log(item);  // 10, 20, 30, 40
}

// 스프레드 연산자 사용 가능
const arrCopy = [...myArr];
console.log(arrCopy);  // [10, 20, 30, 40]
```

자바스크립트의 이터레이터 구현은 `Symbole.iterator`를 메서드 명으로 만들면 이터레이터가 됩니다.

이 함수는 `next()` 라는 이름의 함수를 가진 오브젝트를 반환하면 되고
`next()` 메서드는 반환할때는 오브젝트에 두 개의 필드 `done`, `value`를 담아서 반환하면 됩니다.