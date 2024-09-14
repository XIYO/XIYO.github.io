# ASUSWRTにTransmissionをインストールする

Transmissionをインストールし、リモートでトレントを管理する方法を学びます。

Transmissionは、ウェブ*UI*が内蔵されたシンプルなトレントデーモンで、複数のトレントデーモンの中でも特に人気があります。一般的には*NAS*で使用されますが、ASUSルーターでも使用できます。

## 環境

インストール環境です。

| 分類       |         詳細情報         |
| :------- | :-------------------: |
| Hardware |         AC88U         |
| Firmware | ASUSWRT-MERLIN 386.12 |
| Package  |  Entware armv7sf-k2.6 |

## 要件

必須要件は以下の通りです。

- *ASUSWRT-MERLIN*のインストール
- *SSH*アクセスの許可
- *Entware*のインストール
- 十分な容量の*USB*ストレージ \
  この文書では2つのストレージを使用します。
- 追加のクーラー \
  基本的な放熱機能だけでは熱が排出されません。

<!--
## オプション

オプションとして、便利に*VS Code*でファイルを編集するためにインストールします。

- クライアント
    - *VS Code*のインストール \
        *SSH FS*を使用するためにインストールします。
        - *SSH FS*のインストール \
            *VS Code*の拡張機能として、*VS Code*からルーターのファイルを編集・管理するためにインストールします。
- ルーター
    - *SFTP*のインストール \
        *VS Code*で*SSH FS*を使用するためにインストールします。 -->

## インストール

0. ターミナルで*SSH*を使ってルーターに接続します。
1. パッケージをインストールします。

   ```bash
   opkg update
   opkg install transmission-web
   ```

   > Entwareを更新した後、ウェブインターフェースをインストールします。

## 設定

### Transmissionを停止する

設定を変更する前にTransmissionを終了します。 \
終了しないと変更できません。

```bash
/opt/etc/init.d/S88transmission stop
```

> スクリプトを使用してTransmissionを終了します。

### 設定を編集する

デフォルトのエディタ*vi*を使用して、Transmissionの設定ファイル*/opt/etc/transmission/settings.json*を編集します。

[![asciicast](https://asciinema.xiyo.dev/a/34.svg)](https://asciinema.xiyo.dev/a/34)

0. 設定ファイルを開きます。

   ```bash
   vi /opt/etc/transmission/settings.json
   ```

   > *vi*を使用して設定ファイルを開きます。

1. プロパティを修正します。

   - 修正するプロパティを確認します。

     ```text
     "download-dir": "/mnt/XIYOsD10/home/xiyo/downloads",
     "incomplete-dir": "/mnt/XIYOsD10/var/tmp/transmission/incomplete",
     "rpc-password": "test1234",
     "rpc-username": "root",
     "watch-dir": "/mnt/XIYOsD10/home/xiyo/watchdir",
     ```

     > *XIYOsD10*はマウントされたストレージの名前です。
     >
     > - *download-dir* \
     >   ダウンロードしたファイルを保存する場所です。
     > - *incomplete-dir* \
     >   ダウンロード中のトレントファイルが保存される場所です。 \
     >   *incomplete-dir-enabled*プロパティを*true*（デフォルト）に設定する必要があります。
     > - *rpc-password* \
     >   リモートで接続する際に使用するパスワードです。 \
     >   デフォルトは空白で、パスワードなしで接続できます。 \
     >   デーモンを実行後、初回接続時に暗号化されます。
     > - *rpc-username* \
     >   リモートで接続する際に使用する*ID*です。 \
     >   デフォルトは*root*です。
     > - *watch-dir* \
     >   トレントファイルを自動的に読み込む場所です。 \
     >   *watch-dir-enabled*プロパティを*true*（デフォルト）に設定する必要があります。
     >
     > Transmissionは設定ファイルに入力したディレクトリが存在しない場合、自動的に生成するため、別途ディレクトリを作成する必要はありません。

   0. 単語を検索するには、<kbd>/</kbd>を入力し、検索するテキストを入力します。

   1. テキストを修正するには、<kbd>i</kbd>を入力して入力モードに切り替えます。 \
      修正が終わったら、<kbd>ESC</kbd>を入力してコマンドモードに切り替えます。

   2. 保存するには、コマンドモードで<kbd>:wq</kbd>を入力し、<kbd>Enter</kbd>を押すと保存してエディタを終了します。

### Transmissionを開始する

Transmissionを開始します。

```bash
/opt/etc/init.d/S88transmission start
```

> スクリプトを使用してTransmissionを開始します。

## ファイアウォールを開く

ファイアウォールを開いて、効果的にピアと接続できるようにします。

### ポートを開く

インバウンドを許可するポートをファイアウォールに追加します。

```bash
iptables -I INPUT -p tcp --dport 51413 -j ACCEPT
iptables -I INPUT -p udp --dport 51413 -j ACCEPT
```

> Transmissionで使用するポートをファイアウォールに追加します。 \
> *TCP*はファイルをダウンロードする際に使用し、*UDP*はトラッカーとピアに接続する際に使用します。

### ルールを保存する

ルーターが再起動するたびにファイアウォールルールが消えるため、再起動するたびにファイアウォールルールが適用されるように設定します。

```bash
FILE="/jffs/scripts/firewall-start"; \
[ ! -f "$FILE" ] && \
echo "#!/bin/sh" > "$FILE" && \
chmod +x "$FILE"; \
echo -e "\n# Allow Transmission" >> "$FILE"; \
echo "iptables -I INPUT -p tcp --dport 51413 -j ACCEPT" >> "$FILE"; \
echo "iptables -I INPUT -p udp --dport 51413 -j ACCEPT" >> "$FILE"
```

> *firewall-start*ファイルが存在しない場合は作成し、ファイルにファイアウォールルールを追加します。

## 自動起動

ルーターが再起動するたびにTransmissionが自動的に起動するように設定します。

Transmissionは追加ストレージを使用しているため、ストレージがマウントされる前に実行されてはいけません。 \
ドライブがマウントされた直後にTransmissionを実行するように設定します。

0. ファイルを確認します。 \
   マウント後に実行するスクリプトが存在するか確認し、存在しない場合は作成します。

   ```bash
   FILE="/jffs/scripts/post-mount"; \
   [ ! -f "$FILE" ] && \
   touch "$FILE" && \
   chmod +x "$FILE" && \
   echo "#!/bin/sh" > "$FILE"
   ```

   > post-mountファイルが存在しない場合は作成し、実行権限を追加します。

1. 自動実行スクリプトを追加します。 \
   マウント後に自動実行されるようにコマンドを追加します。

   ```bash
   FILE="/jffs/scripts/post-mount"; \
   SEARCH_STRING=". /jffs/addons/diversion/mount-entware.div # Added by amtm"; \
   ADD_COMMAND="/opt/etc/init.d/S88transmission start"; \
   grep -q "$SEARCH_STRING" "$FILE" || \
   echo -e "\n# Entware addmon start" >> "$FILE" && \
   echo "$ADD_COMMAND" >> "$FILE"
   ```

   > *diversion*をインストールまたは削除したことがある場合、*diversion*のマウントスクリプトが存在するでしょう。 \
   > その場合、すでに自動実行スクリプトが入っているため、何も作業をしません。 \
   > 存在しない場合は、Transmissionを自動実行するスクリプトを追加します。

## 使用方法

### ウェブUI

![Windows 11、Edgeで接続した画面](/static/resources/2023-11-12-22-17-45.png)

ブラウザで*<http://ルーターIP:9091>*に接続すると、ウェブ*UI*を確認できます。 \
*ID*とパスワードは設定ファイルで設定した値です。

### Transmissionクライアント

![Windows 11、Transmissionクライアントでサーバー情報入力画面](/static/resources/2023-11-12-21-28-02.png)

Transmissionクライアントはリモートサーバーへのアクセス機能があります。 \
実行後、ウェブアクセスと同じ情報を入力すれば大丈夫です。

## トラブルシューティング

### マウントされたディレクトリの変更

ストレージをデフォルト設定でマウントする場合、ユーザーのマウントされたストレージ名はsda1、sdb1となるでしょう。 \
この場合、ルーターが再起動するたびにストレージ名が変更される可能性があります。したがって、マウントを常に固定する必要があります。

