module.exports = {
    drawInterface: drawInterface,
    clearLines: clearLines
};

function drawInterface(percent, hours, mins, secs, activeJobs, threads, copy) {
    clearLines(threads + 2);
    if (copy) {
        console.log("Copying files:");
    } else {
        console.log("ffm-pegging files:");
    }
    for (let i = 0; i < threads; i++) {
        if (i < activeJobs.length) {
            console.log(activeJobs[i]);
        } else {
            console.log("-----");
        }
    }
    drawProgressBar(percent, hours, mins, secs);
}


function drawProgressBar(percent, hours, mins, secs) {
    let width = process.stdout.columns;
    let bar = "";
    for (let i = 0; i < width - 23; i++) {
        if (i < (width - 23) * percent) {
            bar += "█";
        } else {
            bar += "_";
        }
    }

    console.log(bar + (100 * percent).toFixed(0) + "% | ETA: " + hours + "h " + mins + "m " + secs + "s");

}

function clearLines(n) {
    for (let i = 0; i < n; i++) {
        process.stdout.moveCursor(0, -1) // up one line
        process.stdout.clearLine(1) // from cursor to end
    }
}