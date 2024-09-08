# CUSTOM DDNS

asuswrt-merlinファームウェアでカスタムドメインを接続する方法をまとめます。

Google Domainsを使用している間にSquarespaceに売却されました。Google DomainsからCloudflareへのドメイン移行後、カスタムDDNS設定を行う手順をまとめます。

## REQUIREMENTS

カスタムDDNS設定のために、以下の事項を準備する必要があります。

- **ファームウェアバージョン** : \
  inadynパッケージを使用してカスタムDDNSを設定するため、384.7以上のバージョンが必要です。
- **JFFS** : \
  カスタムDDNS設定のためにはJFFSが有効になっている必要があります。
- **SSH** : \
  ルーターにアクセスする権限が必要です。

> 要件に関する説明はこの文書では行いません。

## CHANGE DDNS

既存のDDNS設定を変更します。

[DDNS設定](https://router.xiyo.dev/Advanced_ASUSDDNS_Content.asp)でServerをCustomに変更します。

![DDNSオプション変更](img_4.png)

WANカテゴリのDDNS設定でServerオプションをCustomに変更します。

## ISSUE API TOKEN

Cloudflareの[トークン発行](https://dash.cloudflare.com/profile/api-tokens)で

- zone.zone read
- zone.dns edit

権限を持つトークンを発行します。

発行後の結果：

![トークン発行結果](img_3.png)

## SETUP INADYN

### MAKE CONFIG

`/jffs/inadyn.conf`ファイルを作成します。

このシナリオではワイルドカードドメインを使用するため、2つのプロバイダーを使用します。

```shell
# ドメイン
# 単一プロバイダーのみを使用する場合は `:1` を削除して使用します。
# provider cloudflare.com
provider cloudflare.com:1 {
    username = "xiyo.dev"
    password = API_TOKEN  # 発行されたトークンを入力します。ダブルクォーテーションで囲んで入力します。
    hostname = "xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}

# ワイルドカードドメイン
provider cloudflare.com:2 {
    username = "xiyo.dev"
    password = API_TOKEN # 発行されたトークンを入力します。ダブルクォーテーションで囲んで入力します。
    hostname = "*.xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}
```

### CHECK CONFIG

設定の文法を確認します。

```shell
inadyn --check-config --config="/jffs/inadyn.conf"
```

> エラーが発生した場合は文法を再確認してください。

### RUN INADYN

inadynを実行してドメインにIPを登録します。

```shell
inadyn --once --config="/jffs/inadyn.conf"
```

> `--once`オプションはデーモンモードをオフにするためのオプションです。理由は自動化で説明します。

## AUTOMATION

IPが変更されるたびにドメインに接続されたIPを変更できるように設定します。

`/jffs/scripts/ddns-start`ファイルがない場合は作成し、実行権限を付与します。

```shell
touch /jffs/scripts/ddns-start
chmod +x /jffs/scripts/ddns-start
```

`/jffs/scripts/ddns-start`ファイルに次の内容を入力します。

```shell
#!/bin/sh

inadyn --once --config="/jffs/inadyn.conf" exec="ddns_custom_updated 1"
```

> `ddns_custom_updated 1`はstart-ddnsの実行完了を知らせるコマンドです。

## CHECK

ドメインが実際のIPと接続されているか確認します。

実行

```shell
nslookup xiyo.dev
```

結果

```text
Server:  XIYOsRouter
Address:  192.168.1.1

Non-authoritative answer:
Name:    xiyo.dev
Address:  124.5.184.78
```

ルーターのメインで表示されるIPと一致すれば正常に設定されています。

## AFTER

これでルーターが再起動されてもIPが変更されても、ドメインは常にルーターを指し示します。

次回はルーターに証明書をインストールする方法をまとめます。

## REFERENCE

[asuswrt-merlinカスタムDDNSウィキ](https://github.com/RMerl/asuswrt-merlin.ng/wiki/DDNS-services)

[inadyn設定例](https://github.com/troglobit/inadyn#example)

