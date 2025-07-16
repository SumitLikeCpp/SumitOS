# SumitOS

A simple operating system bootloader generator written in Node.js that creates a 512-byte bootable disk image.

## What is SumitOS?

SumitOS is a minimal operating system that generates a bootable disk image. When booted, it displays "Hello from sumit OS" on the screen. The project demonstrates fundamental concepts of:

- BIOS boot process
- x86 assembly instruction generation
- Bootloader creation
- Low-level system programming

## How it Works

The program generates a 512-byte bootable sector that:
1. Initializes the stack pointer
2. Sets up BIOS interrupts for text display
3. Prints a welcome message
4. Halts the system
5. Includes the magic boot signature (0xAA55)

## Prerequisites

### Ubuntu/Linux
```bash
# Install Node.js (version 14 or higher)
sudo apt update
sudo apt install nodejs npm

# Verify installation
node --version
npm --version
```

### Virtual Machine Setup
If running in a VM, ensure you have:
- VirtualBox, VMware, or QEMU installed
- At least 512MB RAM allocated
- Boot from floppy/disk image enabled

## Installation & Usage

### 1. Clone or Download the Project
```bash
git clone https://github.com/SumitLikeCpp/SumitOS.git
cd SumitOS
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Generate Bootable Image
```bash
node main.js bootdisk.img
```

This creates a `bootdisk.img` file containing your bootable OS.

### 4. Test the OS

#### Option A: Using QEMU (Recommended)
```bash
# Install QEMU
sudo apt install qemu-system-x86

# Boot your OS
qemu-system-i386 -fda bootdisk.img
```

#### Option B: Using VirtualBox
1. Open VirtualBox
2. Create a new VM (Other/DOS)
3. Set RAM to 512MB
4. Don't create a hard disk
5. In Settings → Storage, add a floppy controller
6. Mount `bootdisk.img` as a floppy disk
7. Start the VM

#### Option C: Using Real Hardware (Advanced)
```bash
# Write to USB drive (DANGEROUS - double-check device name!)
sudo dd if=bootdisk.img of=/dev/sdX bs=512 count=1
# Replace /dev/sdX with your USB device
```

## File Structure

```
SumitOS/
├── main.js          # Main bootloader generator
├── package.json     # Node.js project configuration
├── README.md        # This file
└── bootdisk.img     # Generated bootable image (after running)
```

## Code Overview

The `main.js` file contains:
- **Assembly instruction generators** (`ctors` object)
- **Byte manipulation functions** for x86 instruction encoding
- **Bootloader assembly logic** (stack setup, BIOS calls, halt)
- **File writing utilities** to create the bootable image

## Customization

### Change the Boot Message
Edit the `message` variable in `main.js`:
```javascript
message = "Your custom message here"
```

### Modify Boot Behavior
The `part1` function contains the main boot logic. You can:
- Add more BIOS interrupt calls
- Change text colors
- Add simple graphics

## Troubleshooting

### "Permission denied" when running
```bash
chmod +x main.js
```

### QEMU not found
```bash
sudo apt install qemu-system-x86
```

### VM won't boot from image
- Ensure the image is mounted as a floppy disk
- Check VM boot order settings
- Verify the image was created successfully (should be exactly 512 bytes)

### Node.js version issues
```bash
# Install latest Node.js using NodeSource
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs
```

## Technical Details

- **Boot Sector Size**: 512 bytes
- **Magic Signature**: 0xAA55 (last 2 bytes)
- **Architecture**: x86 (16-bit real mode)
- **Assembly Instructions**: Generated programmatically
- **BIOS Interrupts**: INT 10h for video output

## Learning Resources

- [OSDev Wiki](https://wiki.osdev.org/)
- [x86 Assembly Guide](https://www.cs.virginia.edu/~evans/cs216/guides/x86.html)
- [BIOS Interrupts Reference](http://www.ctyme.com/intr/int.htm)

## License

Apache License 2.0  - See LICENSE file for details.

## Contributing

Feel free to submit issues and pull requests to improve SumitOS!
