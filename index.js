#!/usr/bin/env node
const path = process.argv[2] || null;
const fs = require("fs");

String.prototype.replaceAtIndex = function (_index, _newValue) {
  return (
    this.substr(0, _index) + _newValue + this.substr(_index + _newValue.length)
  );
};

if (!path) {
  console.log(
    "You didnt add a path. Try again and add the path name. For example: node importer /Users/me/dev/project2/src/assets/img"
  );
  process.exit();
}

let output = "";
let data = "";
let forbidden = ["-", " ", "", "."];
fs.readdir(path, function (err, files) {
  //handling error
  if (err) {
    return console.log("Unable to scan directory: " + err);
  }
  //listing all files using forEach
  files.forEach(function (file) {
    let len = file.length;
    // Convert name to var
    let validVarName, filenameWithoutExt;

    //find extension and remove
    let lastPeriodPosition = file.lastIndexOf(".");
    validVarName = file.slice(0, len - (len - lastPeriodPosition));
    filenameWithoutExt = validVarName;

    //remove spaces or dashes
    for (let i = 0; i < validVarName.length; i++) {
      if (forbidden.includes(validVarName[i])) {
        validVarName = validVarName.replaceAtIndex(i, "_");
      }
    }
    validVarName = "_" + validVarName;
    // console.log(validVarName);

    output += `import ${validVarName} from '${path}/${file}'\n`;

    data += `{img: ${validVarName},\n name: "${filenameWithoutExt}"},\n`;
  });

  output += `\n\nconst data = [\n${data}\n]\nexport default data;`;

  fs.writeFile("imgImports.js", output, function (err) {
    if (err) return console.log(err);
    console.log("Hello World > helloworld.txt");
  });
});
