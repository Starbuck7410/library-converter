# library-converter
Converts music libraries to many formats!


Just run with library-converter.exe --dir "C:\your\music\library" and your library will be converted!
It will create "C:\your\music\library mp3", covert your wav and flac files to mp3s, and copy everything there! None of your actual library is touched.

Supports resume from a failure, removing silence from the beginning and end of each track (for music rips), and much more, with even more to come!

If you have nodeJS installed you can also just run main.js.

Note: Requires ffmpeg. tested with 2022-12-15-git-9adf02247c-full_build.
Also, this is now cross platform! Currently only tested on Windows 11 as I have too little time to actually test it on my hardware at home, but it should work on Linux and Mac.

## options:

### --dir (working directory)
Tells the program which library to take the files from. (Example: --dir "C:\your\music\library")

### --codec (codec)
Currently takes:
- mp3
- wav
- flac

It converts your library to the selected format. The default is mp3. (Example: --codec flac)

### --from (from)
Tells the program which formats to convert from. The default is wav and flac. (Example: --from oog m4a flac)

### --rate (bitrate)
Selects the desired bitrate (in kb/s) to convert to. The default is 320. (Example: --rate 128)

### --threads
If you want library-converter to run multithreaded and convert several files simultaneously, use this option. The default is 1. (Example: --threads 4)

### --removeSilence
If this flag is enabled, library-converter will remove silence from the start and end of all the files.

### --redoAllFiles
If this flag is enabled, instead of skipping files that already exist, library-converter will re-convert them.


## In the TODO list:

- Fixing bug on Linux where the folders created are wrong
- Logging into a file
- Time estimate and benchmarking
