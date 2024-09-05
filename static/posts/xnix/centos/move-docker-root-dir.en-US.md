# Moving the Docker Root Directory

I was using GitLab on an in-house cloud server. \
However, a build that had been working fine until just before suddenly failed when I tried to rebuild it.

Upon investigation, I found that the cause was insufficient local disk space...

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

I can see that the capacity of `/dev/sda7` is insufficient.

> The documentation mentioned that it was a 2TB RAID when I took over... \
> Am I misunderstanding the concept of RAID?

## Changing Docker Settings

To move the root directory, you need to change the Docker settings.

If you installed from the official Docker repository, create and modify the `/etc/docker/daemon.json` file.

```text
# /etc/docker/daemon.json
{
  "data-root": "/dat/docker"
}
```

> I **created** this file.

After that, restarting Docker will change the root directory.

```shell
sudo systemctl restart docker
```

## If There Are Existing Docker Volumes

If you have existing volumes, you need to move those volumes to the new directory.

To replicate all the information, use the `rsync` command.

```shell
rsync -av /var/lib/docker /dat/docker
```

## If the Volume Size Is Large

In my case, the volume was about 45GB, and since I was working at night, I proceeded with the replication in the background. \
I also planned to check the logs, so I used a terminal multiplexer to work in the background.

```shell
tmux
```

```shell
rsync -av /var/lib/docker /dat/docker
```

Press `Ctrl + b` and then `d` to continue working in the background.

```shell
# If you haven't closed the terminal, open the last session
tmux attach-session

# If you closed the terminal and want to check again
tmux ls # Check the session list
tmux attach -t 0 # Connect using the session number
```

## TODO

- [ ] Regularly back up Docker volumes

