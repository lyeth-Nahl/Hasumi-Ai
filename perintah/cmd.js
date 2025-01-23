this.config = {
name: "cmd",
version: "1.0.7",
author: { name: "NTKhang", contacts: "" },
cooldowns: 5,
role: 2,
shortDescription: "Quản lý command",
longDescription: "Quản lý các tệp lệnh của bạn",
category: "owner",
guide: "{prefix}cmd load <tên file lệnh>",
packages: "path"
};

module.exports = {
config: this.config,
start: async ({ api, event, args, client, __ }) => {
const { execSync } = require('child_process');
const { loading } = global;
const { join } = require("path");
const chalk = require("chalk");
const fs = require("fs-extra");
const allWhenChat = global.whenChat;
const { configCommands } = global;
const loadCommand = function (filename) {
try {
const pathCommand = __dirname + `/${filename}.js`;
if (!fs.existsSync(pathCommand)) throw new Error(`Không tìm thấy file ${filename}.js`);
const oldCommand = require(join(__dirname, filename + ".js"));
const oldNameCommand = oldCommand.config.name;
const oldEnvConfig = oldCommand.config.envConfig || {};
const oldEnvGlobal = oldCommand.config.envGlobal || {};
if (oldCommand.config.shortName) {
let oldShortName = oldCommand.config.shortName;
if (typeof oldShortName == "string") oldShortName = [oldShortName];
for (let aliases of oldShortName) global.shortNameCommands.delete(aliases);
}
// delete old command
delete require.cache[require.resolve(pathCommand)];
const command = require(join(__dirname, filename + ".js"));
const configCommand = command.config;
if (!configCommand) throw new Error("Config of command undefined");
const nameScript = configCommand.name;
// Check whenChat function
const indexWhenChat = allWhenChat.findIndex(item => item == oldNameCommand);
if (indexWhenChat != -1) allWhenChat[indexWhenChat] = null;
if (command.whenChat) allWhenChat.push(nameScript);
// -------------
if (configCommand.shortName) {
let { shortName } = configCommand;
if (typeof shortName == "string") shortName = [shortName];
for (const aliases of shortName) {
if (global.shortName.has(aliases)) throw new Error(`Short Name ${aliases} bị trùng lặp với short name của command ${chalk.hex("#ff5208")(global.shortName.get(aliases))}`);
else global.shortName.set(aliases, configCommand.name);
}
}
let { packages, envGlobal, envConfig } = configCommand;
if (!command.start) throw new Error(`Command không được thiếu function start!`);
if (!configCommand.name) throw new Error(`Tên Command không được để trống!`);
if (packages) {
typeof packages == "string" ? packages = packages.trim().replace(/ ${chalk.hex("#ff5208")(i)} cho Script ${chalk.hex("#FFFF00")(nameScript)} thành công ${chalk.hex("#ff0000")(i)} cho Script ${chalk.hex("#ff0000")(nameScript)} với lỗi:  ${infoLoad.name} thất bại với lỗi\n${infoLoad.error.stack.split("\n").filter(i => i.length >