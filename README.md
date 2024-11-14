# Library Converter

A comprehensive tool for converting music libraries into multiple formats with ease and efficiency.

## Quick Start

To install, you have several options:

### Install from AUR
```bash
git clone https://aur.archlinux.org/library-converter-git.git
makepkg
```
OR (if you have paru installed)
```bash
paru library-converter
```

### To run from source
To download the code, run:
```bash
git clone https://github.com/Starbuck7410/library-converter.git
```
and then to run library-converter, run:
```bash
node main.js
```
This should output an error because no directory was specified.

### Please note library-converter depends on ffmpeg being in your PATH, so make sure it's there before using it.

## Usage

To convert your music library, run the following command:
```bash
library-converter --dir /your/music/library"
```

This will create a new directory `/your/music/library mp3/`, convert all `.wav` and `.flac` files to `.mp3`, and copy them into the new directory. Your original files will remain untouched.

### OS Support

library-converter uses Node.js, so it in theory should run on any operating system that supports it. Only tested on Ubuntu, Arch linux and Windows 10.

### Requirements

- **FFmpeg**: Ensure that FFmpeg is installed and accessible in your system's PATH.

## Available Options

### `--dir` (Working Directory, REQUIRED)

Specifies the source directory containing your music files.

- **Example**: `--dir "C:\your\music\library"`

### `--codec` (Output Codec)

Determines the format which your music library will be converted to.

- **Supported values**: `mp3`, `wav`, `flac`
- **Default**: `mp3`
- **Example**: `--codec flac`

### `--from` (Source Formats)

Indicates the file formats to convert from.

- **Default**: `wav`, `flac`
- **Example**: `--from ogg m4a flac`

### `--rate` (Bitrate)

Sets the target bitrate for the converted files (in kbps).

- **Default**: `320`
- **Example**: `--rate 128`

### `--threads`

Enables multithreaded processing for simultaneous file conversions.

- **Default**: `1`
- **Example**: `--threads 4`

### `--removeSilence`

Activates the removal of silence at the beginning and end of each track, which is particularly useful for music rips.

### `--redoAllFiles`

Forces the re-conversion of files even if they already exist in the target directory.

### `--log` (Log File Location)

Saves a log of any files that failed during conversion.

- **Example**: `--log log.txt`

### `--target` (Target Directory)

Specifies the destination directory for the converted library.

- **Default**: `/your/library/path (codec)/`
- **Example**: `--target /your/library/path/compressed`

## Future Enhancements

- Address the Paru package issue related to `pkg` cleanup by executing `pkg` manually rather than installing it globally in the `PKGBUILD` file.
- Add this file to the docs on install from the AUR so you can run ```man library-converter``` to see how to use it.

## License

This project is licensed under the GPL-V3 License.

