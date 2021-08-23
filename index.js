#!/usr/bin/env node

const fs = require("fs");

String.prototype.replaceAtIndex = function (_index, _newValue) {
  return (
    this.substr(0, _index) + _newValue + this.substr(_index + _newValue.length)
  );
};

let path = process.argv[2] || null;
let recursive = false;
if (process.argv[3] == "all") {
  recursive = true;
}

//strip potential ending forward slash
if (path[path.length - 1] === "/") {
  path = path.slice(0, path.length - 1);
}

//files to import
const importThese = [
  "png",
  "jpg",
  "jpeg",
  "gif",
  "webp",
  "tiff",
  "psd",
  "raw",
  "bmp",
  "heif",
  "indd",
  "svg",
  "ai",
  "eps",
  "pdf",
];

if (!path) {
  console.log(
    "You didnt add a path. Try again and add the relative path to the folder with the images. For example: react-import-folder ./src/assets/img\nadd 'all' to look in subdirectories too. For example: react-import-folder ./src/assets/img all"
  );
  process.exit();
}

let output = "";
let imports = "";
let data = "";
let dataOBJ = {};
let forbidden = ["-", " ", "", ".", "&"];

function main(pth) {
  console.log(pth);
  console.log(pth.split("/"));
  files = fs.readdirSync(pth);
  // fs.readdir(pth, function (err, files) {
  //handling error
  // if (err) {
  //   return console.log("Unable to scan directory: " + err);
  // }
  //listing all files using forEach
  files.forEach(function (file) {
    //check if file is a folder and that they want recursion
    if (fs.lstatSync(pth + "/" + file).isDirectory() && recursive) {
      main(pth + "/" + file);
    } else {
      //check if valid file extension
      let lastPeriodPosition = file.lastIndexOf(".");
      let ext = file.slice(lastPeriodPosition + 1).toLocaleLowerCase();
      //only include if valid extension
      if (importThese.includes(ext)) {
        //create key for folder in data object

        let len = file.length;
        // Convert name to var
        let validVarName, validPathKeyName, filenameWithoutExt;

        //find extension and remove

        validVarName = file.slice(0, len - (len - lastPeriodPosition));
        filenameWithoutExt = validVarName;

        validVarName = validVarNameMaker(validVarName);
        validPathKeyName = validVarNameMaker(pth);

        imports += `import ${validVarName} from '${pth}/${file}'\n`;

        data += `{img: ${validVarName},\n name: "${filenameWithoutExt}", folder: "${pth}"},\n`;
      }
    }
  });

  // });
}

main(path);

function validVarNameMaker(str) {
  //replace forbidden chars with underscore
  for (let i = 0; i < str.length; i++) {
    if (forbidden.includes(str[i])) {
      str = str.replaceAtIndex(i, "_");
    }
  }
  str = "_" + str;
  return str;
}

output += `${imports}\n\nconst data = [\n${data}\n]\nexport default data;`;

fs.writeFile("imgImports.js", output, function (err) {
  if (err) return console.log(err);
  console.log("imgImports.js has been created.");
});
