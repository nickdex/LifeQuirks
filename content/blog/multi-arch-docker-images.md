---
title: Building docker image across architectures
date: "2019-11-07T10:00:00.000Z"
description: Cross compile docker images for different architectures
tag:
  - docker
  - cross compilation
  - guide
---

## Why it is needed

When we need to run our docker apps on a slower machine having different architecture (eg raspberry pi), we can make use of more powerful machine to do repetitive long running tasks like building images with every change, then target machine can simply pull the built image.

## Enter QEMU

[QEMU](https://www.qemu.org) is an open source processor emulator that lets you run programs built for different architecture on your machine.

## Install QEMU

### Linux

Arch Linux

```bash
pakku -S qemu-user-static
```

Ubuntu/Debian

```bash
apt install qemu-user-static
```

### OSX

```bash
sudo apt install -y qemu qemu-user-static qemu-user binfmt-support
```

## Register QEMU in the build agent

The next step is to register QEMU in the build agent. There is a Docker image available that can do this for us in just one line.

```bash
docker run --rm --privileged multiarch/qemu-user-static:register --reset
```

## Copy qemu-user-static binary

Copy the appropriate binary in the project folder. The name format for binary is **qemu-\$ARCH-static**.

I'll use **arm** since I'm building for raspberry pi 2 (arm7).

```bash
cp /bin/usr/qemu-arm-static <project>
```

## Update dockerfile

Choose appropriate base image and copy the qemu binary at /usr/bin.

Make sure qemu binary and base image have same architecture.

```dockerfile
FROM arm32v7/debian

COPY ./qemu-arm-static /usr/bin/qemu-arm-static
```

## Some Gotchas

Sometimes I get `format exec error` again when I try to build image. It happens usually after a system restart.
I simply register qemu in docker build agent again and it fixes that issue.
