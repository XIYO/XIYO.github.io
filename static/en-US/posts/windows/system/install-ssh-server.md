# INSTALL SSH SERVER

Let's explore how to install an *SSH* server on Windows.

The *SSH* client has been included since Windows 10.

## PREREQUISITES

- Windows Server 2019 or Windows 10 (build 1809) or later
- PowerShell 5.1 or later
- Administrator account

## INSTALL

0. Run PowerShell with administrative privileges.
1. Install the *SSH* server.

   *Command*:

   ```powershell
   Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
   ```

   *Output*:

   ```powershell
   Path          :
   Online        : True
   RestartNeeded : False
   ```

   If the installation is successful, *Online* will show as *True*.

## RUN

Start the *SSH* server.

- Run it manually.

  *Command*:

  ```powershell
  Start-Service sshd
  ```

  *No output*

- Set the service to start automatically.

  Configure it to run automatically at Windows startup.

  *Command*:

  ```powershell
  Set-Service -Name sshd -StartupType 'Automatic'
  ```

  *No output*

- Allow through the firewall.

  Allow access to port 22, which the *SSH* server uses, through the firewall.

  *Command*:

  ```powershell
  if (!(Get-NetFirewallRule -Name "OpenSSH-Server-In-TCP" -ErrorAction SilentlyContinue | Select-Object Name, Enabled)) {
      Write-Output "Firewall Rule 'OpenSSH-Server-In-TCP' does not exist, creating it..."
      New-NetFirewallRule -Name 'OpenSSH-Server-In-TCP' -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22
  } else {
      Write-Output "Firewall rule 'OpenSSH-Server-In-TCP' has been created and exists."
  }
  ```

## CHECK

- Check the status of the *SSH* server.

  Verify if the service is running.

  *Command*:

  ```powershell
  Get-Service -Name 'sshd'
  ```

  *Output*:

  ```text
  Status   Name               DisplayName
  ------   ----               -----------
  Running  sshd               OpenSSH SSH Server
  ```

  If *Status* is *Running*, it is functioning correctly. \
  If *Status* is *Stopped*, run the *Start-Service sshd* command and check again.

- Verify connection.

  - Check your account.

    If you created your Windows account using a Microsoft account during installation, your email ID is your account name. \
    For IDs longer than 5 characters, it may have been changed, so verify it accurately.

    *Command*:

    ```powershell
    Write-Output $env:UserName
    ```

    *Output*:

    ```text
    xiyo
    ```

    The actual system account name will be displayed.

  - Local *SSH* connection.

    *Command*:

    ```powershell
    ssh xiyo@localhost
    ```

    Replace *xiyo* with your own account name.

    *Output*:

    ```text
    The authenticity of host '127.0.0.1 (127.0.0.1)' can't be established.
    ECDSA key fingerprint is SHA256:D/StxC2FjSpxjD9X+QcXyhHJHb0tfC+Hn9iFMbZooTM.
    Are you sure you want to continue connecting (yes/no/[fingerprint])?
    ```

    On the first connection, it will save the connection information. \
    Type *yes* and press Enter.

    It will then prompt for your password.

    *Output*:

    ```text
    xiyo@127.0.0.1's password:
    ```

    When entering the password, nothing will appear on the screen. \
    Type your password and press Enter.

    If the connection is successful, a new command prompt will appear.

  - External *SSH* connection.

    For external connections, simply change the host's IP address and run the command.

    *Command*:

    ```powershell
    ssh xiyo@192.168.0.10
    ```

    The scenario is the same as for local connections.

## TROUBLESHOOTING

### Unable to connect from external sources

If you successfully connected locally but cannot connect externally, there could be several issues.

#### Firewall blocking

Somewhere in the network, a firewall is blocking *SSH* connections.

*Output*:

```text
ssh: connect to host 192.168.1.10 port 22: Connection refused
```

Port 22 is blocked from external access.

Disable all firewalls and gradually enable them from the server to the router while testing.

#### Unable to connect to the host

You may have mistakenly entered an extra *0* while typing *192.168.1.10*.

*Output*:

```text
ssh: connect to host 192.168.1.100 port 22: Network is unreachable
```

This is an IP address that cannot be found on the network.

Check the IP address and try again.

#### Connection timed out

You might be trying to connect to a different network range, such as *192.168.**2**.10* instead of *192.168.1.10*.

*Output*:

```text
ssh: connect to host 192.168.2.10 port 22: Operation timed out
```

The network ranges are different, so there is no response.

Check the IP address and try again.

