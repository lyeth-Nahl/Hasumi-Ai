const { exec } = require('child_process');

const Ayanokoji = async function ({ api, event, args, bhs }) {
    try {
        if (!args[0]) {
            return api.sendMessage("❌ Mohon masukkan perintah yang akan dijalankan!", event.threadID);
        }

        const command = args.join(" ");
        exec(command, (error, stdout, stderr) => {
            let response = `📝 Shell Command\n╭────────────────\n`;
            response += `│ Input: ${command}\n`;

            if (error) {
                response += `│ Error: ${error.message}\n`;
            }
            if (stdout) {
                response += `│ Output: ${stdout}\n`;
            }
            if (stderr) {
                response += `│ StdErr: ${stderr}\n`;
            }

            response += `╰────────────────`;
            api.sendMessage(response, event.threadID);
        });
    } catch (error) {
        console.error("Error in shell command:", error);
        api.sendMessage("❌ Terjadi kesalahan saat menjalankan perintah.", event.threadID);
    }
};