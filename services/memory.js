const fs = require("fs");

const memoryFile = "./memory.json";

function openMemory() {
  return new Promise((resolve, reject) => {
    fs.readFile(memoryFile, "utf-8", (err, data) => {
      if (err) reject(err);
      resolve(JSON.parse(data));
    });
  });
}

function remember(information) {
  return new Promise((resolve, reject) => {
    openMemory.then(memory => {
      // Add new information to object
      const newMemory = Object.assign(information, memory);

      // Stringify object then save back to log file
      fs.writeFile("./log.json", JSON.stringify(newMemory), "utf8", function(
        err
      ) {
        if (err) reject(err);
        resolve();
      });
    });
  });
}

function recall(key) {
  return new Promise((resolve, reject) => {
    openMemory.then(memory => {
      if (memory.hasOwnProperty(key)) {
        resolve(memory.key);
      } else {
        reject("Key not found in memory.");
      }
    });
  });
}

module.exports.remember = remember;
module.exports.recall = recall;
