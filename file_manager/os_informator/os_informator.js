import { EOL , cpus , homedir, userInfo, arch } from 'os'

export function os_informator(arg) {
  switch (arg) {
    case "--EOL":
      return EOL;
    case "--cpus":
      return {
        total_amount: cpus().length,
        models: cpus().map(el => el.model)
      }
    case "--homedir":
      return homedir()
    case "--username":
      return userInfo({encoding: "utf8"} ).username
    case "--architecture":
      return arch()
    default:
      throw new Error("Invalid input")
  }
}