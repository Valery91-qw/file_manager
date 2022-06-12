import {createInterface} from 'readline';
import { homedir } from 'os'
import { sep, join } from 'path'
import { readdir, existsSync , open, rm} from 'fs'
import {path_resolver} from "./utils/path_resolver.js";
import {parse_name} from "./utils/parse_name.js";
import {os_informator} from "./os_informator/os_informator.js";
import {calculate_hash} from "./utils/calc_hash.js";
import {up_the_tree} from "./constants.js";
import {read_file} from "./utils/read_file.js";

export class File_manager {
  _userName;
  _readLine;
  _currentDirectory;
  _command;
  _arguments;

  constructor() {
    this._readLine = createInterface({
      input: process.stdin,
      output: process.stdout,
    })
  }

  start() {
    this._userName = parse_name(process.argv);
    process.chdir(homedir())
    this._currentDirectory = process.cwd()
    console.log(`Welcome to the File Manager, ${this._userName}!\n`)
    this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
    this._readLine.prompt()
    this._readLine
        .on('line', (line) => {
          const parse = line.split(' ')
          this._command = parse.splice(0, 1);
          this._arguments = parse;
          this.findCommand()
    })
        .on('close', () => {
      console.log(`Thank you for using File Manager, ${this._userName}!`)
      process.exit()
    })
  }

  findCommand() {
    try {
      this[this._command]()
      this._readLine.prompt()
    } catch (e) {
      console.log('Operation failed');
      this._readLine.prompt();
    }
  }

  ['.end']() {
    this._readLine.close()
  }

  up() {
    this._currentDirectory = path_resolver(this._currentDirectory, up_the_tree)
    process.chdir(this._currentDirectory)
    this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
  }

  ls() {
     readdir(this._currentDirectory, {withFileTypes: true}, (err, files) => {
       if(err) return;
       files.forEach(file => {
         if(file.isDirectory()) console.log(`${file.name}${sep}`)
         else {
           console.log(file.name);
         }
       })
       this._readLine.prompt()
     })
  }

  cd() {
    try {
      this._currentDirectory = path_resolver(this._currentDirectory, this._arguments[0])
      process.chdir(this._currentDirectory)
      this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
    } catch (e) {
      console.warn("Invalid input")
    }
  }

  cat() {
    try {
      const pathToFile = join(this._currentDirectory, this._arguments[0])
      if(!existsSync(pathToFile)) throw new Error();
      read_file(pathToFile)
    } catch (e) {
      console.log('Invalid input')
      this._readLine.prompt()
    }
  }

  add() {
    try {
      open(join(this._currentDirectory, this._arguments[0]), 'a', (err) => {
        if (err) {
          throw new Error("");
        }
      });
    } catch (e) {
      console.log('Invalid input')
      this._readLine.prompt()
    }
  }

  rm() {
    try {
      rm(join(this._currentDirectory, this._arguments[0]), (err) => {
        return err;
      })
    } catch (e) {
      console.log('Invalid input')
      this._readLine.prompt()
    }
  }

 //Operating system
  os() {
    try {
      console.dir(os_informator(this._arguments[0]))
      this._readLine.prompt()
    } catch (e) {
      console.log(e.message)
      this._readLine.prompt()
    }
  }

  hash() {
    const pathToFile = join(this._currentDirectory, this._arguments[0]);
    calculate_hash(pathToFile)
        .then(() => {
          this._readLine.prompt()
        })
        .catch(() => {
          this._readLine.prompt()
        })
  }
}