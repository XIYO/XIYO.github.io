# SSHサーバーのインストール

Windowsで*SSH*サーバーをインストールする方法を見ていきます。

*SSH*クライアントはWindows 10以降にインストールされています。

## 前提条件

- Windows Server 2019またはWindows 10 (build 1809)以上
- PowerShell 5.1以上
- 管理者アカウント

## インストール

0. PowerShellを管理者権限で実行
1. *SSH*サーバーのインストール

   *コマンド* :

   ```powershell
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   ```

   *出力* :

   ```powershell
   Path          :
   Online        : True
   RestartNeeded : False
   ```

   成功裏にインストールされると、*Online*が*True*として表示されます。

## 実行

*SSH*サーバーを実行

- 実行

  単独で実行する方法です。

  *コマンド* :

  ```powershell
  Start-Service sshd
  ```

  *出力* なし

- サービスの自動実行

  Windows起動時に自動で実行されるように設定します。

  *コマンド* :

  ```powershell
  Set-Service -Name sshd -StartupType 'Automatic'
  ```

  *出力* なし

- ファイアウォールの許可

  ファイアウォールで*SSH*サーバーが使用する22番ポートへのアクセスを許可します。

  *コマンド* :

  ```powershell
  if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
      Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
      New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
  } else {
      Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
  }
  ```

## チェック

- *SSH*サーバーの状態確認

  実際にサービスが実行されているか確認します。

  *コマンド* :

  ```powershell
  Get-Service -Name 'sshd'
  ```

  *出力* :

  ```text
  Status   Name               DisplayName
  ------   ----               -----------
  Running  sshd               OpenSSH SSH Server
  ```

  *Status*が*Running*であれば正常に実行されています。 \
  *Status*が*Stopped*であれば、*Start-Service sshd*コマンドを実行後、再度確認します。

- 接続確認

  - 自分のアカウント確認

    Windowsインストール初期にMicrosoftアカウントで作成した場合、メールのIDがアカウント名です。 \
    5文字を超えるIDについては変更されるため、正確に確認します。

    *コマンド* :

    ```powershell
    Write-Output $env:UserName
    ```

    *出力* :

    ```text
    xiyo
    ```

    実際のシステムアカウント名が出力されます。

  - ローカル*SSH*接続

    *コマンド* :

    ```powershell
    ssh xiyo@localhost
    ```

    xiyoを自分のアカウントに変更します。

    *出力* :

    ```text
    The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
    ECDSA key fingerprint is SHA256:D/StxC2FjSpxjD9X+QcXyhHJHb0tfC+Hn9iFMbZooTM.
    Are you sure you want to continue connecting (yes/no/[fingerprint])?
    ```

    初回接続時に接続情報を保存します。 \
    *yes*と入力してエンターを押します。

    続いてパスワードを尋ねられます。

    *出力* :

    ```text
    xiyo@127.0.0.1's password:
    ```

    パスワード入力時には画面に何も表示されません。 \
    パスワードを入力してエンターを押します。

    成功裏に接続されると新しいコマンドプロンプトが表示されます。

  - 外部*SSH*接続

    外部接続はホストのIPアドレスを変更して実行すればよいです。

    *コマンド* :

    ```powershell
    ssh xiyo@192.168.0.10
    ```

    ローカル接続とシナリオは同じです。

## トラブルシューティング

### 外部から接続できない場合

ローカルで接続に成功したが、外部から接続できない場合、いくつかの状況があります。

#### ファイアウォールのブロック

ネットワークのどこかでファイアウォールが*SSH*接続をブロックしています。

*出力* :

```text
ssh: connect to host 192.168.1.10 port 22: Connection refused
```

22番ポートが外部からのアクセスをブロックされています。

すべてのファイアウォールを無効にし、サーバーからルーターまで順に有効にしながらテストします。

#### ホストに接続できない

*192.168.1.10*を入力する際に、誤って*0*を一つ追加した状況です。

*出力* :

```text
ssh: connect to host 192.168.1.100 port 22: Network is unreachable
```

ネットワークで見つからないIPアドレスです。

IPアドレスを確認して再試行します。

#### ホスト接続タイムアウト

*192.168.1.10*ではなく*192.168.**2**.10*の別のネットワーク帯域に接続する状況です。

*出力* :

```text
ssh: connect to host 192.168.2.10 port 22: Operation timed out
```

ネットワーク帯域が異なるため、応答がありません。

IPアドレスを確認して再試行します。
