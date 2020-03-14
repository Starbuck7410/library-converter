# library-converter
Converts music libraries to AAC (M4A)

Just run with library-converter.exe --dir "C:\your\music\library" --bitrate 285 (optional, default is 285)
It will create "C:\your\music\library AAC" and put everything there. None of your actual library is touched.
Only converts flac and wav files. Copies everything else.

Requires ffmpeg. tested with git-2019-12-07-70e292b.
