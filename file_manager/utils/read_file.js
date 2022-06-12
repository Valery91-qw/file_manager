import {readFile} from "fs";

export function read_file(pathToFile) {
  return readFile(pathToFile, {encoding: "utf8"} ,(err, data) => {
    if(err) return err;
    console.log(data);
  })
}