# library-converter
Converts music libraries to many formats!



Just run with library-converter.exe --dir "C:\your\music\library" and your library will be converted!
It will create "C:\your\music\library mp3", covert your wav and flac files to mp3s, and copy everything there! None of your actual library is touched.

##options:

###--dir (working directory)
tells the program which library to take the files from.

###--codec (codec)
currently takes:
- mp3
- wav
- flac
it converts your library to the selected codec. default is mp3.

###--from (from)
tells the program which formats to convert from. default is wav and flac.

###--rate (bitrate)
selects the desired bitrate to convert to. default is 320.

###--removeSilence
if enabled, removes silence from end of file.

Requires ffmpeg. tested with n5.0-4-g911d7f167c-20220207.
