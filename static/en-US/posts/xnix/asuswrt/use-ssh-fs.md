# USE SSH FS

![SSH FS connection screen in VS Code](/resources/2023-10-22-11-55-54.png)

In this guide, we will explore how to conveniently manage files using *SSH FS* in *VS Code*.

When you frequently connect to a *router* for work, the number of files you need to manage tends to increase. \
To facilitate easier management, we have added functionality to use *VS Code* for file management.

Initially, I considered installing *Vim* and using plugins for my tasks, but I didn't have time to troubleshoot the errors that arose during the installation of *Vim*, and I was also concerned about managing the plugins effectively.

I then attempted to install the server version of *VS Code* on the router, but unfortunately, it was not supported in that environment, so I abandoned that idea.

After much contemplation, I thought about whether it would be possible to mount network files and work on them locally with *VS Code*. This led me to discover the solution known as *SSH FS*. \
There is also an extension called *REMOTE FS*, but its documentation is quite lacking, and the last update was on May 5, 2019, so I decided to exclude it.

## WHAT IS *SSH FS*

*SSH FS* is an extension for *VS Code* that internally uses *SSHFS*.

*SSHFS* stands for *Secure Shell File System*, and it is a tool for mounting a *file system* over *SSH*. \
It is particularly useful in environments where you cannot install the server version of *VS Code*.

## ENVIRONMENT

- **HARDWARE**: \
  *AC88U*
- **FIRMWARE**: \
  *asuswrt-merlin 386.12*
- **PACKAGE**: \
  *Entware armv7sf-k2.6*

## REQUIREMENTS

- ***SSH* access enabled**
- ***Entware* installed**

## METHOD

1. ***Install openssl-sftp**:

   1. Connect to the router via *SSH*.
   2. Execute the following command:

      ```bash
      opkg install openssl-sftp
      ```

      This installs *openssl-sftp* using *Entware*.

2. ***Install SSH FS**:
   1. Click the *Install* button on the [*SSH FS*] introduction page in the *Marketplace*.

## USAGE

![SSH FS settings screen](/resources/2023-10-22-13-40-10.png)

It requires the same connection information as *SSH*.

0. Click the *SSH FS* button in the *Primary Side Bar*.
1. Click the button to create a new configuration in the *Side Bar* extension area.
2. Enter your *SSH* connection information in the input screen.
3. Click the *SAVE* button at the bottom.
4. In the *Side Bar* extension area, view and click the created connection information. \
   The left side is for the *directory* mount function, while the right side is for the *terminal* connection.

> Synchronizing your *VS Code* settings with *GitHub* can make your experience even more convenient.

[*SSH FS*]: https://marketplace.visualstudio.com/items?itemName=Kelvin.VSCODE-sshfs
