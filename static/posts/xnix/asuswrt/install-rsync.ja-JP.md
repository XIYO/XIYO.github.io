# RSYNCのインストール

ルーターでnginxを実行しています。\
ランディングページを構成中のため、自動デプロイのためにrsyncをインストールします。

## 環境

作業時の環境です。

- AC88U
- Merlin 386.12\_4
- Entware 2022-02-24

## 要件

必須要素です。詳細な説明は省略します。

- Merlinファームウェアのインストール
- Entwareのインストール
- jffsパーティションの有効化
- sshの有効化

## インストール

```bash
opkg update
opkg install rsync
```

