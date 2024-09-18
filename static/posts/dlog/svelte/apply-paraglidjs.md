# Paraglide JS 적용기

새로운 국제화 라이브러리인 **Paraglide JS**를 프로젝트에 적용한 경험을 공유합니다.

## 왜 국제화를 도입했나요?

과거에 겪었던 불편한 개발 경험 중 하나는, 국제화를 위해 프로젝트를 복제하여 언어를 바꾸고, 각 언어별로 별도의 인스턴스를 운영해야 했던 점입니다. 이 과정에서 언어마다 기능이 달라져 버리는 문제가 발생했고, 그로 인해 국제화 작업이 매우 번거로웠습니다.

그러한 경험이 되풀이 되지 않도록 이 블로그에서 국제화를 시도하여 대처 방법을 알아보았습니다.

## Paraglide JS란 무엇인가요?

**Paraglide JS**는 인공지능을 활용한 번역 지원 도구입니다. 단일 언어로 작성된 콘텐츠를 **웹 에디터**를 통해 손쉽게 번역할 수 있으며, 추가적인 번역본도 쉽게 관리할 수 있습니다. 개인 사용자에게는 무료로 제공되며, 기업을 대상으로 유료화 정책을 고려 중이라 부담 없이 사용할 수 있습니다.

## 특징

### 에디터

[Paraglide JS | inlang](https://inlang.com/m/gerre34r/library-inlang-paraglideJs) 에서 설명하는 특징은 가벼움, 타입 세이프, VS Code 확장 제공 등 이외에, 편리한 특징은 "번역 에디터 제공" 입니다.

![Paraglide JS의 에디터](/static/resources/apply-paraglidjs-20240918153234469.png)
> 개발 시스템이 없는 외부에서도 에디터를 통해 번역본을 제공할 수 있습니다.

개발 초기에는 한국어로만 작성하여 빠른 작업물을 만들고, 후에 에디터를 통해 작업할 수 있어 협업시에도 상당히 편리한 기능입니다. 특히, "기계 번역 기능을 제공"해주기 때문에 빠르게 번역본을 제공할 수 있습니다.

번역이 되지 않은 문장은 기본 언어로 출력되기 때문에 텍스트가 빈다거나 하는 문제는 발생하지 않습니다.

### 메타 태그 최적화

HTML 문서에 언어에 대한 정보를 추가적으로 삽입해주기 때문에 SEO와 브라우저에 최적화를 해줍니다.

```html
<html lang="ko-KR" dir="ltr">
  <head>
  <link rel="alternate" hreflang="ko-KR" href="http://localhost:5173/posts">
  <link rel="alternate" hreflang="ja-JP" href="http://localhost:5173/ja-JP/posts">
  <link rel="alternate" hreflang="en-US" href="http://localhost:5173/en-US/posts">
  </head>
```

> `<html lang="ko-KR" dir="ltr">` 의 `lang` 속성은 브라우저가 번역 옵션의 활성화를 고려하는 속성입니다. `dir` 속성은 글의 방향을 제어하는 속성입니다. 


## 적용 방법

총 두 가지 방법이 있지만 차이점은 단순히 자동화 유무입니다.
스벨트킷과 잘 통합된 이니셜라이저만 알아보고 기본 이니셜라이즈는 제외합니다.

### paraglide-sveltekit 이니셜라이저 사용하기

이니셜라이저를 사용하면 쉽게 프로젝트에 적용할 수 있습니다.

```shell
npx @inlang/paraglide-sveltekit init
npm install
```

> 꼭 `npx` 명령어로 실행해야 하며, 다른 패키지 매니저는 지원되지 않습니다.

적용 후에 사소한 문제가 하나 있었습니다.
자동 생성되는 `ParaglideJS` 컴포넌트가 예외 대상까지 감싸는 문제였습니다.

그러한 문제를 해결하기 위해, `ParaglideJS`가 예외 대상을 포함하지 않도록 수정하였습니다. 

```svelte data-title="+layout.svelte"
<script>  
  import { ParaglideJS } from '@inlang/paraglide-sveltekit';  
  import { i18n } from '$lib/i18n';  
  
  const { children } = $props();  
</script>  

<ParaglideJS {i18n}> // [!code --]
  <svelte:head>  
    <title>{$page.data.title}</title>  
    <meta name="description" content={$page.data.description} />  
  </svelte:head>  

<ParaglideJS {i18n}> // [!code ++]
  <div id="container-content">  
   <Header title={$page.data.title} />  
   <main class="margin-block">  
    {@render children()}  
   </main>   <Footer gitLog={$page.data.gitLog} />  
  </div>  <Nav />
</ParaglideJS>
```

> `svelte:head` 컴포넌트는 다른 요소 및에 존재할 수 없기 때문에 `ParaglidJS` 컴포넌트에서 밖으로 뺐습니다.

## 사용하기

### 국제화 언어 추가

스벨트킷 이니셜라이저를 사용했다면, `/messages/{lang}.json`에 각 언어에 맞는 파일이 생성됩니다. 
초기에는 하나의 언어에 대해서만 작성하고, 에디터를 이용해 추가 번역본을 제공할 수 있습니다.

`/messages/ko-KR.json`에 문장 추가

```json data-title="ko-KR.json"
{
    "$schema": "https://inlang.com/schema/inlang-message-format",  
    "title": "이요의 홀",  
    "description": "기록 보관소 및 실험실 및 놀이터 및 블로그",  
    "welcome": "no js, no css 를 위한! 터미널 브라우저까지 고려한... svelte 로 직접 만든 블로그! 입니다. (JS 가 활성화 되어 있으면 반응성이 향상됩니다!)",  
}
```
> 먼저 하나의 언어로만 작성하면 됩니다.

이제 프로젝트를 `npm run dev`로 실행하면 빌드 타임에 Paraglide JS가 언어 파일을 빌드하여 `/src/lib/paraglid/messages.js`를 생성하여 타입 세이프한 코드를 작성할 수 있게 해줍니다.

생성된 `messages.js`를 사용하여 국제화 문장을 사용하면 언어가 바뀔 때마다 언어에 맞게 교체됩니다.

```svelte data-title="+page.svelte"
<script>  
  import Border from '$lib/ui/Border.svelte';  
  import * as m from '$lib/paraglide/messages.js'; // [!code focus]
</script>  
  
<Border viewTransitionName="post" negative>  
  <div class="padding content">  
   <p>{m.welcome()}</p> // [!code focus]
  </div>
</Border>
```

### 언어 선택기 추가

언어를 변경할 수 있는 컴포넌트를 따로 만들어서 관리할 수 있습니다.

```svelte data-title="LangSwitch.svelte"
<script>  
  import { availableLanguageTags } from '$lib/paraglide/runtime.js';  
  import { i18n } from '$lib/i18n.js';  
  import { page } from '$app/stores';  
</script>  
  
{#snippet switcher({href, lang})}  
  <li>
    <a {href} hreflang={lang}>  
      {lang}  
    </a>
  </li>
{/snippet}  
  
<ul>  
  {#each availableLanguageTags as lang}  
    {@render switcher({href: i18n.route($page.url.pathname), lang})}  
  {/each}
</ul>
```

> 스벨트의 스니펫 구문을 사용하여 조금 더 모듈화 하였습니다.

이제 이 선택기를 원하는 위치에 넣기만 하면 언어 변경이 매우 쉽게 동작합니다.

![언어 선택기를 적용한 모습](/static/resources/apply-paraglidjs-20240918161625634.png)

> 언어 선택기를 내비게이션에 넣었습니다. 

## 마치며

ParaglideJS는 간단한 국제화 기능을 제공하지만, 사용 시 주의할 점이 있습니다. 특히 언어가 변경될 때마다 컴포넌트가 전체적으로 리렌더링 되므로, 렌더링마다 결과가 달라질 수 있는 컴포넌트에서는 신중해야 합니다. 예를 들어, 랜덤 함수가 포함된 컴포넌트의 경우 예상치 못한 동작을 유발할 수 있습니다.

또한, Paraglide JS가 제공하는 문장은 상태 변수가 아니므로 리렌더링이 일어나지 않을 경우에 대한 로직도 고려해야합니다.

마크다운을 위한 라이브러리도 아니기 때문에 마크다운의 국제화에 대해서도 고려한 디자인을 해야하는 번거로운 점도 있습니다.