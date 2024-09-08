# Dockerのルートディレクトリの移動

社内クラウドサーバーにGitLabを立てて使用していました。\
しかし、直前まで正常に動作していたビルドが再ビルドすると失敗していました。

調査したところ、原因はローカルディスクの空き容量不足でした...

```text
# df -h
Filesystem      Size  Used Avail Use% Mounted on
devtmpfs        7.8G     0  7.8G   0% /dev
tmpfs           7.8G     0  7.8G   0% /dev/shm
tmpfs           7.8G  817M  7.0G  11% /run
tmpfs           7.8G     0  7.8G   0% /sys/fs/cgroup
/dev/sda7        98G   97G  1.8G  100% /
/dev/sda1       494M  136M  358M  28% /boot
/dev/sda2       400G   51G  350G  13% /dat
/dev/sda3       300G  136G  165G  46% /log
/dev/sda5       100G  2.9G   98G   3% /sw
tmpfs           1.6G     0  1.6G   0% /run/user/1000
tmpfs           1.6G     0  1.6G   0% /run/user/0
```

`/dev/sda7`の容量が不足していることが確認できます。

> 引き受ける際には2TBのRAIDと文書に書かれていたのに...\
> 私がRAIDの概念を誤解しているのだろうか...

## Dockerの設定変更

ルートディレクトリを移動するためには、Dockerの設定を変更する必要があります。

公式Dockerリポジトリからインストールした場合、`/etc/docker/daemon.json`ファイルを作成および修正します。

```text
# /etc/docker/daemon.json
{
  "data-root": "/dat/docker"
}
```

> 私は**作成**しました。

その後、Dockerを再起動するとルートディレクトリが変更されます。

```shell
sudo systemctl restart docker
```

## Dockerボリュームがある場合

既存のボリュームがある場合は、そのボリュームを移動先のディレクトリに移動する必要があります。

すべての情報を複製するために`rsync`コマンドを使用します。

```shell
rsync -av /var/lib/docker /dat/docker
```

## ボリュームの容量が大きい場合

私の場合、ボリュームが約45GBあり、夜間に作業を行ったため、バックグラウンドで複製を進めました。\
また、ログも確認する予定だったため、ターミナルマルチプレクサを使用してバックグラウンドで作業を進めました。

```shell
tmux
```

```shell
rsync -av /var/lib/docker /dat/docker
```

`Ctrl + b`を押した後、`d`を押すとバックグラウンドで作業が進行します。

```shell
# ターミナルを閉じていなければ最後のセッションを開く
tmux attach-session

# ターミナルを閉じた後に再確認する場合
tmux ls # セッションリストを確認
tmux attach -t 0 # セッション番号で接続
```

## TODO

- [ ] Dockerボリュームを定期的にバックアップする

