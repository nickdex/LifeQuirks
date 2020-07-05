---
title: Setting up Raspberry Pi
date: "2019-01-04T10:00:00.000Z"
description: Headless setup for raspberry pi. It provides general purpose environment to build onto.
tag:
  - raspberry pi
  - guide
---

## Enable SSH

Enable SSH on a headless Raspberry Pi (add file to SD card on another machine)

For headless setup, SSH can be enabled by **placing a file named ssh**, without any extension, onto the **/boot** partition of the SD card from another computer. When the Pi boots, it looks for the ssh file. If it is found, SSH is enabled and the file is deleted. The content of the file does not matter; it could contain text, or nothing at all.
If you have loaded Raspbian onto a blank SD card, you will have two partitions. The first one, which is the smaller one, is the boot partition. Place the file into this one.

## Set up environment

Install zsh shell, git for installing plugins and vim to edit config files

```bash
sudo apt install -y zsh git vim
```

Set ZSH as default shell

```bash
sudo chsh -s "$(command -v zsh)" "${USER}"
```

Antigen is plugin manager for ZSH.
Create config directory for antigen and download the file there.

```bash
mkdir -p ~/.config/antigen/

curl -L git.io/antigen > ~/.config/antigen/antigen.zsh
```

Install Docker to run your apps in productive way.

```bash
curl -sSL https://get.docker.com | sh
```
