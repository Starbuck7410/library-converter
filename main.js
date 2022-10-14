const yargs = require('yargs').option('from', {
  type: 'array',
  desc: 'From which file types to convert',
});
const exec = require('child_process').execSync;
const argv = yargs.argv;
const fs = require('fs');
const path = require('path');
const codecs = {
  mp3: "libmp3lame",
  wav: "pcm_s16le",
  flac: "flac"
};

let removeSilence = false;
if (argv.removeSilence) {
  removeSilence = true;
  console.log("Removing silence from files");
}

let skipIfExists = false;
if (argv.skipIfExists) {
  skipIfExists = true;
  console.log("Skipping existing files");
}

let directory = "";
if (argv.dir) {
  directory = argv.dir;
} else {
  console.error("Error: No directory specified");
  process.exit(1);
}

let type = "libmp3lame";
let format = "mp3";
if (argv.codec) {
  type = codecs[argv.codec];
  format = argv.codec;

};



let from = ["flac", "wav"];
if (argv.from) {
  from = argv.from;
};
console.log(from);


let rate = "320";
if (argv.rate) {
  rate = argv.rate;
};



// List all files in a directory in Node.js recursively in a synchronous fashion
let walkSync = function (dir, filelist, dirlist) {
  let files = fs.readdirSync(dir);
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
let otherFiles = filesUnfiltered;
let fails = []

for (let i = 0; i < from.length; i++) {
  files = files.concat(filesUnfiltered.filter(word => word.endsWith("." + from[i])));
  otherFiles = otherFiles.filter(word => !word.endsWith("." + from[i]));
}


for (let j = 0; j < folders.length; j++) {
  let folder = folders[j].slice(0, directory.length) + " " + format + folders[j].slice(directory.length);
  exec("if not exist \"" + folder + "\" mkdir \"" + folder + "\"");
}


for (let i = 0; i < files.length; i++) {
  let input = "\"" + files[i] + "\"";
  let output = "\"" + files[i].slice(0, directory.length) + " " + format + path.parse(files[i].slice(directory.length)).dir + "\\" + path.parse(files[i].slice(directory.length)).name + "." + format + "\"";
  // console.log(input, output);
  if (!(fs.existsSync(path.join(path.resolve(output.slice(1, -1)))) && skipIfExists)) {
    try {
      if (removeSilence) {
        exec("ffmpeg -y -i " + input + " -map 0:0 -c:a " + type + " -b:a " + rate + "k " + " -af \"areverse,silenceremove=start_periods=1,areverse\" " + output);
      } else {
        exec("ffmpeg -y -i " + input + " -map 0:0 -c:a " + type + " -b:a " + rate + "k " + output);
      }
      console.log("FFM-Pegging file " + (i + 1) + " out of " + files.length);
      console.log((((i + 1) / files.length) * 100) + "% complete.");
    } catch (error) {
      console.error(error);
      exec("del " + output);
      fails.push(input)
    }
  } else {
    console.log("\x1b[32mFile " + output + " already exists. Skipping...\x1b[37m")
  }
}



for (let k = 0; k < otherFiles.length; k++) {
  let input = "\"" + otherFiles[k] + "\"";
  let output = "\"" + otherFiles[k].slice(0, directory.length) + " " + format + otherFiles[k].slice(directory.length) + "\"";
  if (!(fs.existsSync(path.join(path.resolve(output.slice(1, -1)))) && skipIfExists)) {
    try {
      console.log("Copying file: " + output)
      console.log((((k + 1) / otherFiles.length) * 100) + "% complete.");
      exec("ECHO F|xcopy " + input + " " + output + " /H /Y");
    } catch (error) {
      console.error(error)
      fails.push(output)
    }
  } else {
    console.log("\x1b[32mFile " + output + " already exists. Skipping...\x1b[37m")
  }

}

if (fails.length == 0) {
  console.log("Job done sucessfully!");
} else {
  console.log("Job done with \x1b[31m" + fails.length + "\x1b[37m errors:");
  console.log(fails);

}