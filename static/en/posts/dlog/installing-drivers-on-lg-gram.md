# Installing Drivers on LG Gram

This guide addresses driver issues that arise during the process of resetting and reinstalling the OS on an LG Gram.

## Issue

There was a need to reset the OS and install a completely clean version, different from the initially configured OS. I expected that after resetting, Windows Update would automatically install the drivers, but...

### Missing Wireless Driver

I anticipated that the wireless LAN driver would be installed automatically after the installation, but contrary to expectations, it had to be installed manually.

![Wireless LAN Driver List](/static/resources/install-driver-for-lg-gram-20240826221737828.png)

> I downloaded and installed the wireless LAN driver.

### Still Unable to Install Drivers via Update

Even after running Windows Update through the network, the USB and sound drivers were still not installed. Using the [Intel® Driver & Support Assistant](https://www.intel.co.kr/content/www/kr/ko/support/detect.html) did not help either; one Intel USB driver remained uninstalled, and it was difficult to find a way to download the Realtek sound driver from the official site.

## Solution

I almost gave up on installing the remaining drivers, but then I revisited the [LG Download Center](https://www.lge.co.kr/support/product-manuals) and discovered a dedicated update tool...

![Download Center Screen](/static/resources/install-driver-for-lg-gram-20240826222611325.png)

> Previously, I was focused on searching for the model name and overlooked the "LG Update Program," which I noticed this time...

After downloading and installing it, all the driver issues I was facing were resolved. Installing all the support software took about an hour and a half.
