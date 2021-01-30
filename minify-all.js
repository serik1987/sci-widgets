const fs = require("fs");
const path = require("path");
const process = require("process");
const childProcess = require("child_process");

function loadMainFile(fileType){
    let filename = className + "." + fileType;
    return fs.readFileSync(filename, "utf8");
}

function putAllFiles(str){
    let matches = false;
    while (matches = str.match(/\{\{(.+)\}\}/)){
        let filename = matches[1];
        let content = fs.readFileSync(filename, "utf8");
        let placeholder = `{{${filename}}}`;
        str = str.replace(placeholder, content);
    }

    return str;
}

function make_dirs(dirs){
    let parentDir = path.dirname(dirs);
    if (parentDir && parentDir !== "."){
        make_dirs(parentDir);
    }
    if (!fs.existsSync(dirs)){
        fs.mkdirSync(dirs);
    }
}

if (process.argv.length < 4){
    throw new TypeError("Usage: node minify-all.js <class-path> <tag-name>");
}
let classPath = path.join("src", process.argv[2]);
let className = path.basename(process.argv[2]);
let element = process.argv[3];
if (argv.length > 4){
    let root = argv[4];
}

console.log(`Minification of ${element} with class ${classPath}`);

let output = fs.readFileSync("src/template.tpl", "utf8");
output = output
    .replace(/%CLASS%/g, className);

if (element.startsWith("sci-")){
    output = output.replace(/%ELEMENT%/, `customElements.define("${element}", ${className});`);
} else {
    output = output.replace(/%ELEMENT%/, "");
}

let projectDir = __dirname;
process.chdir(classPath);

let jsFile = loadMainFile("js");
output = output.replace(`{{${className}.js}}`, jsFile);

let cssFile = childProcess.execSync(`minify ${className}.css`, {encoding: "utf8", input: cssFileRaw});
output = output.replace(`{{${className}.css}}`, cssFile);

let htmlFile = loadMainFile("html");
htmlFile = putAllFiles(htmlFile);
htmlFileMinified = childProcess.execSync("cat | minify --html -", {encoding: "utf8", input: htmlFile});
output = output.replace(`{{${className}.html}}`, htmlFileMinified);

process.chdir(projectDir);

let category = path.dirname(process.argv[2]);
let destinationPath = path.join("modules", category);
let destinationFile = path.join(destinationPath, element + ".js");

make_dirs(destinationPath);

let minifiedOutput = childProcess.execSync("cat | minify --js -", {encoding: "utf8", input: output});

fs.writeFileSync(destinationFile, minifiedOutput, "utf8");