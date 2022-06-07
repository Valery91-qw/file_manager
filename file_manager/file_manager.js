export class File_manager {
  _userName;

  constructor() {
  }

  start() {
    this._userName = this.parseArgs();
    console.log(`Welcome to the File Manager, ${this._userName}!`)
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