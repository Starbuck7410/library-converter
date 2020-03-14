const yargs = require('yargs');
const exec = require('child_process').execSync;
let directory = ""
const argv = yargs.argv;
if (argv.dir) {
  directory = argv.dir
} else {
  console.error("Error: No directory specified");
  process.exit(1)
}



// List all files in a directory in Node.js recursively in a synchronous fashion
var walkSync = function(dir, filelist, dirlist) {
  var path = path || require('path');
  var fs = fs || require('fs'),
    files = fs.readdirSync(dir);
  var dirlist = dirlist || [];
  filelist = filelist || [];
  files.forEach(function(file) {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      dirlist.push(path.join(dir, file));
      let temp = walkSync(path.join(dir, file), filelist, dirlist)
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
let folders = walk[1]
let files = [];
var commands = [];
let otherFiles = [];
files = filesUnfiltered.filter(word => word.slice(-5) == ".flac" || word.slice(-4) == ".wav");
otherFiles = filesUnfiltered.filter(word => word.slice(-5) != ".flac" && word.slice(-4) != ".wav");

for (let j = 0; j < folders.length; j++) {
  let folder = folders[j].slice(0, directory.length) + " AAC" + folders[j].slice(directory.length);
  exec("if not exist \"" + folder + "\" mkdir \"" + folder + "\"");
}
for (let i = 0; i < files.length; i++) {
  let input = "\"" + files[i] + "\"";
  if (files[i].word.slice(-5) == ".flac") {
    let output = "\"" + files[i].slice(0, directory.length) + " AAC" + files[i].slice(directory.length, -5) + ".m4a" + "\"";
  } else {
    let output = "\"" + files[i].slice(0, directory.length) + " AAC" + files[i].slice(directory.length, -4) + ".m4a" + "\"";
  }
  exec("ffmpeg -i " + input + " -map 0:0 -c:a aac -b:a 285k " + output);
  console.log("FFM-Pegging file " + (i + 1) + " out of " + files.length);
  console.log(((i / files.length) * 100) + "% complete.");

}



for (let k = 0; k < otherFiles.length; k++) {
  let input = "\"" + otherFiles[k] + "\"";
  let output = "\"" + otherFiles[k].slice(0, directory.length) + " AAC" + otherFiles[k].slice(directory.length) + "\"";
  exec("ECHO F|xcopy " + input + " " + output + " /H");

}

console.log("Job done sucessfully!");

// ffmpeg -i input -c:a aac -b:a 256k output