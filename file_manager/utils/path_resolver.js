import { isAbsolute, join, normalize } from 'path'

export function path_resolver(cur, dest) {
    let path;
    if(!isAbsolute(dest)) path = join(cur, dest)
    else path = normalize(dest);
    return path;
}