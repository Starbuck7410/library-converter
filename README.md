# library-converter
Converts music libraries to many formats!



Just run with library-converter.exe --dir "C:\your\music\library" and your library will be converted!
It will create "C:\your\music\library mp3", covert your wav and flac files to mp3s, and copy everything there! None of your actual library is touched.

If you have nodeJS installed you can also just run main.js.
Note: Requires ffmpeg. tested with n5.0-4-g911d7f167c-20220207.

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

### --skipIfExists
Skips files if they already exist.


