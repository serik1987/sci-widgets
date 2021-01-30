const fs = require("fs");
const path = require("path");
const process = require("process");
const childProcess = require("child_process");

console.log("Minification of common styles...");

process.chdir("src");

let template = fs.readFileSync("basic-template.tpl", "utf8");

let css = childProcess.execSync("minify common-styles.css", {encoding: "utf8"});
let output = template.replace("%CSS%", css);

let constants = fs.readFileSync("constants.js", "utf8");
output += constants;

let miniOutput = childProcess.execSync("cat | minify --js -", {encoding: "utf8", input: output});

fs.writeFileSync("../modules/common.js", miniOutput, "utf8");