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
    console.log(`Welcome to the File Manager, ${this._userName}!\n`)
    process.chdir(homedir())
    this._currentDirectory = process.cwd()
    this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
    this._readLine.prompt()
    this._readLine
        .on('line', (line) => {
          const parse = line.split(' ')
          this._command = parse[0];
          this._arguments = parse[1];
          this.findCommand()
    })
        .on('close', () => {
      console.log(`Thank you for using File Manager, ${this._userName}!`)
      process.exit()
    })
  }

  findCommand() {
    if (!this[this._command]) {
      console.log('Invalid input');
      this._readLine.prompt();
    } else {
      this[this._command]()
      this._readLine.prompt()
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
         else console.log(file.name)
       })
     })
  }
//not complete
  cd() {
    try {
      this._currentDirectory = path_resolver(this._currentDirectory, this._arguments)
      process.chdir(this._currentDirectory)
      this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
    } catch (e) {
      console.log(e.message)
    }
  }
//operation with files
  cat() {
    const pathToFile = join(this._currentDirectory, this._arguments)
    if(!existsSync(pathToFile)) {
      console.log('Operation failed')
      this._readLine.prompt()
    } else {
      read_file(pathToFile)
    }
  }

  add() {
    open(join(this._currentDirectory, this._arguments), 'a', (err) => {
      if (err) {
        throw new Error("");
      }
    });
  }

  rm() {
    rm(join(this._currentDirectory, this._arguments), (err) => {
      return err;
    })
  }

 //Operating system
  os() {
    try {
      console.dir(os_informator(this._arguments))
      this._readLine.prompt()
    } catch (e) {
      console.log(e.message)
      this._readLine.prompt()
    }
  }

  hash() {
    const pathToFile = join(this._currentDirectory, this._arguments);
    calculate_hash(pathToFile)
        .then(() => {
          this._readLine.prompt()
        })
        .catch(() => {
          this._readLine.prompt()
        })
  }
}