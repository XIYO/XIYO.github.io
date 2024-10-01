# oh-my-posh 설치하기

'oh-my-posh'는 쉘 테마 도구 입니다.
윈도우에서는 쉘이 사실상 파워쉘 말고는 없습니다.
그런 환경에서 조금이라도 보기 편하게 테마를 만들어주는 도구가 'oh-my-posh' 입니다.

패키지 이름에 'posh' 단어가 'power shell' 을 의하는데, 최초의 기능은 파워쉘의 테마를 지원하기 위해 만들어졌습니다.
그러나 점차 확대 되어 `bash`, `zsh` 등 여러 쉘을 지원하게 되었습니다.

## 설치

 **win-get 으로 설치하기**

```sh
winget install --id XP8K0HKJFRXGCK # 윈도우 스토어 버전
winget install --id JanDeDobbeleer.OhMyPosh # 벤더 버전
```

> 윈도우 스토어가 업데이트를 자동으로 해주기 때문데 조금 더 편리합니다.

 **윈도우 스토어에서 설치하기**

명령어를 사용하지 않고, [윈도우 스토어](https://apps.microsoft.com/store/detail/XP8K0HKJFRXGCK?ocid=pdpshare)에서 직접 설치하는 방법도 있습니다.

> 명령어에서 윈도우 스토어 버전을 설치하는 것과 똑같습니다.

## 설정

이제 쉘 실행시 'oh-my-posh'가 먼저 실행되도록 작업하고 테마를 설정하겠습니다.

```sh
# 테마 검색
 Get-PoshThemes
# 글꼴 설치
# 단, 한국어를 주로 사용하니 네이버에서 만든 D2 글꼴이 좋다.
# 윈도우 터미널을 사용한다면 관리자 모드로 설치해야 폰트를 못 찾는 문제가 없다.
oh-my-posh font install
```
