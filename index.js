const { spawn } = require('child_process');

function hady() {

  const child = spawn("node Ayanokoji.js", {

    cwd: __dirname,

    stdio: "inherit",

    shell: true

  });

  child.on("close", (code) => {

    if (code == 2) {

      hady();

    }

  });

}

function sistem() {

  const child = spawn("node sistem.js", {

    cwd: __dirname,

    stdio: "inherit",

    shell: true

  });

  child.on("close", (code) => {

    if (code == 2) {

      sistem();

    }

  });

}

hady();

sistem();

setInterval(function() {

  console.clear();

}, 3600000);