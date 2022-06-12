import { readFile } from "fs/promises";
import { createHash } from "crypto";

const getContent = async (file) => {
  return readFile(file, "utf-8")
      .then(res => res)
}

export const calculate_hash = async (pathToFile) => {
    const data = await getContent(pathToFile)
    const hash = await createHash('sha256');
    console.log(hash.update(data).digest('hex'));
};