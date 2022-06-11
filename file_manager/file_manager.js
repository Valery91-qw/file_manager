import {createInterface} from 'readline';
import { homedir } from 'os'
import { sep, resolve } from 'path'
import { readdir } from 'fs'

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
    this._userName = this.parseArgs();
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
    this[this._command]()
    this._readLine.prompt()
  }

  ['.end']() {
    this._readLine.close()
  }

  up() {
    if(!this._currentDirectory.includes(sep)) {
      return;
    }
    const dir = this._currentDirectory.split(sep).slice(0, -1).join(sep);
    this._currentDirectory = dir;
    process.chdir(dir)
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
    process.chdir(resolve(this._currentDirectory, this._arguments))
    this._currentDirectory = resolve(this._currentDirectory, this._arguments)
    this._readLine.setPrompt(`You are currently in ${this._currentDirectory}\n`)
  }

  parseArgs() {
    const parsArs = process.argv.slice(2);
    for (let i = 0; i <= parsArs.length; i++) {
      if(parsArs[i].includes('--')) {
        const divideKeyValue = parsArs[i].split('=')
        return divideKeyValue[1];
      }
    }
  }
}