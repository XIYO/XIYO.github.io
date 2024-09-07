# SSH公開鍵の登録方法 - Windows

WindowsでSSHをインストールした後、公開鍵を登録する方法を見ていきましょう。

## シナリオ

`.ssh\authorized_keys`ファイルを作成し、公開鍵を登録したにもかかわらず、登録された鍵でアクセスするとパスワードを要求される問題が発生しました。この問題の原因は、Windows OpenSSHにおける管理者グループユーザーの特別な設定によるものでした。

`$env:PROGRAMDATA\ssh\sshd_config`ファイルの内容の一部：

```text
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

管理者グループのユーザーは`administrators_authorized_keys`ファイルを参照するように設定されています。

## 解決方法

管理者グループユーザー専用の`administrators_authorized_keys`ファイルを作成し、公開鍵を登録することで問題を解決できます。

**ファイルの作成**

正しい権限を持つファイルだけが必要な場合、以下のコマンドを**PowerShell管理者権限**で実行してください。

```powershell
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $null;
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

- `Add-Content`: 指定されたパスにファイルが存在しない場合、新しいファイルを作成し、内容を追加するPowerShell cmdletです。

  - `-Force`: 作業中に発生する可能性のあるエラーを無視し、コマンドを強制的に実行して、ファイルがない場合は新しく作成します。

- `icacls.exe`: ファイルやディレクトリのアクセス制御リスト（ACL）を修正するWindowsコマンドラインユーティリティです。
  - `/inheritance:r`: ファイルやフォルダーの継承を削除し、明示的に設定された権限のみを保持します。
  - `/grant "Administrators:F"`: "Administrators"グループに"フルコントロール"権限を付与します。
  - `/grant "SYSTEM:F"`: "SYSTEM"アカウントに"フルコントロール"権限を付与します。

**鍵の登録**

認証ファイルを作成し、公開鍵を即座に登録するには、以下のコマンドを**PowerShell管理者権限**で実行してください。

```powershell
$authorizedKey = Get-Content -Path $env:USERPROFILE\.ssh\id_ed25519.pub
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $authorizedKey
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

## 問題解決

1. Linuxシステムの`ssh-copy-id`コマンドでWindowsシステムに公開鍵を登録することはサポートされていません。したがって、手動で登録する必要があります。

2. クリップボードの内容を`administrators_authorized_keys`ファイルに貼り付ける必要がある場合、Visual Studio Codeをインストールし、以下のコマンドを**PowerShell管理者権限**で実行してください。

   ```powershell
   code $env:ProgramData\ssh\administrators_authorized_keys
   ```

## 参考

[マイクロソフトのドキュメント](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

