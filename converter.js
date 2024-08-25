const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');
const { finished } = require('stream');
module.exports = { convert: convert };

// Main function =======================
async function convert(directory, from, format, rate, removeSilence, redoAllFiles, threads, log) {
    // List all files in a directory in Node.js recursively in a synchronous fashion


    // This is where the fun begins
    let walk = walkSync(directory);
    let filesUnfiltered = walk[0];
    let folders = walk[1];
    let files = [];
    let otherFiles = filesUnfiltered;
    let fails = []

    // Sorts the file tree into things to sort, and things to copy.
    for (let i = 0; i < from.length; i++) {
        files = files.concat(filesUnfiltered.filter(word => word.endsWith("." + from[i])));
        otherFiles = otherFiles.filter(word => !word.endsWith("." + from[i]));
    }

    // Rebuilds the folder tree
    for (let j = 0; j < folders.length; j++) {
        let folder = folders[j].slice(0, directory.length) + " " + format + folders[j].slice(directory.length);
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder);
        }
    }

    // Actually does the conversion
    let jobs = [];
    let currentJobs = 0;
    let finishedJobs = 0;
    for (let i = 0; i < files.length; i++) {
        let input = files[i];
        let output = files[i].slice(0, directory.length) + " " + format + path.parse(files[i].slice(directory.length)).dir + "/" + path.parse(files[i].slice(directory.length)).name + "." + format;


        console.log("FFM-Pegging file " + (i + 1) + " out of " + files.length + ":"); // lol ffm-pegging
        console.log(input);


        jobs.push(ffmpegSync(input, output, redoAllFiles, rate, removeSilence).then(
            () => {
                jobs[i] = true;
            },
            (error) => {
                console.log("\x1b[31mFile failed to convert: " + input + "\x1b[37m");
                fs.unlinkSync(output);
                fails.push(input);
                jobs[i] = true;
            }
        ).finally(
            () => {
                currentJobs--;
                finishedJobs++;
                console.log((((finishedJobs) / files.length) * 100).toFixed(2) + "% complete.");
                console.log("...");
            }));

        currentJobs++;
        if (currentJobs >= threads) {
            await Promise.race(filterJobs(jobs))
        }
    }

    await Promise.all(jobs);

    // Copies the remaining files to the right places
    for (let k = 0; k < otherFiles.length; k++) {
        let input = otherFiles[k];
        let output = otherFiles[k].slice(0, directory.length) + " " + format + otherFiles[k].slice(directory.length);

        console.log("Copying file: " + output);
        console.log((((k + 1) / otherFiles.length) * 100).toFixed(2) + "% complete.");

        let error = copySync(input, output);
        if (error) {
            console.error(error);
            fs.unlinkSync(output);
            fails.push(input);
        }

    }

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


// Functions =======================

function walkSync(dir, filelist, dirlist) {    // (Shamelessly stolen from StackOverflow)
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
            queue = queue.slice(0, j).concat(queue.slice(j + 1, queue.length));
            j--;
        }
    }
    return queue
}

async function ffmpegSync(input, output, redo, rate, removeSilence, i) {
    return new Promise((resolve, reject) => {
        if (fs.existsSync(output)) {
            if (!redo) {
                console.log("\x1b[32mFile " + output + " already exists. Skipping...\x1b[37m"); // C O L O R S
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
            console.log("\x1b[32mFile " + output + " already exists. Skipping...\x1b[37m"); // C O L O R S
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



