const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { finished } = require('stream');
const interface = require('./interface.js');
module.exports = {
    convert: convert,
    scanLibrary: scanLibrary
};


function scanLibrary(sourceDir, from) {
    let walk = walkSync(sourceDir);
    let allFiles = walk[0];
    let folders = walk[1];
    let filesToCopy = allFiles;
    let filesToConvert = [];

    // Sorts the file tree into things to convert, and things to copy.
    for (let i = 0; i < from.length; i++) {
        filesToConvert = filesToConvert.concat(allFiles.filter(word => word.endsWith("." + from[i])));
        filesToCopy = filesToCopy.filter(word => !word.endsWith("." + from[i]));
    }


    for (let i = 0; i < filesToConvert.length; i++) {
        filesToConvert[i] = filesToConvert[i].slice(sourceDir.length);
    }

    for (let i = 0; i < filesToCopy.length; i++) {
        filesToCopy[i] = filesToCopy[i].slice(sourceDir.length);
    }

    for (let i = 0; i < folders.length; i++) {
        folders[i] = folders[i].slice(sourceDir.length);
    }

    return [filesToConvert, filesToCopy, folders];
}



async function convert(scannedLibrary, sourceDir, targetDir, format, rate, removeSilence, redoAllFiles, threads, log) {

    let filesToConvert = scannedLibrary[0];
    let filesToCopy = scannedLibrary[1];
    let folders = scannedLibrary[2];
    let fails = [];

    // Rebuilds the folder tree
    for (let j = 0; j < folders.length; j++) {
        if (!fs.existsSync(targetDir + folders[j])) {
            fs.mkdirSync(targetDir + folders[j]);
        }
    }

    // Actually does the conversion
    let eta = 0;
    let now = Date.now();
    let jobs = [];
    let workingJobs = [];
    let currentJobs = 0;
    let finishedJobs = 0;
    console.log("\n".repeat(threads + 1));
    for (let i = 0; i < filesToConvert.length; i++) {
        let input = sourceDir + filesToConvert[i];
        let output = targetDir + path.parse(filesToConvert[i]).dir + "/" + path.parse(filesToConvert[i]).name + "." + format;


        workingJobs.push(filesToConvert[i])
        jobs.push(ffmpegSync(input, output, redoAllFiles, rate, removeSilence).then(
            () => {
                jobs[i] = true;
                if (finishedJobs != 0) {
                    let etaH = Math.floor(eta / 1000 / 60 / 60);
                    let etaM = Math.floor(eta / 1000 / 60 % 60);
                    let etaS = Math.floor(eta / 1000 % 60);
                    interface.drawInterface(((finishedJobs) / filesToConvert.length), etaH, etaM, etaS, workingJobs, threads, false);
                } else {
                    interface.drawInterface(((finishedJobs) / filesToConvert.length), "--", "--", "--", workingJobs, threads, false);
                }
            },
            (error) => {
                // console.log("\x1b[31mFile failed to convert: " + input + "\x1b[37m");
                fs.unlinkSync(output);
                fails.push(input);
                jobs[i] = true;
            }
        ).finally(
            () => {
                workingJobs = workingJobs.filter(word => word != filesToConvert[i]);
                currentJobs--;
                finishedJobs++;

            }));

        currentJobs++;
        if (currentJobs > threads) {
            await Promise.race(filterJobs(jobs))
        }
        eta = (Date.now() - now) / finishedJobs * (filesToConvert.length - finishedJobs);
    }

    await Promise.all(jobs);

    interface.clearLines(threads + 2);
    console.log("ffm-pegging complete!" + "\n\n\n");

    // Copies the remaining files to the right places
    eta = 0;

    for (let k = 0; k < filesToCopy.length; k++) {
        let input = sourceDir + filesToCopy[k];
        let output = targetDir + filesToCopy[k];

        etaH = Math.floor(eta / 1000 / 60 / 60);
        etaM = Math.floor(eta / 1000 / 60 % 60);
        etaS = Math.floor(eta / 1000 % 60);
        interface.drawInterface(((k + 1) / filesToCopy.length), etaH, etaM, etaS, [filesToCopy[k]], 1, true);

        let error = copySync(input, output);
        if (error) {
            // console.error(error);
            fs.unlinkSync(output);
            fails.push(input);
        }
        eta = (Date.now() - now) / finishedJobs * (filesToConvert.length - finishedJobs);
    }

    interface.clearLines(3);
    console.log("Copying complete!");

    // Prints out results nicely
    if (fails.length == 0) {
        console.log("Job done sucessfully!");
        console.log("No log file created (no errors)");
    } else {
        console.log("Job done with \x1b[31m" + fails.length + "\x1b[37m errors:");
        console.log(fails);
        if (log) {
            console.log("Writing log to " + log);
            for (let i = 0; i < fails.length; i++) {
                fs.appendFileSync(log, "Failed to convert or copy file: " + fails[i] + "\n");
            }
        }

    }
}




function walkSync(dir, filelist, dirlist) {
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
    dirlist.unshift(dir);
    return [filelist, dirlist];
};

function filterJobs(queue) {
    for (j = 0; j < queue.length; j++) {
        if (queue[j] === true) {
            queue = queue.filter(word => word !== true);
            j--;
        }
    }
    return queue
}

async function ffmpegSync(input, output, redo, rate, removeSilence, i) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(output)) {
            if (!redo) {
                return resolve();
            }
            try { fs.unlinkSync(output) } catch (error) { return reject() }
        }

        let peg = ffmpeg()
            .input(input)
            .audioCodec(type)
            .withAudioBitrate(rate + "k")
        if (removeSilence) {
            peg.audioFilters("areverse,silenceremove=start_periods=1,areverse");
        }

        peg.save(output)
            .on('end', () => {
                resolve()

            }).on('error', () => {
                reject()
            })


    })
}

function copySync(input, output, redo) {
    if (fs.existsSync(output)) {
        if (!redo) {
            return null;
        } else {
            try { fs.unlinkSync(output) } catch (error) { return error }
        }
    }
    try {
        fs.copyFileSync(input, output);
    } catch (error) {
        return error;
    }
    return null;
}



