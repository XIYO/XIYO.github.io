# try-with-resources

운영 체제(OS)에서는 리소스에 접근할 때 다른 프로세스가 사용하지 못하도록 잠금이 발생합니다. 잠금이 발생하면 다른 프로세스에서 접근할 수 없기 때문에 안전하게 데이터 처리가 가능합니다. 하지만, 사용 후에는 반드시 자원을 해제해야 합니다. 자바 1.7 이후로 이러한 자원 처리의 복잡성을 줄이기 위해 '문법 설탕(syntactic sugar)' 기능인 `try-with-resources`가 도입되었습니다.

## try-with-resources가 도입되기 전

1.7 이전에는 개발자가 자원에 접근하고, 자원을 명시적으로 닫는 코드를 직접 작성했습니다.

```java
class Main {
    public static void main(String[]args){
        try {
            File file = new File("./src/try_test.md");
            FileReader fr = new FileReader(file);
            BufferedReader br = new BufferedReader(fr);

            String line;
            while ((line = br.readLine()) != null) {
                System.out.println(line);
            }

            br.close();
            fr.close();
        } catch (IOException e) {
            System.out.println("oops! exception: " + e.getMessage());
        }
    }
}
```

> `close()`가 모든 로직이 끝나고 실행되도록 로직의 마지막에 위치한 코드

자원을 닫을 때는 객체 생성의 역순으로 닫아야 합니다. 예를 들어 `BufferedReader`는 `FileReader`에 의존하기 때문에, `BufferedReader`를 먼저 닫아야 합니다. 이러한 구조가 복잡해질수록 자원을 제대로 해제하지 않으면 오류를 발생시킬 가능성이 커집니다.

## try-with-resources 사용

`try-with-resources`는 자원 블록에 `AutoCloseable` 인터페이스를 구현한 객체를 선언함으로써 컴파일러가 자동으로 `close()` 코드를 생성해줍니다.

```java
import java.io.*;

class Main {
    public static void main(String[]args){
        try (BufferedReader br2 = new BufferedReader(new FileReader("./src/try_test.md"))) {
            String line;
            while ((line = br2.readLine()) != null) {
                System.out.println(line);
            }
        } catch (IOException e) {
            System.out.println("oops! exception: " + e.getMessage());
        }
    }
}
```

> `try-with-resources`를 사용하여 `close()`를 작성하지 않은 코드

컴파일러가 `close()` 메서드를 자동으로 추가하여 자원을 처리하는 코드를 단순화할 수 있습니다.

**컴파일 후 코드**:

```java
//
// Source code recreated from a .class file by IntelliJ IDEA
// (powered by FernFlower decompiler)
//

import java.io.BufferedReader;
import java.io.File;
import java.io.FileReader;
import java.io.IOException;

class Main {
    public static void main(String[] args) {
        IOException e;
        try {
            BufferedReader br2 = new BufferedReader(new FileReader("./src/try_test.md"));

            String line;
            try {
                while((line = br2.readLine()) != null) {
                    System.out.println(line);
                }
            } catch (Throwable var9) {
                try {
                    br2.close();
                } catch (Throwable var6) {
                    var9.addSuppressed(var6);
                }

                throw var9;
            }

            br2.close();
        } catch (IOException var10) {
            e = var10;
            System.out.println("oops! exception: " + e.getMessage());
        }

    }
}
```

> 컴파일 후에 `close()` 메서드가 자동으로 추가된 코드

컴파일러가 자동으로 `close()` 메서드를 추가하여 자원을 처리하는 코드를 단순화할 수 있습니다. 

