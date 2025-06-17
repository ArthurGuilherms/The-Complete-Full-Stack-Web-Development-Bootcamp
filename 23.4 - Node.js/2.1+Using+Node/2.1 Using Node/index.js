const fs = require("fs");

// Reading a file asynchronously
fs.readFile(
  "C:\\Users\\Arthur\\Desktop\\Estudos\\Curso Web Developer Full Stack\\23.4 - Using Node.js\\2.1+Using+Node\\2.1 Using Node\\output.txt",
  "utf8",
  (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return;
    }

    // Output the content of the file
    console.log(data);
  }
);
