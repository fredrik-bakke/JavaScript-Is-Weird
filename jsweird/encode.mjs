/**
 * This module provides functions for encoding arbitrary JavaScript code into an
 * extended version of the JSFuck dialect. While JSFuck only allows for the six
 * characters `!()+[]`, the extended dialect we permit consists of the
 * characters `!()+/=>[\]{}`.
 */


const zero = "+[]"
const one = "+!![]"

const encodeNumberUnary = n => {
  /** Unary jsfuck encoding of a non-negative number */
  if (n == 0) return zero
  if (n == 1) return one
  return Array.from({ length: n }, () => "!![]").join('+')
}

const encodeNumberList = n => {
  let s = []
  for (let digit of n + [])
    s.push(encodeNumberUnary(digit))
  return `[${s.join("]+[")}]`
}

function encodeNumber(n) {
  /** Use this method when the type needs to be `Number` */
  let s = []
  for (let digit of n + [])
    s.push(encodeNumberUnary(digit))

  if (s.length == 1)
    return s[0]
  else
    return `+(${s[0]}+[${s.slice(1).join("]+[")}])`
}

function encodeNumberString(n) {
  let s = []
  for (let digit of n + [])
    s.push(encodeNumberUnary(digit))

  return `${s[0]}+[${s.slice(1).join("]+[")}]`
}

function encodeNumberUnstable(n) {

  let s = []
  for (let digit of n + [])
    s.push(encodeNumberUnary(digit))

  if (s.length == 1)
    return s[0]
  else
    return `${s[0]}+[${s.slice(1).join("]+[")}]`
}

const map = {}

/** Map of encodings for special multicharacter strings */
const words = {}

function checkWords(str, pos) {
  for (const [key, value] of Object.entries(words))
    if (str.startsWith(key, pos))
      return { word: key, wordCode: value }
  return null
}
const encodeChar = x => {
  if (x in map)
    return map[x]
  const charCode = x.charCodeAt(0)
  return `([]+[])[${encodeChars("constructor")}][${encodeChars("fromCharCode")}](${encodeNumberUnstable(charCode)})`
}
const encodeChars = s => s.split("").map(encodeChar).join("+")


const encode = input => {
  if (typeof input === "number") {
    return encodeNumber(input)
  }
  else {
    const tokens = []
    for (let i = 0; i < input.length; i++) {
      let pair = checkWords(input, i)
      if (pair !== null) {
        tokens.push(pair.wordCode)
        i += pair.word.length - 1
      }
      else
        tokens.push(encodeChar(input[i]))
    }
    return tokens.join('+')
  }
}

for (let i = 0; i < 10; i++)
  map[i + []] = encodeNumberString(i)

//[object Object]//console.log({}+[])
map['['] = `([]+{})[${encodeNumberUnstable(0)}]`
map['o'] = `([]+{})[${encodeNumberUnstable(1)}]`
map['b'] = `([]+{})[${encodeNumberUnstable(2)}]`
map['j'] = `([]+{})[${encodeNumberUnstable(10)}]`
map['c'] = `(![]+{})[${encodeNumberUnstable(10)}]`
map[' '] = `(+{}+{})[${encodeNumberUnstable(10)}]`
map['O'] = `(+{}+{})[${encodeNumberUnstable(11)}]`
map[']'] = `([+[]]+![]+{})[${encodeNumberUnstable(20)}]`
map['e'] = `([]+{})[${encodeNumberUnstable(11)}]`

map['f'] = `([]+![])[${encodeNumberUnstable(0)}]`
map['a'] = `([]+![])[${encodeNumberUnstable(1)}]`
map['l'] = `([]+![])[${encodeNumberUnstable(2)}]`
map['s'] = `([]+![])[${encodeNumberUnstable(3)}]`

words["true"] = "!![]+[]"
map['t'] = `([]+!![])[${encodeNumberUnstable(0)}]`
map['r'] = `([]+!![])[${encodeNumberUnstable(1)}]`

words["NaN"] = "+{}+[]"
map['N'] = `(+{}+[])[${encodeNumberUnstable(0)}]`

words["Infinity"] = "!![]/[]+[]"
map['I'] = `(!![]/[]+[])[${encodeNumberUnstable(0)}]`
map['y'] = `(+{}+[!![]/[]])[${encodeNumberUnstable(10)}]`

words["undefined"] = "[]+[][[]]"
map['u'] = `([]+[][[]])[${encodeNumberUnstable(0)}]`
map['n'] = `([]+[][[]])[${encodeNumberUnstable(1)}]`
map['d'] = `([]+[][[]])[${encodeNumberUnstable(2)}]`
map['i'] = `([![]]+[][[]])[${encodeNumberUnstable(10)}]`

map['m'] = `([]+(+[])[${encode("constructor")}])[${encodeNumberUnstable(11)}]`
map['A'] = `(+[]+[][${encode("constructor")}])[${encodeNumberUnstable(10)}]`
map['B'] = `(+[]+(![])[${encode("constructor")}])[${encodeNumberUnstable(10)}]`

// map['F'] = `([]+[][${encode("flat")}][${encode("constructor")}])[${encodeNumberUnstable(9)}]`
map['F'] = `(+[]+(()=>{})[${encode("constructor")}])[${encodeNumberUnstable(10)}]`
// map['v'] = `([]+[][${encode("flat")}])[${encodeNumberUnstable(23)}]` //this code is platform dependent (does not work in firefox)


words["String"] = `([]+[])[${encode("constructor")}][${encode("name")}]`
map['S'] = `(+[]+([]+[])[${encode("constructor")}])[${encodeNumberUnstable(10)}]`
//function RegExp() { [native code] }
words["RegExp"] = `/!/[${encode("constructor")}][${encode("name")}]`
map['R'] = `(+[]+/!/[${encode("constructor")}])[${encodeNumberUnstable(10)}]`
map['g'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(11)}]`
map['E'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(12)}]`
map['x'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(13)}]`
map['p'] = `([+[]]+![]+/!/[${encode("constructor")}])[${encodeNumberUnstable(20)}]`

///\\\\/
map['\\'] = `([]+/\\\\/)[${encodeNumberUnstable(1)}]`
map['/'] = `([]+/!/)[${encodeNumberUnstable(0)}]`
map['!'] = `([]+/!/)[${encodeNumberUnstable(1)}]`
map['('] = `([]+/()/)[${encodeNumberUnstable(1)}]`
map[')'] = `([]+/()/)[${encodeNumberUnstable(2)}]`
map['{'] = `([]+/{/)[${encodeNumberUnstable(1)}]`
map['}'] = `([]+/}/)[${encodeNumberUnstable(1)}]`
map['='] = `([]+/=/)[${encodeNumberUnstable(1)}]`
map['>'] = `([]+/>/)[${encodeNumberUnstable(1)}]`

map['h'] = `(${encodeNumber(101)})[${encode("toString")}](${encodeNumberUnstable(21)})[${encodeNumberUnstable(1)}]`
map['k'] = `(${encodeNumber(20)})[${encode("toString")}](${encodeNumberUnstable(21)})`
map['v'] = `(${encodeNumber(31)})[${encode("toString")}](${encodeNumberUnstable(32)})`
map['w'] = `(${encodeNumber(32)})[${encode("toString")}](${encodeNumberUnstable(33)})`
map['z'] = `(${encodeNumber(35)})[${encode("toString")}](${encodeNumberUnstable(36)})`

map['%'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['!']})[${encodeNumberUnstable(0)}]`
map['C'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']})[${encodeNumberUnstable(2)}]`


map['D'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()({})[${encodeNumberUnstable(20)}]`
map['G'] = `(![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
map['M'] = `(!![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
map['T'] = `(+{}+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
map['U'] = `(+{}+[][${encode("entries")}]()[${encode("toString")}][${encode("call")}]())[${encodeNumberUnstable(11)}]`
// map['.'] = `(+(${encodeNumberUnstable(11)}+${map.e}+${encodeNumberList(20)})+[])[${encodeNumberUnstable(1)}]` // 69 characters, uses ()[]+!{}
map['.'] = `([]${encodeNumberUnstable(1)}/(${encodeNumberUnstable(2)}))[${encodeNumberUnstable(1)}]` // 28 characters, uses ()[]+!/

map['+'] = `(+(${encodeNumberUnstable(1)}+${map.e}+${encodeNumberList(21)})+[])[${encodeNumberUnstable(2)}]`
map['-'] = `(+(${encode('.')}+${encodeNumberList("0000001")})+[])[${encodeNumberUnstable(2)}]`


map['"'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(12)}]`
map[';'] = `([]+[])[${encode("fontcolor")}](+{}+${map['"']})[${encodeNumberUnstable(21)}]`
map['&'] = `([]+[])[${encode("fontcolor")}](${map['"']})[${encodeNumberUnstable(13)}]`
map['q'] = `([]+[])[${encode("fontcolor")}]([+[]]+![]+${map['"']})[${encodeNumberUnstable(20)}]`

map['<'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(0)}]`
map['?'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(2)}]`
map[':'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(3)}]`

map[','] = `[[]][${encode("concat")}]([[]])+[]`

// Symbols in alphabet
let alphabet = [];
for (const [_, value] of Object.entries(map)) {
  for (let chr of value)
    if (!alphabet.includes(chr))
      alphabet.push(chr)
}
alphabet.sort();

function madeOf(str, alphabet) {
  /** Checks if @param str is made from characters in @param alphabet. */
  for (let char of str)
    if (!alphabet.includes(char))
      return false;
  return true;
}

console.log(map)

const compile = code => madeOf(code, alphabet) ? code : `(()=>{})[${encode("constructor")}](${encode(code)})()`

export { encode, encodeChar, encodeChars, encodeNumber, compile, map, words, alphabet }
