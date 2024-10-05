# 리터럴의 메모리 저장 방식

리터럴은 프로그래밍 언어에서 변수에 직접 할당되는 고정된 값을 의미합니다. 이 글에서는 자바의 리터럴이 메모리에 어떻게 저장되고 관리되는지 살펴보겠습니다.

## 리터럴이란?

리터럴은 코드에서 값으로 직접 나타나는 데이터를 말합니다. 예를 들어 숫자 `10`, 문자열 `"Hello"`, 논리값 `true` 등은 모두 리터럴입니다. 쉽게 말해, 리터럴은 코드에서 사용되는 데이터 그 자체입니다.

리터럴의 대표적인 유형은 다음과 같습니다:

- **정수 리터럴**: `10`, `-42`, `0`, `9999L`
- **실수 리터럴**: `3.14f`, `0.5`, 
- **문자 리터럴**: `'A'`, `'B'`
- **문자열 리터럴**: `"Hello"`, `"World"`
- **불리언 리터럴**: `true`, `false`

## 리터럴의 저장 방식

리터럴이 메모리에 저장되는 방식은 변수가 기본형인지 래퍼 클래스 또는 문자열인지에 따라 달라집니다.

### 기본형 변수

기본형 변수에 리터럴을 대입하면, 해당 값은 변수의 메모리 공간에 직접 저장됩니다. 예를 들어 정수 리터럴 `10`을 기본형 변수에 할당하면, 변수의 메모리 공간에 `10`이라는 값이 직접 저장됩니다. 이는 처리 속도가 빠르고 효율적입니다.

**코드 예시:**
```java
public class Main {
    public static void main() {
        int intVal = 3;
    }
}
```

**메모리 다이어그램:**

[![](https://mermaid.ink/img/pako:eNpVULFOwzAQ_RXrJpCiKHHqNvEIrJ2KGCAMJnabiMSuXEdQomydkNhZ-g8dGOCb2v5DL4lU1JNlv3d67-l8DWRGKuAwL81blgvryP1NqgnWqn5ZWLHMya0oy5kT2etTCh0mPUnhedB1JQurMlcYfXZfJExFodHcPX6F19X1hburQrsHUaJoAJxEh-032f9tjp-_ZP-1O2x_jpvdhU1pORAE4EGlLGZL_EvTtVNwuapUChyhFBYHTnWLOlE7M1vrDLiztfLAmnqRA5-LcoWsXkrh1F0hcPLq3F0K_WjMP1eycMZOh9X1G-w1wBt4B54EfsLoKKaTgMZROGYerIHTkPrJmOIJJ0E8DuKo9eCjT438MGDBiLIwYiyJ6Ii1J9YYgVQ?type=png)](https://mermaid.live/edit#pako:eNpVULFOwzAQ_RXrJpCiKHHqNvEIrJ2KGCAMJnabiMSuXEdQomydkNhZ-g8dGOCb2v5DL4lU1JNlv3d67-l8DWRGKuAwL81blgvryP1NqgnWqn5ZWLHMya0oy5kT2etTCh0mPUnhedB1JQurMlcYfXZfJExFodHcPX6F19X1hburQrsHUaJoAJxEh-032f9tjp-_ZP-1O2x_jpvdhU1pORAE4EGlLGZL_EvTtVNwuapUChyhFBYHTnWLOlE7M1vrDLiztfLAmnqRA5-LcoWsXkrh1F0hcPLq3F0K_WjMP1eycMZOh9X1G-w1wBt4B54EfsLoKKaTgMZROGYerIHTkPrJmOIJJ0E8DuKo9eCjT438MGDBiLIwYiyJ6Ii1J9YYgVQ)

> 기본형 변수는 콜 스택에 비트 데이터를 직접 저장합니다.

### 래퍼 클래스와 문자열

기본형의 참조형인 래퍼 클래스(Integer, Double 등)와 문자열 클래스는 상수 풀(Constant Pool)이라는 특별한 공간에 저장됩니다. 상수 풀에 동일한 값이 이미 존재하면, 기존의 주소를 반환하여 메모리를 절약합니다.

**코드 예시:**
```java
public class Main {
    public static void main(String[] args) {
        Integer intVal = 3;
        String str = "hello";
    }
}
```

**메모리 다이어그램:**

[![](https://mermaid.ink/img/pako:eNqFUj1PwzAQ_SvWLQWprfLRtEkGBmBhqIRUxABhMInbRLh25TiCUnWrGBDsLJ34Ax0YQOIftf0POE6b0gLiFMX3rHf37sk3gpBHBHzoUn4bxlhIdHYYMKQiza57Ag9idIQp7Ugc3lwGkOdIgwCuCl4eUSJIKBPOyuqtDm2cMFWcH_W--u3tb1XnkTB5jqkinTBJekSsLny0eP1cPDz94KdSKHJHioT1cvArkbCoAGWya42zVGImTznPtdcQ5XirE00kEZgWI65HsxfTFzT_mCwf39H8ebaYvi0ns7JMa-7oFfPuqK5M_C2eakKhra1WYkIpr_wvv7FczIxqtYNvXlbTSaHvSxmoQp8I9VCRWoxRTgpAxqRPAvBVGmGhXj9gY8XDmeSdIQvBlyIjVRA868XgdzFNFcoGEZbkOMHKfb-8HWB2wfkGkyiRXLSLPdTrqDngj-AOfM-oe47VcK2WYbm22XSqMATfMq2617TUZ7YMt2m49rgK97qrXTcNx2hYjmk7jmdbDWf8BU0T910?type=png)](https://mermaid.live/edit#pako:eNqFUj1PwzAQ_SvWLQWprfLRtEkGBmBhqIRUxABhMInbRLh25TiCUnWrGBDsLJ34Ax0YQOIftf0POE6b0gLiFMX3rHf37sk3gpBHBHzoUn4bxlhIdHYYMKQiza57Ag9idIQp7Ugc3lwGkOdIgwCuCl4eUSJIKBPOyuqtDm2cMFWcH_W--u3tb1XnkTB5jqkinTBJekSsLny0eP1cPDz94KdSKHJHioT1cvArkbCoAGWya42zVGImTznPtdcQ5XirE00kEZgWI65HsxfTFzT_mCwf39H8ebaYvi0ns7JMa-7oFfPuqK5M_C2eakKhra1WYkIpr_wvv7FczIxqtYNvXlbTSaHvSxmoQp8I9VCRWoxRTgpAxqRPAvBVGmGhXj9gY8XDmeSdIQvBlyIjVRA868XgdzFNFcoGEZbkOMHKfb-8HWB2wfkGkyiRXLSLPdTrqDngj-AOfM-oe47VcK2WYbm22XSqMATfMq2617TUZ7YMt2m49rgK97qrXTcNx2hYjmk7jmdbDWf8BU0T910)

> 래퍼 클래스와 문자열은 상수 풀에 저장된 값을 참조합니다.

## 래퍼 클래스와 문자열의 비교

래퍼 클래스와 문자열 리터럴은 상수 풀의 주소를 참조하기 때문에, 동일한 값을 여러 번 생성하더라도 항상 같은 인스턴스를 참조합니다. 반면, `new` 키워드를 사용해 객체를 생성하면 상수 풀 대신 힙 메모리에 새 객체가 생성됩니다.

**코드 예시:**
```java
public class ConstantPoolTest {  
    public static void main(String[] args) {  
        A a = new A();  
        B b = new B();  
  
        System.out.println(a.instanceStr == b.instanceStr);  // true  
        System.out.println(a.instanceStr == b.newStr);       // false  
        System.out.println(a.instanceStr == b.internStr);    // true  
        System.out.println(a.instanceStr.equals(b.newStr));  // true  

        System.out.println(a.instanceInt == b.instanceInt);  // true  
        System.out.println(a.instanceInt == b.newInt);       // false  
        System.out.println(a.instanceInt == b.internInt);    // true  
        System.out.println(a.instanceInt.equals(b.newInt));  // true  
    }  
}  
  
class A {  
    String instanceStr = "instanceStr";  
    Integer instanceInt = 1;  
}  
  
class B {  
    String instanceStr = "instanceStr";  
    String newStr = new String("instanceStr");  
    String internStr = newStr.intern();  

    Integer instanceInt = 1;  
    Integer newInt = new Integer(1);  
    Integer internInt = newInt.intValue();  
}
```
> `intern()` 메서드를 사용하면 문자열 상수 풀에서 동일한 값을 찾아 주소를 반환합니다.

리터럴로 생성된 객체는 같은 상수 풀 주소를 공유하므로 비교 결과가 '참'이지만, `new` 키워드를 사용해 생성한 객체는 힙 메모리에 별도로 생성되므로 비교 결과가 '거짓'입니다.