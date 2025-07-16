// import { writeFile } from "node:fs";
import { open, writeFile } from "node:fs/promises";

// how to boot
// BIOS starting the process
// open the first hard disk device present on bootloader
// read first 512 bytes of disk
// store at memory location 0xfc00

// its called magic string
// contains special signature which is  0xaa55
// then its start executins code

// we need 512 byte contains machine code instruction

// 1) initialize stack
// stack pointer -> cpu register
// 16 bit register
// we have to copy value to AX register  which is "general purpose register"
// copy from AX to SP
// copy2ax()
// copy2sp()

// 2) print a message
// for this we use BIOS
// copy AX , BX and maybe CX
// execute interrupt
// copy2ax,bx,cx
// biosinterrupt

// halt the computer
// 1) diable interrupt ( so that this will not interrupt with halt)
// 2) issue halt intr
// 3) if it breaks infinte loop then

// // name of current memory address called halt
// // infinite loop
// .hlt:
//     hlt
//     nop                 // no operatinon
//     jmp .halt

let ctors;

// reverse function
// bbbbbbbb aaaaaaaa (let)
// 01000100 01000100
// masking
// 0 -> not selected , 1 -> selected
// masking is like 00000000 11111111
// then a is selected
// if masking is 11111111 00000000
// then b is selected
// this done by masking with negation
// 10111011 00000000

// >>8  bitwise right to 8 position
// 10111011

let rev;
rev = (val) => {
  let a, b;
  let mask;
  let i;

  // 8 bit one
  mask = 0xff;

  a = val & mask;
  // now we isolated second part which is a
  mask = 0xff00;
  i = val & mask;
  b = i >> 8;
  mask = 0xff;

  return String.fromCharCode(a).concat(String.fromCharCode(b));
};

// b8 bb b9

ctors = {
  copy2ax: (val) => "\xb8" + rev(val),

  copy2bx: (val) => "\xbb" + rev(val),
  copy2cx: (val) => "\xb9" + rev(val),
  copy2sp: () => "\x89\xc4",

  // now bios intterupt
  biosinterrupt: () => "\xcd\x10",

  // halt
  interruptoff: () => "\xfa",
  halt: () => "\x90\xf4",
  jmp: () => "\xeb\xfc", // ttake memory address

  padding: (amt) => "\x90".repeat(amt),
  // 0xaa55
  // 55 aa
  magic: () => rev(0xaa55), // magic string
  print: (str) =>
    str
      .concat("\r\n")
      .split("")
      .map((x) =>
        ctors
          .copy2ax(combine(0x0e, x.charCodeAt(0)))
          .concat(ctors.biosinterrupt())
      )
      .join(""),
};

let mkos;
let combine;
let part1;
let part2;
let save2file;
let exitval;
let file;
let message;

message = "Hello from sumit OS"

save2file = async (msg,filename) => {
    let fd;
    let buf;
    let ret;

    fd = await open(filename, 'w', 0o644);
    if (!fd)
        throw new Error('Unable to open file');

    buf = mkos(msg);
    ret = await writeFile(fd, buf, {encoding: 'ascii'});
    fd.close(fd);
    if (ret !== undefined) {
        throw new Error('Unable to write to file');
    }

    return true;
}

// makeos
// we start at 512 and magic string 2 bytes
mkos = msg =>
    part1(msg)
    + part2((510-part1(msg).length));

combine = (a, b) => ((a & 0xff) << 8) | (b & 0xff);

part1 = (msg) =>
  ctors.copy2ax(0xfbff) +
  ctors.copy2sp() +
  ctors.copy2bx(0x0000) +
  ctors.print(msg) +
  ctors.halt() +
  ctors.jmp();

// for padding
part2 = (amt) => ctors.padding(amt) + ctors.magic();

// exitval = new Boolean(save2file(safe2file("file")));

file = process.argv[2];
if (!file) {
  console.error("Usage: " + process.argv[1], "<filename>");
  process.exit(1);
}

exitval = await save2file(message,file);
if (exitval)
    console.log('ok');
else
    console.error('failed');