import {map, words, encode, encodeChar, compile} from "./encode.mjs"

let missing = ""

for (let letter of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\()[]{}!@#$%^&*_-+=|:;<>,.?/'\"`~") {
  if (!(letter in map))
    missing += letter
}
console.log(missing)

for (const [key, value] of Object.entries(map)) {
  let actual = eval(value)
  if (actual !== key)
    console.error(`The char code for '${key}' is wrong! It evaluated to ${actual}.`)
}
for (const [key, value] of Object.entries(words)) {
  let actual = eval(value)
  if (actual !== key)
    console.error(`The word code for '${key}' is wrong! It evaluated to ${actual}.`)
}


const perf = chars => {
  let cum = 0
  for (let char of chars)
    cum += encodeChar(char).length
  return cum / chars.length
}

let mapPerf = 0
for (const [key, value] of Object.entries(map))
  mapPerf += value.length

mapPerf /= Object.entries(map).length
console.log(`There are ${Object.entries(map).length} mapped characters. Average code length is ${Math.round(mapPerf)}.`)
let missingPerf = perf(missing)
console.log(`There are ${missing.length} unmapped characters. Average code length is ${Math.round(missingPerf)}.`)




const code = compile('console.log("Hello world!");')
// console.log(code)

console.log("Hello world length: " + code.length)
eval(code)