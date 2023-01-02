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
Tells the program which library to take the files from.

### --codec (codec)
Currently takes:
- mp3
- wav
- flac

It converts your library to the selected codec. default is mp3.

### --from (from)
Tells the program which formats to convert from. default is wav and flac.

### --rate (bitrate)
Selects the desired bitrate to convert to. default is 320.

### --removeSilence
If enabled, removes silence from end of file.

### --redoAllFiles
The program automatically skips files if they already exist, but you can tell it not to if you want to for some reason.


## In the TODO list:

- Multithreading
- Logging into a file
