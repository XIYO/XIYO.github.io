# BREW INSTALL MONGODB

This document outlines the process of installing `MongoDB` using `brew 4.1.14` in an `intel`, `macOS 14.0`, `Sonoma` environment.

## NOTE

- `MongoDB` offers a cloud service with a `free tier`.\
  If you use the cloud service, there is no need to install `MongoDB` locally.
- This document will guide you through the installation of `MongoDB` via `brew`.
- The command provided in the [official download](https://www.mongodb.com/try/download/community) page, `brew install mongodb-atlas`, is intended for cloud users.\
  If you are not a cloud user, there is no need to install this package.
  > 🟣 IMPORTANT
  >
  > `mongodb-atlas` has been renamed to `mongodb-atlas-cli`. ([Refer to the `brew` documentation](https://docs.atlas.mongodb.com/command-line-tools/))
- This document follows the installation guide from the [`MongoDB` 7.0 Docs](https://www.mongodb.com/docs/v6.0/tutorial/install-mongodb-on-os-x/).

## INSTALL

`MongoDB` cannot be installed from the **default repository of `brew`.**\
You need to **add the repository provided by `MongoDB`.**

```shell
brew tap mongodb/brew
```

This adds `MongoDB` to the `brew` repository.

```shell
brew install mongodb/brew/mongodb-community
```

This installs `MongoDB` using the stable version provided by `MongoDB` without specifying a version.\
As of the date of writing, version 7.0.2 will be installed.

> 🔵 NOTE
>
> When installing without specifying a version,\
> you can use `brew info` to check the package version.
>
> ```shell
> brew info mongodb/brew/mongodb-community
> ```
>
> Information about the package will be displayed.

> 🔵 NOTE
>
> You can intentionally specify a version to install.
>
> ```shell
> brew install mongodb/brew/mongodb-community@6.0
> ```
>
> This installs an older version by specifying the version information.

## RUN

After installation via `brew`, you can run it using `brew services`.

```shell
brew services start mongodb/brew/mongodb-community
```

> This command starts the `MongoDB` service using `brew`.

```text
brew services info mongodb/brew/mongodb-community
```

> This command outputs information about the `MongoDB` service using `brew`.

```text
mongodb-community (homebrew.mxcl.mongodb-community)
Running: ✔
Loaded: ✔
Schedulable: ✘
User: xiyo
PID: 21105
```

> If the running status is displayed as `✔`, it indicates that the service is running normally.

To run it manually, enter the following command:

```shell
$(brew --prefix)/opt/mongodb-community/bin/mongod --config $(brew --prefix)/etc/mongod.conf --fork --logpath $(brew --prefix)/var/log/mongodb/mongod.log
```

> `$(brew --prefix)` returns the installation path of `brew`.\
> The `--fork` option runs the `mongod` process in the background.\
> The `--logpath` option specifies the location of the log file.\
> **Both options must be used together when running in the background.**

## ⚠️ TROUBLESHOOTING

### ERROR: Bootstrap failed: 5: Input/output error

When trying to run `mongoDB` using `brew services` after connecting to `macOS` via `ssh`, an error occurs.

```text
Warning: running over SSH, using user/* instead of gui/* domain!
Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
Bootstrap failed: 5: Input/output error
Try re-running the command as root for richer errors.
Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
```

Error Explanation:

1. ```text
   Warning: running over SSH, using user/* instead of gui/* domain!
   Hide this warning by setting HOMEBREW_SERVICES_NO_DOMAIN_WARNING.
   ```

   This warning message indicates that when accessing via an `ssh` session, the execution domain is running as `user` instead of `gui`.\
   `brew` is a package manager designed for personal users.\
   Therefore, it should ideally run in the `gui` domain without issues, but since I executed it using `ssh`, this warning appears.\
   The last message informs you of the environment variable, `HOMEBREW_SERVICES_NO_DOMAIN_WARNING`, which can be set to hide this warning.

2. ```text
   Hide these hints with HOMEBREW_NO_ENV_HINTS (see `man brew`).
   ```

   `HOMEBREW_NO_ENV_HINTS` is an environment variable that, when set, can hide environment-related hint messages from `brew`.\
   This is useful for users who want to keep command output concise.\
   Running `man brew` will display the `manual` for `brew`, where you can find additional information about this environment variable.

3. ```text
   Bootstrap failed: 5: Input/output error
   Try re-running the command as root for richer errors.
   Error: Failure while executing; `/bin/launchctl bootstrap user/501 /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist` exited with 5.
   ```

   This is an error output from `launchctl` in `macOS`.\
   The command at the bottom, `/bin/launchctl`, distinguishes between the `GUI` domain and the `USER` domain based on the execution environment of `brew`. (`GUI` refers to physical logins, while `USER` refers to remote sessions like `ssh`.)\
   This is a characteristic of the `launchctl` command in `macOS`, and when connected via `ssh`, `brew` runs in the `USER` domain.

   If you explicitly change `user/501` to `gui/501` and execute it, it will run normally (501 is the user's `uid`).\
   However, if a screen requiring `gui` input/output appears, it cannot proceed in an `ssh` session.\
   For example, if the firewall is active, it needs to be allowed from the `gui`.\
   Ultimately, since it must run in the `gui` domain, I accessed `macOS` remotely using `vnc` and then executed `brew services` to run `mongoDB` in the terminal.

> 🔵 NOTE
>
> In the error message, there is a recommendation:
>
> ```text
> Try re-running the command as root for richer errors.
> # Run as `root` to see detailed errors
> ```
>
> However, `mongoDB` is blocked from running as `root` for security reasons.\
> If executed as `root`, the ownership of the `brew` directory will change, so you must either:
>
> > ```shell
> > sudo chown -R $(whoami) $(brew --prefix)/*
> > ```
> >
> > This command changes the ownership of all `directories` and `files` in `brew` to the current user.\
> > Alternatively, you can explicitly change the ownership of `$(brew --prefix)/Cellar/mongodb-community`.
> >
> > The `-R` option means `recursive`, which applies the command to all sub-files and directories.
>
> You should use the method of **uninstalling and reinstalling**.
>
> > ```shell
> > brew uninstall mongodb/brew/mongodb-community
> > ```
> >
> > When you enter the uninstall command using `brew`, it will clearly indicate which `directories` need to be deleted as `root`.

#### `PLIST`

To diagnose permission issues that arise when running as `root`, instead of just looking for error resolutions, you can directly check the contents of the `plist` file mentioned in the error message.

> 🔵 NOTE
>
> A `plist` is a file used to manage services in `macOS`.

```shell
cat /Users/xiyo/Library/LaunchAgents/homebrew.mxcl.mongodb-community.plist
```

This command outputs the service management file used in `macOS` to the current shell.

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

   - This is a unique identifier for the service. In this case, it is labeled as `homebrew.mxcl.mongodb-community`.

2. `ProgramArguments`:

   - This specifies the program to be executed along with its arguments.
   - Here, it is set to run the `/usr/local/opt/mongodb-community/bin/mongod` program with the `--config /usr/local/etc/mongod.conf` option.

3. `RunAtLoad`:

   - If this key is set to `true`, the service will automatically start when the system loads.

4. `KeepAlive`:

   - If this key is set to `true`, `launchd` will automatically restart the service if it stops. In this case, it is set to `false`, so the service will not restart if it stops.

5. `WorkingDirectory`:

   - This specifies the working directory when the service is executed. It is set to `/usr/local` in this case.

6. `StandardErrorPath` and `StandardOutPath`:

   - These specify the file paths for redirecting standard error and standard output. Both are set to `/usr/local/var/log/mongodb/output.log`, meaning all output and error messages will be logged to this file.

7. `HardResourceLimits` and `SoftResourceLimits`:
   - These set resource limits for the service. Here, the maximum number of file descriptors is set to `64000` with the key `NumberOfFiles`.

As specified in `ProgramArguments`, let's execute it directly.

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

This command runs `mongod` while explicitly specifying the `config` file.

```text
 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
{"t":{"$date":"2023-10-09T10:09:26.789Z"},"s":"F",  "c":"CONTROL",  "id":20574,   "ctx":"thread1","msg":"Error during global initialization","attr":{"error":{"code":38,"codeName":"FileNotOpen","errmsg":"Can't initialize rotatable log file :: caused by :: Failed to open /usr/local/var/log/mongodb/mongo.log"}}}
```

According to the output, `mongod` is failing to open the log file `/usr/local/var/log/mongodb/mongo.log`.\
This type of error typically occurs when the file is missing or when there are insufficient write permissions for the file.

Let's check directly.

```shell
ls -al /usr/local/var/log/mongodb/
```

This command checks the files under the `directory`.

```text
total 24
drwxr-xr-x   4 xiyo  admin    128 Oct  9 12:47 .
drwxr-xr-x  10 xiyo  admin    320 Oct  9 12:23 ..
-rw-------   1 root  admin  11360 Oct  9 12:47 mongo.log
-rw-r--r--   1 root  admin      0 Oct  9 12:47 output.log
```

The output shows that the ownership of the `mongo.log` file is set to `root`.\
Running `brew` as `root` violates the rule that it should not be run as such, leading to permission issues.

Since the `output.log` file is also referenced in the `plist`, let's change the ownership of both files to the current user.

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
```

This command changes the ownership of all `files`.

Now, let's run the command again.

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

This command executes `mongod` in the same way as the `plist`, directly specifying the `config` file.

To check if it is running correctly, let's verify the `process`.

```shell
ps aux | grep mongod
```

This command checks if `mongod` is running.

```text
ps aux | grep mongod
root             94237   0.3  0.3 36489684  47860   ??  Ss   12:47PM   1:35.65 /usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
xiyo             12842   0.0  0.0 34121212    524 s000  S+    7:32PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

The output shows a total of 2 `processes`, with the one executed as `root` being the actual running `mongod`.

Since `brew` was run as `root`, it has caused permission issues throughout.

Let's terminate the process.

```shell
kill 94237
```

This command terminates the process using the `kill` command.

> 🔵 NOTE
>
> Contrary to its name, the `kill` command is used to terminate a process normally.\
> To forcefully terminate a process, use `kill -9`.

Now, let's run it again and check the logs.

```shell
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
ps aux | grep mongod
```

This command runs `mongod` and checks the `process`.

```text
xiyo             13061   0.0  0.0 34126336    496 s000  R+    7:37PM   0:00.00 grep --color=auto --exclude-dir=.bzr --exclude-dir=CVS --exclude-dir=.git --exclude-dir=.hg --exclude-dir=.svn --exclude-dir=.idea --exclude-dir=.tox mongod
```

The output shows that `mongod` is not running.\
Now, let's check the `mongo.log`.

```shell
tail /usr/local/var/log/mongodb/mongo.log
```

The `cat` command outputs everything, so we will use the `tail` command to display only the last 10 lines.

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

Reading the output from the bottom, the third-to-last line shows the error message `Unable to read the storage engine metadata file`.

Let's check the ownership of the actual file and change it if necessary.

```shell
ls -al /usr/local/var/mongodb/
```

This command checks the ownership.

> 🔵 NOTE
>
> `var` is short for `variable`, and it is a directory that stores files that are created or modified during use.

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

The ownership is set to `root`.

Let's change the ownership from `root` to the current user and run `mongod` again.

```shell
sudo chown -R $(whoami) /usr/local/var/log/mongodb/
/usr/local/opt/mongodb-community/bin/mongod --config /usr/local/etc/mongod.conf
```

This command changes the ownership and immediately runs the `process`.

The shell becomes unresponsive, indicating that the process has started successfully.

Now that we have resolved the permission issues caused by violating the principle of **not running `brew` as `root`**, you can run `mongoDB` using `brew services` with either `VNC` or physical access to `macOS`.

Enjoy using `mongoDB`!

