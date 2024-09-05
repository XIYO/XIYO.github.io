# CUSTOM DDNS

This document outlines how to connect a custom domain using the Asuswrt-Merlin firmware.

During the use of Google Domains, it was sold to Squarespace. After transferring the domain from Google Domains to Cloudflare, the process of setting up custom DDNS is documented here.

## REQUIREMENTS

To set up custom DDNS, the following items must be prepared:

- **Firmware Version**: \
  Since we will be using the inadyn package to set up custom DDNS, a version of 384.7 or higher is required.
- **JFFS**: \
  JFFS must be enabled for the custom DDNS setup.
- **SSH**: \
  You need permission to access the router.

> This document does not provide explanations for the requirements.

## CHANGE DDNS

We will change the existing DDNS settings.

In the [DDNS settings](https://router.xiyo.dev/Advanced_ASUSDDNS_Content.asp), change the Server to Custom.

![Change DDNS Options](img_4.png)

In the DDNS settings under the WAN category, change the Server option to Custom.

## ISSUE API TOKEN

Obtain a token from Cloudflare's [API Tokens page](https://dash.cloudflare.com/profile/api-tokens) with the following permissions:

- zone.zone read
- zone.dns edit

After issuance, the result will be:

![Token Issuance Result](img_3.png)

## SETUP INADYN

### MAKE CONFIG

Create the `/jffs/inadyn.conf` file.

In this scenario, we will use two providers because we are using a wildcard domain.

```shell
# Domain
# If using a single provider, remove `:1`.
# provider cloudflare.com
provider cloudflare.com:1 {
    username = "xiyo.dev"
    password = API_TOKEN  # Enter the issued token, enclosed in double quotes.
    hostname = "xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}

# Wildcard Domain
provider cloudflare.com:2 {
    username = "xiyo.dev"
    password = API_TOKEN # Enter the issued token, enclosed in double quotes.
    hostname = "*.xiyo.dev"
    ttl = 1 # optional, value of 1 is 'automatic'.
    proxied = false # optional.
}
```

### CHECK CONFIG

Check the syntax of the configuration.

```shell
inadyn --check-config --config="/jffs/inadyn.conf"
```

> If an error occurs, please check the syntax again.

### RUN INADYN

Run inadyn to register the IP with the domain.

```shell
inadyn --once --config="/jffs/inadyn.conf"
```

> The `--once` option is used to turn off daemon mode. The reason will be explained in the automation section.

## AUTOMATION

Set it up so that the IP connected to the domain changes whenever the IP changes.

If the `/jffs/scripts/ddns-start` file does not exist, create it and grant execution permissions.

```shell
touch /jffs/scripts/ddns-start
chmod +x /jffs/scripts/ddns-start
```

Enter the following content into the `/jffs/scripts/ddns-start` file.

```shell
#!/bin/sh

inadyn --once --config="/jffs/inadyn.conf" exec="ddns_custom_updated 1"
```

> `ddns_custom_updated 1` is the command that indicates the completion of the start-ddns execution.

## CHECK

Verify whether the domain is connected to the actual IP.

Run:

```shell
nslookup xiyo.dev
```

Result:

```text
Server:  XIYOsRouter
Address:  192.168.1.1

Non-authoritative answer:
Name:    xiyo.dev
Address:  124.5.184.78
```

If the IP shown on the router matches, it has been set up correctly.

## AFTER

Now, even if the router reboots or the IP changes, the domain will always point to the router.

In the next section, we will outline how to install a certificate on the router.

## REFERENCE

[Asuswrt-Merlin Custom DDNS Wiki](https://github.com/RMerl/asuswrt-merlin.ng/wiki/DDNS-services)

[Example of inadyn Configuration](https://github.com/troglobit/inadyn#example)

