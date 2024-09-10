# SOLUTION INTELLIJ SHORTCUT CONFLICT

*IntelliJ* のショートカットの競合問題を解決する方法を見ていきます。

IntelliJ を使い始めてから約1週間が経過した頃に発生した警告です。 \
最新バージョンの IntelliJ ではキー機能がオーバーライドされているため、競合は発生しません。 \
使用に問題がなければ、警告メッセージを無視しても構いません。

## ENVIRONMENT

- macOS 14.0 (Sonoma)
- IntelliJ IDEA Ultimate 2023.2.2
  - 新しい UI
    - コンパクトモード

## PROBLEM

![ショートカット競合警告](/static/resources/2023-10-27-11-00-19.png)

ショートカット競合という警告が表示されました。

## SOLUTION

### INTELLIJ

![ショートカット競合確認](/static/resources/2023-10-27-11-10-04.png)

*Modify Shortcuts* リンクを通じて *Keymap* を確認したところ、<kbd>⇧</kbd> + <kbd>⌘</kbd> + <kbd>A</kbd> のショートカットが競合していました。

### MACOS, SONOMA

まず設定アプリを起動します。

0. **設定画面** :

   ![設定でキーボードショートカット画面にアクセスする方法](/static/resources/2023-10-27-11-52-59.png)

   0. *Keyboard* メニューをクリック
   1. *Keyboard Shortcuts* ボタンをクリック

1. **キーボードショートカット画面** :

   ![ソノマのショートカット設定確認](/static/resources/2023-10-27-11-59-56.png)

   0. *Services* メニューをクリック
   1. *Text* 項目をクリック
   2. *Search man Page Index in Terminal* 項目の **チェックを外す**

## WHAT IS *SEARCH MAN PAGE INDEX IN TERMINAL*?

![ショートカット実行結果](/static/resources/2023-10-27-12-08-57.png)

この機能は、選択したテキストをターミナルでマニュアルオプションとして渡す役割を果たします。 \
そして、マニュアルがシステムに存在する場合は出力されます。

しかし、*man* オプションに渡される引数が *sudo;type=a* と誤って渡されるため、マニュアルを見つけられず、マニュアルがないと出力されます。

**実行可能なコマンド** :

```text
man sudo;type=a
```

問題なくマニュアルが出力されます。

**エラーが発生するコマンド（推測）** :

```text
man "sudo;type=a"
```

ショートカットで実行したときと同じテキストが出力されます。

