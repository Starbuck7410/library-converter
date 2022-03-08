const yargs = require('yargs');
const exec = require('child_process').execSync;
const argv = yargs.argv;
const codecs = {
  mp3: "libmp3lame",
  wav: "pcm_s16le",
  flac: "flac"
};

let directory = "";
if (argv.dir) {
  directory = argv.dir;
} else {
  console.error("Error: No directory specified");
  process.exit(1);
}

let type = "libmp3lame";
if (argv.codec) {
  type = codecs[argv.codec];
};

yargs.option('from', {
  type: 'array',
  desc: 'From which file types to convert',
});

let from = ["flac", "wav"];
if (argv.from) {
  from = argv.from;
};


let rate = "320";
if (argv.rate) {
  rate = argv.rate;
};



// List all files in a directory in Node.js recursively in a synchronous fashion
let walkSync = function (dir, filelist, dirlist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  var dirlist = dirlist || [];
  filelist = filelist || [];
  files.forEach(function (file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      dirlist.push(path.join(dir, file));
      let temp = walkSync(path.join(dir, file), filelist, dirlist);
      filelist = temp[0];
      dirlist = temp[1];

    } else {
      filelist.push(path.join(dir, file));
    }
  });
  return [filelist, dirlist];
};


let walk = walkSync(directory);
let filesUnfiltered = walk[0];
let folders = walk[1];
let files = [];
let otherFiles = [];

for (let i = 0; i < from.length; i++) {
  files.push(filesUnfiltered.filter(word => word.endsWith("." + from[i])));
  otherFiles.push(filesUnfiltered.filter(word => word.endsWith("." + from[i]) === false));
}
console.log(files);

// for (let j = 0; j < folders.length; j++) {
//   let folder = folders[j].slice(0, directory.length) + " " + type + folders[j].slice(directory.length);
//   exec("if not exist \"" + folder + "\" mkdir \"" + folder + "\"");
// }


// for (let i = 0; i < files.length; i++) {
//   let input = "\"" + files[i] + "\"";
//   let output = ""
//   if (files[i].slice(-5) == ".flac") {
//     output = "\"" + files[i].slice(0, directory.length) + " " + type + files[i].slice(directory.length, -5) + ".mp3" + "\"";
//   } else {
//     output = "\"" + files[i].slice(0, directory.length) + " " + type + files[i].slice(directory.length, -4) + ".mp3" + "\"";
//   }
//   console.log(output);
//   exec("ffmpeg -i " + input + " -map 0:0 -c:a " + type + " -b:a " + rate + "k " + output);
//   console.log("FFM-Pegging file " + (i + 1) + " out of " + files.length);
//   console.log(((i`` / files.length) * 100) + "% complete.");

// }



// for (let k = 0; k < otherFiles.length; k++) {
//   let input = "\"" + otherFiles[k] + "\"";
//   let output = "\"" + otherFiles[k].slice(0, directory.length) + " " + type + otherFiles[k].slice(directory.length) + "\"";
//   exec("ECHO F|xcopy " + input + " " + output + " /H");

// }

console.log("Job done sucessfully!");

//wait here just a sec