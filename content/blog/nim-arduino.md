---
title: Nim Arduino
date: "2019-11-07T10:00:00.000Z"
description: Using nim to write arduino programs
tag:
  - arduino
  - nim
  - guide
---

## Docker Instructions (optional)

### Get Docker image

Get docker image from official repo [Nim Docker](https://hub.docker.com/r/nimlang/nim/)

```Bash
docker pull nimlang/nim

docker run -it nimlang/nim /bin/bash
```

## Get Arduino tools

[Direct Link to 64 Bit](https://www.arduino.cc/download_handler.php?f=/arduino-1.8.7-linux64.tar.xz)

```Bash
cd ~/Downloads # Wherever you downloaded tar ball

# Extract tar (it will extract to arduino-1.8.7-linux64 directory by default)
tar xf arduino-1.8.7-linux64.tar.xz
```

We will be using three tools that come with arduino

- avr-gcc (compiler and linker)
- avr-objcopy (generates hex file)
- avrdude (flashes hex file to arduino)

You can find them at `~/Downloads/arduino-1.8.7/hardware/tools/avr/bin`

## Running code with-out arduino framework/IDE

### Blink code in C

#### led.c

```C
#include <avr/io.h>
#include <util/delay.h>

#define BLINK_DELAY_MS 1000

int main (void)
{
/* set pin 5 of PORTB for output*/
DDRB |= _BV(DDB5);

  while(1) {
    /* set pin 5 high to turn led on */
    PORTB |= _BV(PORTB5);
    _delay_ms(BLINK_DELAY_MS);

    /* set pin 5 low to turn led off */
    PORTB &= ~_BV(PORTB5);
    _delay_ms(BLINK_DELAY_MS);
  }
}
```

### Compile and flash

```Bash
cd ~/Downloads/arduino-1.8.7/hardware/tools/avr/bin # Change accordingly

# Compile
avr-gcc -Os -DF_CPU=16000000UL -mmcu=atmega328p -c -o led.o led.c

# Link libraries (not present in this case) and produce binary
avr-gcc -mmcu=atmega328p led.o -o led

# Convert binary to hex
avr-objcopy -O ihex -R .eeprom led led.hex

# Flash hex file to arduino
# Change /dev/ttyACM0 to the serial port of your arduino
avrdude -F -V -c arduino -p ATMEGA328P -P /dev/ttyACM0 -b 115200 -U flash:w:led.hex
```

## Using Nim

Nim needs panic override to work in embedded systems

#### panicoverride.nim

```Nim
proc printf(frmt: cstring) {.varargs, importc, header: "<stdio.h>", cdecl.}
proc exit(code: int) {.importc, header: "<stdlib.h>", cdecl.}

{.push stack_trace: off, profiler:off.}

proc rawoutput(s:string) =
  printf("%s\n", s)

proc panic(s: string) =
  rawoutput(s)
  exit(1)

{.pop.}
```

#### Nim Config - nim.cfg

```Nim
avr.standalone.gcc.path = "~/Downloads/arduino-1.8.7/hardware/tools/avr/bin"
avr.standalone.gcc.exe = "avr-gcc"
avr.standalone.gcc.linkerexe = "avr-gcc"

passC = "-Os"
passC = "-DF_CPU=16000000UL"
passC = "-mmcu=atmega328p"
passL = "-mmcu=atmega328p"

cpu = "avr"
gc = "none"
define = "release"
deadCodeElim = "on"
os = "standalone"
```

We need to wrap C code in functions so that they can be called by nim

#### led.c

```C
#include <avr/io.h>
#include <util/delay.h>

void led_setup(void) {
  DDRB |= _BV(DDB5);
}

void led_on(void) {
  PORTB |= _BV(PORTB5);
}

void led_off(void) {
  PORTB &= ~_BV(PORTB5);
}

void delay(int ms) {
  for (int i = 0; i < ms; i++) {
    _delay_ms(1);
  }
}
```

#### Blink.nim

```Nim
{.compile: "led.c".}
proc led_setup(): void {.importc.}
proc led_on(): void {.importc.}
proc led_off(): void {.importc.}
proc delay(ms: int): void {.importc.}

when isMainModule:
  led_setup();
  while true:
    led_on();
    delay(1000);
    led_off();
    delay(1000);
```

#### Compile blink.nim using nim compiler

```Bash
nim c blink.nim
```

#### Linking doesn't work so have do it manually

```Bash
~/Downloads/arduino-1.8.7/hardware/tools/avr/bin/avr-gcc \
    -mmcu=atmega328p \
    -I/usr/lib/nim \
    ~/.cache/nim/blink_d/blink.c.o \
    ~/.cache/nim/blink_d/led.c.o \
    ~/.cache/nim/blink_d/stdlib_system.c.o -o blink
```

### Convert to hex

```Bash
~/Downloads/arduino-1.8.7/hardware/tools/avr/bin/avr-objcopy \
     -O ihex -R .eeprom blink blink.hex
```

### Flash to arduino

```Bash
~/Downloads/arduino-1.8.7/hardware/tools/avr/bin/avrdude -F -V \
    -c arduino \
    -p ATMEGA328P \
    -P /dev/ttyACM0 \
    -b 115200 -U flash:w:blink.hex \
    -C ~/Downloads/arduino-1.8.7/hardware/tools/avr/etc/avrdude.conf
```
