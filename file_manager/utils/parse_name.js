export function parse_name(args) {
  const parsArs = args.slice(2);
  for (let i = 0; i <= parsArs.length; i++) {
    if(parsArs[i].includes('--')) {
      const divideKeyValue = parsArs[i].split('=')
      return divideKeyValue[1];
    }
  }
}