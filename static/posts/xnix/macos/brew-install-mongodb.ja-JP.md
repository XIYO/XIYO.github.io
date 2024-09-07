# BREW INSTALL MONGODB

`intel`、`macOS 14.0`、`sonoma` 環境で `brew 4.1.14` を使用して `mongoDB` をインストールする手順をまとめます。

## NOTE

- `mongoDB` にはクラウドサービスがあり、`free tier` を提供しています。\
  クラウドサービスを利用する場合、`mongoDB` をインストールする必要はありません。
- この文書では `brew` を通じて `mongoDB` をインストールします。
- [公式ダウンロード](https://www.mongodb.com/try/download/community)で提供されているコマンド `brew install mongodb-atlas` はクラウドユーザー向けのパッケージです。\
  クラウドユーザーでない場合、このパッケージをインストールする必要はありません。
  > 🟣 重要
  >
  > `mongodb-atlas` は `mongodb-atlas-cli` に変更されました。 ([`brew` ドキュメント参照](https://docs.atlas.mongodb.com/command-line-tools/))
- この文書は [`mongoDB` 7.0 Docs](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-os-x/) のガイドに従ってインストールを進めます。

## INSTALL

`mongoDB` は `brew` の **基本リポジトリからはインストールできません。**\
`mongoDB` が提供する **リポジトリを追加する必要があります。**

```shell
brew tap mongodb/brew
```

`brew` リポジトリに `mongoDB` が追加されます。

```shell
brew install mongodb/brew/mongodb-community
```

バージョンを明示せず、`mongoDB` が提供する安定版をインストールします。\
執筆時点では 7.0.2 バージョンがインストールされます。

> 🔵 NOTE
>
> バージョンを明示せずにインストールする場合、\
> パッケージのバージョンを確認するには `brew info` を使用します。
>
> ```shell
> brew info mongodb/brew/mongodb-community
> ```
>
> パッケージに関する情報が出力されます。

> 🔵 NOTE
>
> 意図的にバージョンを明示してインストールすることも可能です。
>
> ```shell
> brew install mongodb/brew/mongodb-community@6.0
> ```
>
> バージョン情報を明示して古いバージョンをインストールします。

## RUN

`brew` でインストールした後は、`brew services` を通じて実行できます。

```shell
brew services start mongodb/brew/mongodb-community
```

> `brew` を使用して `mongoDB` サービスを実行します。

```text
brew services info mongodb/brew/mongodb-community
```

> `brew` を使用して `mongoDB` サービスの情報を出力します。

```text
mongodb-community (homebrew.mxcl.mongodb-community)
Running: ✔
Loaded: ✔
Schedulable: ✘
User: xiyo
PID: 21105
```

> Running 状態が `✔` と表示されれば、正常に実行されている状態です。

直接実行するには、以下のコマンドを入力します。

```shell
$(brew --prefix)/opt/mongodb-community/bin/mongod --config $(brew --prefix)/etc/mongod.conf --fork --logpath $(brew --prefix)/var/log/mongodb/mongod.log
```

> `$(brew --prefix)` は `brew` のインストールパスが返されるため、パスになります。\
> `--fork` オプションは `mongod` プロセスをバックグラウンドで実行するようにします。\
> `--logpath` オプションはログファイルの位置を指定します。\
> **バックグラウンドで実行する際は、これらの二つのオプションを同時に使用**する必要があります。

## ⚠️ トラブルシューティング

```markdown
### ERROR: Bootstrap failed: 5: Input/output error

`ssh`を通じて`macOS`に接続し、`brew services`で`mongoDB`を実行するとエラーが発生します。

```text
Warning: running over SSH, using user/* instead of gui/* domain!
Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
Bootstrap failed: 5: Input/output error
Try re-running the command as root for richer errors.
Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
```

エラーの説明：

1. ```text
   Warning: running over SSH, using user/* instead of gui/* domain!
   Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
   ```

   `ssh`セッションでアクセスすると、実行ドメインが`gui`ではなく`user`として実行されるという警告メッセージです。\
   `brew`は個人ユーザーのために作られたパッケージマネージャーです。\
   そのため`gui`で実行されるべきですが、私は`ssh`を利用して実行したため警告が発生します。\
   最後のメッセージは警告メッセージを隠すことができる環境変数、`HOMEBREW_SERVICES_NO_DOMAIN_WARNING`を最後の行で知らせています。

2. ```text
   Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
   ```

   `HOMEBREW_NO_ENV_HINTS`は環境変数で、設定すると`brew`から出る環境に関連するヒントメッセージを隠すことができます。\
   これはコマンド出力を簡潔に保ちたいユーザーにとって便利です。\
   `man brew`を実行すると`brew`のマニュアルを見られ、この環境変数に関する追加情報を得ることができます。

3. ```text
   Bootstrap failed: 5: Input/output error
   Try re-running the command as root for richer errors.
   Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
   ```

   `macOS`の`launchctl`が出力するエラーです。\
   最下部のコマンド`/bin/launchctl`は`brew`の実行環境に応じて`GUI`ドメインと`USER`ドメインを区別します。(`GUI`は物理的ログインで、`USER`は`ssh`のようなリモートセッションです。)\
   これは`macOS`のコマンドである`launchctl`の特徴であり、`ssh`で接続した状態では`brew`が`USER`ドメインで実行されます。

   明示的に`user/501`を`gui/501`に変更して実行すると正常に実行されます。(501はユーザーの`uid`です。)\
   しかしこの場合、`gui`入出力が必要な画面が表示されると`ssh`セッションでは進行できません。\
   例えばファイアウォールが有効な場合、`gui`で許可をする必要があります。\
   結局、`gui`ドメインで実行する必要があるため、`vnc`を利用して`macOS`にリモート接続し、ターミナルで`brew services`で`mongoDB`を実行しました。

> 🔵 NOTE
>
> エラーメッセージの中に
>
> ```text
> Try re-running the command as root for richer errors.
> # 詳細なエラーを確認するために`root`で実行してください
> ```
>
> `root`実行を推奨するメッセージがありますが、`mongoDB`はセキュリティのため`root`での実行が制限されています。\
> `root`で実行した場合、`brew`のディレクトリの所有権が変更されるため、\
> **所有権を変更するか**、
>
> > ```shell
> > sudo chown -R $(whoami) $(brew --prefix)/*
> > ```
> >
> > `brew`のすべてのディレクトリとファイルの所有者が現在のユーザーに変更されます。\
> > または明示的に`$(brew --prefix)/Cellar/mongodb-community`の所有権を変更することもできます。
> >
> > `-R`オプションは`recursive`を意味します。\
> > すべての下位のファイルとディレクトリに対してコマンドを適用するという意味です。
>
> **削除後再インストール**する方法を使用する必要があります。
>
> > ```shell
> > brew uninstall mongodb/brew/mongodb-community
> > ```
> >
> > `brew`を利用して削除コマンドを入力すると、`root`で削除すべきディレクトリを明確に教えてくれます。
```

```markdown
#### `PLIST`

`root`として実行して権限が変更された場合、無闇にエラー解決法だけを見ずに明確に診断しようとするなら、エラー文に見られる `plist` ファイルの内容を直接見ることができます。

> 🔵 NOTE
>
> `plist` は `macOS` で `service` を管理するファイルです。

```shell
cat /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist
```

`macOS` で使用される `service` を管理するファイルを現在のシェルに出力します。

```text
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE plist PUBLIC "-//Apple//DTD plist 1.0//EN" "http://www.apple.com/DTDs/PropertyList-1.0.dtd">
<plist version="1.0">
<dict>
    <key>Label</key>
    <string>homebrew.mxcl.mongodb-community</string>
    <key>ProgramArguments</key>
    <array>
    <string>/usr/local/opt/mongodb-community/bin/mongod</string>
    <string>--config</string>
    <string>/usr/local/etc/mongod.conf</string>
    </array>
    <key>RunAtLoad</key>
    <true/>
    <key>KeepAlive</key>
    <false/>
    <key>WorkingDirectory</key>
    <string>/usr/local</string>
    <key>StandardErrorPath</key>
    <string>/usr/local/var/log/mongodb/output.log</string>
    <key>StandardOutPath</key>
    <string>/usr/local/var/log/mongodb/output.log</string>
    <key>HardResourceLimits</key>
    <dict>
    <key>NumberOfFiles</key>
    <integer>64000</integer>
    </dict>
    <key>SoftResourceLimits</key>
    <dict>
    <key>NumberOfFiles</key>
    <integer>64000</integer>
    </dict>
</dict>
</plist>
```

1. `Label`:

   - サービスの固有の識別子です。この場合、`homebrew.mxcl.mongodb-community`というラベルが与えられています。

2. `ProgramArguments`:

   - 実行するプログラムとその引数を明示します。
   - この場合、`/usr/local/opt/mongodb-community/bin/mongod` プログラムを `--config /usr/local/etc/mongod.conf` オプションと共に実行するように設定されています。

3. `RunAtLoad`:

   - このキーが `true` に設定されていると、システムのロード時にサービスが自動的に開始されます。

4. `KeepAlive`:

   - このキーが `true` に設定されていると、サービスが終了しても `launchd` が自動的に再起動します。ここでは `false` に設定されているため、サービスが終了すると再起動されません。

5. `WorkingDirectory`:

   - サービスが実行される際の作業ディレクトリを指定します。この場合、`/usr/local` に設定されています。

6. `StandardErrorPath` と `StandardOutPath`:

   - 標準エラーと標準出力をリダイレクトするファイルパスを指定します。この場合、両方とも `/usr/local/var/log/mongodb/output.log` に設定されており、すべての出力とエラーメッセージがこのファイルに記録されます。

7. `HardResourceLimits` と `SoftResourceLimits`:
   - サービスに対するリソース制限を設定します。ここでは `NumberOfFiles` というキーでファイルディスクリプタの最大数を `64000` に設定しています。

`ProgramArguments` に明示された通り、同じように実行してみます。

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

`mongod` を直接実行し、`config` ファイルを明示的に指定します。

```text
 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
{"t":{"$date":"2023-10-09T10:09:26.789Z"},"s":"F",  "c":"CONTROL",  "id":20574,   "ctx":"thread1","msg":"Error during global initialization","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Can't initialize rotatable log file :: caused by :: Failed to open /usr/local/var/log/mongodb/mongo.log"}}}
```

出力によると、`mongod` はログファイル `/usr/local/var/log/mongodb/mongo.log` を開けずにエラーを発生させています。\
この種のエラーは主にファイルが存在しないか、またはファイルに対する書き込み権限がないときに発生します。

直接確認してみます。

```shell
ls -al /usr/local/var/log/mongodb/
```

`directory` 下のファイルを確認します。

```text
total 24
drwxr-xr-x   4 xiyo  admin    128 Oct  9 12:47 .
drwxr-xr-x  10 xiyo  admin    320 Oct  9 12:23 ..
-rw-------   1 root  admin  11360 Oct  9 12:47 mongo.log
-rw-r--r--   1 root  admin      0 Oct  9 12:47 output.log
```

出力を見ると、`mongo.log` ファイルの所有権が `root` になっています。\
上で述べた `brew` は `root` で実行してはいけないというルールを破って実行したため、権限の問題が発生しています。

`output.log` ファイルも同様に `plist` で参照されるファイルなので、2つのファイルの所有権を現在のユーザーに変更します。

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
```

すべての `file` に対して所有権を変更します。

そして再度実行コマンドを入力します。

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

`plist` と同じ実行方式で、`mongod` に `config` ファイルを直接指定して実行します。

出力が何もなく正常に動作しているか確認するために `process` を確認します。

```shell
ps aux | grep mongod
```

`mongod` が実行されているか確認します。

```text
ps aux | grep mongod
root             94237   0.3  0.3 36489684  47860   ??  Ss   12:47PM   1:35.65 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
xiyo             12842   0.0  0.0 34121212    524 s000  S+    7:32PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

出力には合計2つの `process` があり、下は私が実行したコマンドです。\
`root` で実行された `process` が実際に稼働中の `mongod` です。

現在 `brew` は `root` で実行してはいけないというルールを破って実行したため、\
あちこちで権限の問題が発生しています。

プロセスを終了します。

```shell
kill 94237
```

kill コマンドを通じてプロセスを終了します。

> 🔵 NOTE
>
> `kill` コマンドは名前とは異なり、`process` を正常に終了させるコマンドです。\
> 強制終了は `kill -9` を使用します。

今度は再度実行してログを見ます。

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
ps aux | grep mongod
```

実行して `process` を確認します。

```text
xiyo             13061   0.0  0.0 34126336    496 s000  R+    7:37PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

出力には `mongod` が実行されていません。\
今度は `mongo.log` を確認してみます。

```shell
tail /usr/local/var/log/mongodb/mongo.log
```

`cat` コマンドはすべての内容を出力するため、\
`tail` コマンドを使用して最後の10行だけ出力します。

```text
{"t":{"$date":"2023-10-09T19:33:33.994+09:00"},"s":"I",  "c":"TENANT_M", "id":7091600, "ctx":"thread1","msg":"Starting TenantMigrationAccessBlockerRegistry"}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":4615611, "ctx":"initandlisten","msg":"MongoDB starting","attr":{"pid":12858,"port":27017,"dbPath":"/usr/local/var/mongodb","architecture":"64-bit","host":"XIYOsMini"}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":23403,   "ctx":"initandlisten","msg":"Build Info","attr":{"buildInfo":{"version":"7.0.2","gitVersion":"02b3c655e1302209ef046da6ba3ef6749dd0b62a","modules":[],"allocator":"system","environment":{"distarch":"x86_64","target_arch":"x86_64"}}}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":51765,   "ctx":"initandlisten","msg":"Operating System","attr":{"os":{"name":"Mac OS X","version":"23.0.0"}}}
{"t":{"$date":"2023-10-09T19:33:33.995+09:00"},"s":"I",  "c":"CONTROL",  "id":21951,   "ctx":"initandlisten","msg":"Options set by command line","attr":{"options":{"config":"/usr/local/etc/mongod.conf","net":{"bindIp":"127.0.0.1, ::1","ipv6":true},"storage":{"dbPath":"/usr/local/var/mongodb"},"systemLog":{"destination":"file","logAppend":true,"path":"/usr/local/var/log/mongodb/mongo.log"}}}}
{"t":{"$date":"2023-10-09T19:33:34.001+09:00"},"s":"I",  "c":"NETWORK",  "id":5693100, "ctx":"initandlisten","msg":"Asio socket.set_option failed with std::system_error","attr":{"note":"acceptor TCP fast open","option":{"level":6,"name":261,"data":"00 04 00 00"},"error":{"what":"set_option: Invalid argument","message":"Invalid argument","category":"asio.system","value":22}}}
{"t":{"$date":"2023-10-09T19:33:34.002+09:00"},"s":"I",  "c":"NETWORK",  "id":5693100, "ctx":"initandlisten","msg":"Asio socket.set_option failed with std::system_error","attr":{"note":"acceptor TCP fast open","option":{"level":6,"name":261,"data":"00 04 00 00"},"error":{"what":"set_option: Invalid argument","message":"Invalid argument","category":"asio.system","value":22}}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"STORAGE",  "id":28661,   "ctx":"initandlisten","msg":"Unable to read the storage engine metadata file","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Failed to read metadata from /usr/local/var/mongodb/storage.bson"}}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"ASSERT",   "id":23091,   "ctx":"initandlisten","msg":"Fatal assertion","attr":{"msgid":28661,"file":"src/mongo/db/storage/storage_engine_metadata.cpp","line":93}}
{"t":{"$date":"2023-10-09T19:33:34.004+09:00"},"s":"F",  "c":"ASSERT",   "id":23092,   "ctx":"initandlisten","msg":"\n\n***aborting after fassert() failure\n\n"}
```

出力を下から読むと、下から三行目に `Unable to read the storage engine metadata file` エラーメッセージがあります。

実際のファイルの所有権を確認して変更します。

```shell
ls -al /usr/local/var/mongodb/
```

所有権を確認します。

> 🔵 NOTE
>
> `var` は `variable` の略で、使用中に生成または変更されるファイルを保存する `directory` です。

```text
total 560
drwxr-xr-x  20 xiyo  admin    640 Oct  9 19:33 .
drwxrwxr-x  10 xiyo  admin    320 Oct  9 12:23 ..
-rw-------   1 root  admin     50 Oct  9 12:47 WiredTiger
-rw-------   1 root  admin     21 Oct  9 12:47 WiredTiger.lock
-rw-------   1 root  admin   1471 Oct  9 19:33 WiredTiger.turtle
-rw-------   1 root  admin  69632 Oct  9 19:33 WiredTiger.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 WiredTigerHS.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 _mdb_catalog.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 collection-0-7618419118836831796.wt
-rw-------   1 root  admin  20480 Oct  9 19:33 collection-2-7618419118836831796.wt
-rw-------   1 root  admin   4096 Oct  9 19:33 collection-4-7618419118836831796.wt
drwx------   3 root  admin     96 Oct  9 19:33 diagnostic.data
-rw-------   1 root  admin      0 Oct  9 19:33 mongod.lock
-rw-------   1 root  admin  20480 Oct  9 19:33 sizeStorer.wt
-rw-------   1 root  admin    114 Oct  9 12:47 storage.bson
```

所有権が `root` になっています。

`root` になっている所有権を現在のユーザーに変更し、再度 `mongod` を実行します。

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

所有権を変更し、`process` をすぐに実行しました。

これ以上シェルと対話できなくなり、正常なプロセスの起動が完了しました。

今、`brew` の **`root` で実行しないこと** の原則を破った代償として生じた権限の問題をすべて修正したので、実際に `macOS` に `VNC` や物理的アクセスで `brew services` で `mongoDB` を実行できます。

楽しく `mongoDB` を使用してください。
```

