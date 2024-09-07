# ブランチ名の変更

ローカルでプロジェクトをGitで管理するためにGitを初期化すると、`master`ブランチが生成されます。GitHubが推奨している「main」というブランチ名をよく使用するため、ブランチ名を変更する方法を見ていきましょう。

## `git` コマンドでブランチ名を変更

「master」として生成されたブランチ名を「main」に変更します。

### ローカルリポジトリ

1. Gitを初期化します。

   ```bash
   git init
   ```

2. ブランチ名を変更します。
   ```bash
   git branch -m master main
   ```

### リモートリポジトリ

1. リモートリポジトリをクローンします。
   ```bash
   git clone repository-url
   ```
2. リモートリポジトリに移動します。
   ```bash
   cd repository
   ```
3. ブランチ名を変更します。
   ```bash
   git branch -m master main
   ```
4. 変更をリモートリポジトリにプッシュします。
   ```bash
   git push -u origin main
   ```
5. リモートリポジトリの以前のブランチを削除します。
   ```bash
   git push origin --delete master
   ```

## リモートリポジトリで直接ブランチ名を変更

GitHubでは、ウェブ上でブランチ名を変更することで、上記の手順を経る必要がありません。

![img.png](img.png)

1. <https://github.com/オーナー名/ブランチ名/branches> ページに移動します。
2. ハンバーガーメニューをクリックし、`Rename branch`をクリックします。

## 初期生成ブランチ名の変更

Git初期化時に生成されるブランチ名を「main」に変更します。

```shell
git config --global init.defaultBranch main
```

