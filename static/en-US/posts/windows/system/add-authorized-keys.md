# How to Register SSH Public Keys - Windows

Let's take a look at how to register a public key after installing SSH on Windows.

## Scenario

Even after creating the `.ssh\authorized_keys` file and registering the public key, a problem arose where a password was requested when accessing with the registered key. The cause of this issue was a special setting for admin group users in Windows OpenSSH.

In the content of the `$env:PROGRAMDATA\ssh\sshd_config` file:

```text
Match Group administrators
       AuthorizedKeysFile __PROGRAMDATA__/ssh/administrators_authorized_keys
```

Users in the admin group are configured to reference the `administrators_authorized_keys` file.

## Solution

You can resolve the issue by creating a dedicated `administrators_authorized_keys` file for admin group users and registering the public key.

**Creating the File**

If you only need a file with the correct permissions, run the following command with **PowerShell as an administrator**.

```powershell
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $null;
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

- `Add-Content`: This PowerShell cmdlet creates a new file and adds content if the file does not exist at the specified path.

  - `-Force`: Ignores any errors that may occur during the operation and forces the command to execute, creating a new file if it does not exist.

- `icacls.exe`: A Windows command-line utility that modifies the access control list (ACL) of files or directories.
  - `/inheritance:r`: Removes inheritance from the file or folder, retaining only explicitly set permissions.
  - `/grant "Administrators:F"`: Grants "Full control" permission to the "Administrators" group.
  - `/grant "SYSTEM:F"`: Grants "Full control" permission to the "SYSTEM" account.

**Registering the Key**

To create the authorization file and immediately register the public key, run the following command with **PowerShell as an administrator**.

```powershell
$authorizedKey = Get-Content -Path $env:USERPROFILE\.ssh\id_ed25519.pub
Add-Content -Force -Path $env:ProgramData\ssh\administrators_authorized_keys -Value $authorizedKey
icacls.exe $env:ProgramData\ssh\administrators_authorized_keys /inheritance:r /grant "Administrators:F" /grant "SYSTEM:F"
```

## Troubleshooting

1. The `ssh-copy-id` command from Linux systems is not supported for registering public keys on Windows systems. Therefore, you must register them manually.

2. If you need to paste the contents of the clipboard into the `administrators_authorized_keys` file, install Visual Studio Code and run the following command with **PowerShell as an administrator**.

   ```powershell
   code $env:ProgramData\ssh\administrators_authorized_keys
   ```

## References

[Microsoft Documentation](https://learn.microsoft.com/en-us/windows-server/administration/openssh/openssh_keymanagement)

