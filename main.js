const yargs = require('yargs').option('from', {
  type: 'array',
  desc: 'Which file types to convert',
});
const exec = require('child_process').execSync;
const argv = yargs.argv;
const converter = require('./converter.js');

// instead of writing "libmp3lame" you can just type in "mp3" and it'll work
// adding more codecs in the future is easy, as all you'll need to do is to just add them here
const codecs = {
  mp3: "libmp3lame",
  wav: "pcm_s16le",
  flac: "flac"
};

// I remember adding this feature as a request from a friend, if you got massive ripped music
// libraries you keep in a listenable format you can use this option
let removeSilence = false;
if (argv.removeSilence) {
  removeSilence = true;
  console.log("Removing silence from files");
}

// If for any deranged reason you might wanna sit for 5 hours after a conversion failed, you can do that.
let redoAllFiles = false;
if (argv.redoAllFiles) {
  redoAllFiles = true;
  console.log("Redoing all files...");
}

let directory = "";
if (argv.dir) {
  directory = argv.dir;
} else {
  console.error("Error: No directory specified");
  process.exit(1);
}

let format = "mp3";
if (argv.codec) {
  format = argv.codec;
};
type = codecs[format];

let rate = "320";
if (format == "mp3") {
  if (argv.rate) {
    rate = argv.rate;
  };
}

let threads = 1;
if (argv.threads) {
  threads = argv.threads;
};

let from = ["flac", "wav"];
if (argv.from) {
  from = argv.from;
};
console.log("Converting all files with formats: " + from);


converter.convert(directory, from, format, rate, removeSilence, redoAllFiles, threads);



// Code by StackOverflow, assembly by Starbuck7410