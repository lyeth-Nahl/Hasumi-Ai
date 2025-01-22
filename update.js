/* HADY ZEN'IN */

const { spawn } = require('child_process');

function hady() {
  const child = spawn("node perbarui.js", {
    cwd: __dirname,
    stdio: "inherit",
    shell: true
 });
};

hady();
