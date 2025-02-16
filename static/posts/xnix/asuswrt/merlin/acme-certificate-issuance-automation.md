# ACME 인증서 발급 자동화 (ASUS AC88U 라우터)

AC88U 라우터에 Nginx를 설치하고 SSL 인증서를 설정해두었지만, 매번 수동으로 인증서를 발급하는 과정에서 정리가 되지 않아 이번 기회에 완전히 정리한 후기를 남깁니다.

> [!NOTE]
> 이 과정은 ASUS Merlin 펌웨어가 설치된 라우터에서만 가능합니다.

## 사용 도메인

저는 여러 개의 하위 도메인을 사용하고 있습니다.

- `blog.xiyo.dev`
- `xiyo.dev`

이처럼 하위 도메인이 많을 경우, 와일드카드(`*.xiyo.dev`)를 사용하여 한 번에 인증서를 발급하는 것이 효율적입니다.

## 사전 지식

와일드카드 도메인은 **HTTP-01 방식이 아닌 DNS-01 방식**으로 인증해야 합니다.
이 방식은 DNS 제공업체가 API를 지원해야만 자동화 가능합니다.

> 저는 **Cloudflare**를 사용하기 때문에 DNS-01 방식으로 인증서 발급을 자동화 할 수 있었습니다.   
> 국내 도메인 서비스는 지원 안하더라고요...

### Cloudflare API를 사용한 DNS 인증

깃허브 [ACME 리포지토리](https://github.com/acmesh-official/acme.sh)의 [`dns_cf`](https://github.com/acmesh-official/acme.sh/blob/master/dnsapi/dns_cf.sh) 스크립트를 보면, DNS-01 방식을 사용할 때 필요한 환경 변수를 확인할 수 있습니다.

```sh
#!/usr/bin/env sh
# shellcheck disable=SC2034
dns_cf_info='CloudFlare
Site: CloudFlare.com
Docs: github.com/acmesh-official/acme.sh/wiki/dnsapi#dns_cf
Options:
 CF_Key API Key
 CF_Email Your account email
OptionsAlt:
 CF_Token API Token
 CF_Account_ID Account ID
 CF_Zone_ID Zone ID. Optional.
'
```

코드를 보면 두 가지 방식 중 하나를 선택할 수 있습니다.

1. **Global API Key 방식** (`CF_Key` + `CF_Email` 사용)
2. **API Token 방식** (`CF_Token` + `CF_Account_ID` 사용)

- **Global API Key 방식**은 관리하는 도메인이 많을 때 유용하며, 키 하나로 여러 도메인의 인증서를 쉽게 발급할 수 있습니다.
- **API Token 방식**은 특정 도메인에만 권한을 부여할 수 있어 보안성이 더 뛰어납니다.

> [!NOTE]
> 저는 `xiyo.dev` 외에도 다른 도메인이 있기 때문에 **Global API Key 방식**을 사용했습니다.

---

## 인증서 발급 과정

### 1. SSH로 라우터에 접속

```sh
ssh admin@router-ip
```

### 2. Cloudflare DNS 플러그인 다운로드

AC88U 라우터는 기본적으로 DNS 플러그인을 제공하지 않으므로 직접 추가해야 합니다.

```sh
wget -O /jffs/scripts/dnsapi/dns_cf "https://raw.githubusercontent.com/acmesh-official/acme.sh/master/dnsapi/dns_cf.sh"
```

> `wget`을 사용하여 최신 `dns_cf.sh` 스크립트를 다운로드합니다.

### 3. Cloudflare API 키 추가

`CF_KEY`와 `CF_EMAIL`을 `dns_cf` 스크립트의 두 번째 줄에 추가합니다.

```sh
#!/usr/bin/env sh

export CF_Key="my_key"
export CF_Email="my_email"

dns_cf_info=CloudFlare
Site: CloudFlare.com
# 이하 생략...
```

> 홈 서버이며, 접근하는 사람은 나혼자라서 스크립트 파일에 키를 추가하였습니다.
### 4. 서비스 시작 시 자동 설정 추가

라우터가 부팅될 때 자동으로 DNS 플러그인 마운트 및 인증서 갱신 작업을 수행하도록 설정해야 합니다.

다음 내용을 `/jffs/scripts/service-start` 스크립트에 추가합니다.

```sh title=/jffs/scripts/service-start
#!/bin/sh

/jffs/scripts/scmerlin startup &  # scMerlin
ln -s /jffs/.config /home/root/.config # Added by XIYO
mount --bind /jffs/acme/dnsapi /usr/sbin/dnsapi  # Added by XIYO, for ACME

# 매일 새벽 3시에 인증서 갱신 실행 & 로그를 웹 UI(System Log)에 기록
cru a AcmeRenew "0 3 * * * acme.sh --cron --home /jffs/.le 2>&1 | logger -t AcmeRenew"
```

해당 스크립트가 없을 경우 생성하고 실행 권한을 부여합니다.

```sh
touch /jffs/scripts/service-start
chmod +x /jffs/scripts/service-start
```

> `service-start`는 다른 서비스를 설치하면 알아서 만들어져 있긴하다...

### 5. 수동 마운트 실행 및 크론잡 등록

서비스가 시작되기 전, 수동으로 DNS 플러그인을 마운트하고, 크론잡에 인증서 발급을 등록해야합니다.

```sh
mount --bind /jffs/acme/dnsapi /usr/sbin/dnsapi
cru a AcmeRenew "0 3 * * * acme.sh --cron --home /jffs/.le 2>&1 | logger -t AcmeRenew"
```

### 6. 인증서 발급

다음 명령어를 실행하여 와일드카드 인증서를 발급합니다.

```sh
acme.sh --issue --dns dns_cf \
-d xiyo.dev -d *.xiyo.dev \
--cert-home /jffs/.le \
--reloadcmd "nginx -s reload"
```

> nginx를 사용하기 때문에 `reloadcmd` 옵션으로 인증서 발급 후 웹 서버의 인증서를 갱신하도록 하였습니다.

## 마무리

이제 ASUS AC88U 라우터에서 **Cloudflare API를 활용한 ACME SSL 인증서 자동 발급 및 갱신**이 완벽하게 동작할 것입니다.

이 과정을 거치면 **매번 수동으로 인증서를 발급할 필요 없이, 자동으로 SSL 인증서가 갱신**되며, Nginx가 이를 자동으로 로드하게 됩니다.

