const zero = "+[]"
const one = "+!![]"

const unaryNumber = n => {
  if (n == 0) return zero
  if (n == 1) return one
  return Array.from({ length: n }, () => "!![]").join('+')
}

const listNumber = n => {
  let s = []
  for (let digit of n + [])
    s.push(unaryNumber(digit))
  return "[" + s.join("]+[") + "]"
}

function strNumber(n) {
  let s = []
  for (let digit of n + [])
    s.push(unaryNumber(digit))

  return s[0] + "+[" + s.slice(1).join("]+[") + "]"
}

// Use when the type needs to be Number
function number(n) {
  let s = []
  for (let digit of n + [])
    s.push(unaryNumber(digit))

  if (s.length == 1)
    return s[0]
  else
    return "+(" + s[0] + "+[" + s.slice(1).join("]+[") + "]" + ")"
}

function sNumber(n) {
  let s = []
  for (let digit of n + [])
    s.push(unaryNumber(digit))

  if (s.length == 1)
    return s[0]
  else
    return s[0] + "+[" + s.slice(1).join("]+[") + "]"
}

const map = {}
const words = {} // For strings of connected characters

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
  return `''[${encodeChars("constructor")}][${encodeChars("fromCharCode")}](${sNumber(charCode)})`
}
const encodeChars = s => s.split("").map(encodeChar).join("+")

map['\''] = `"'"`
map['\\'] = `'\\\\'`
for (let c of '"` /()[]{}+-*=?!.,^$|_~&@<>#%:;§')
  map[c] = `'${c}'`

const alphanumeric = /^[\p{L}\p{N}]*$/u;



const encode = s => {
  const tokens = []
  for (let i = 0; i < s.length; i++) {
    let pair = checkWords(s, i)
    if (pair !== null) {
      tokens.push(pair.wordCode)
      i += pair.word.length - 1
    }
    else if (!alphanumeric.test(s[i])) {
      let j = i
      for (; j < s.length && !alphanumeric.test(s[j]); j++);
      tokens.push(`'${s.slice(i, j).replace('\\', '\\\\').replace("'", "\\'")}'`) //TODO: optimize ' vs "
      i = j - 1
    }
    else
      tokens.push(encodeChar(s[i]))
  }
  return tokens.join('+')
}

for (let i = 0; i < 10; i++)
  map[i + []] = strNumber(i)



//[object Object]//console.log({}+[])
map.o = `([]+{})[${sNumber(1)}]`
map.b = `([]+{})[${sNumber(2)}]`
map.j = `([]+{})[${sNumber(10)}]`
map.c = `(![]+{})[${sNumber(10)}]`
map.O = `('!!'+{})[${sNumber(10)}]`
map.e = `([]+{})[${sNumber(11)}]`

words["false"] = "![]+[]"
map.f = `([]+![])[${sNumber(0)}]`
map.a = `([]+![])[${sNumber(1)}]`
map.l = `([]+![])[${sNumber(2)}]`
map.s = `([]+![])[${sNumber(3)}]`
words["true"] = "!![]+[]"
map.t = `([]+!![])[${sNumber(0)}]`
map.r = `([]+!![])[${sNumber(1)}]`

words["NaN"] = "+{}+[]"
map.N = `(+{}+[])[${sNumber(0)}]`
words["Infinity"] = "!![]/[]+[]"
map.I = `(!![]/[]+[])[${sNumber(0)}]`
map.y = `(+{}+[!![]/[]])[${sNumber(10)}]`
words["undefined"] = "[]+[][[]]"
map.u = `([]+[][[]])[${sNumber(0)}]`
map.n = `([]+[][[]])[${sNumber(1)}]`
map.d = `([]+[][[]])[${sNumber(2)}]`
map.i = `([![]]+[][[]])[${sNumber(10)}]`


map.m = `([]+(+[])[${encode("constructor")}])[${sNumber(11)}]`
map.A = `(+[]+[][${encode("constructor")}])[${sNumber(10)}]`
map.B = `(+[]+(![])[${encode("constructor")}])[${sNumber(10)}]`

map.F = `(+[]+(()=>{})[${encode("constructor")}])[${sNumber(10)}]`
// map.v = `([]+[][${encode("flat")}])[${sNumber(23)}]` //this code is platform dependent (does not work in firefox)



words["String"] = `''[${encode("constructor")}][${encode("name")}]`
map.S = `(+[]+''[${encode("constructor")}])[${sNumber(10)}]`
//function RegExp() { [native code] }
words["RegExp"] = `/!/[${encode("constructor")}][${encode("name")}]`
map.R = `(+[]+/!/[${encode("constructor")}])[${sNumber(10)}]`
map.g = `([]+/!/[${encode("constructor")}])[${sNumber(11)}]`
map.E = `([]+/!/[${encode("constructor")}])[${sNumber(12)}]`
map.x = `([]+/!/[${encode("constructor")}])[${sNumber(13)}]`
map.p = `('!'+![]+/!/[${encode("constructor")}])[${sNumber(20)}]`


map.h = `(${number(101)})[${encode("toString")}](${sNumber(21)})[${sNumber(1)}]`
map.k = `(${number(20)})[${encode("toString")}](${sNumber(21)})`
map.v = `(${number(31)})[${encode("toString")}](${sNumber(32)})`
console.log(map.v.length)
console.log(eval("[[][[[]+[][+[]]][+[]][++[++[++[++[[]][+[]]][+[]]][+[]]][+[]]]+[[]+[][+[]]][+[]][++[++[++[++[++[[]][+[]]][+[]]][+[]]][+[]]][+[]]]+[[]+[][+[]]][+[]][++[[]][+[]]]+[[]+[][+[]]][+[]][++[++[[]][+[]]][+[]]]]+[]][+[]][+[[]+[++[++[[]][+[]]][+[]]][+[]]+[++[++[++[[]][+[]]][+[]]][+[]]][+[]]][+[]]]"))
map.w = `(${number(32)})[${encode("toString")}](${sNumber(33)})`
map.z = `(${number(35)})[${encode("toString")}](${sNumber(36)})`

map.C = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['<']})[${sNumber(2)}]`
// console.log(unescape('%0C%1C%2C%3C%4C%5C%6C%7C%8C%9C%AC%BC%CC%DC%EC%FC'))

map.D = `(()=>{})[${encode("constructor")}](${encode("return escape")})()({})[${sNumber(20)}]`
map.G = `(![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${sNumber(30)}]`
map.M = `(!![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${sNumber(30)}]`
map.T = `(+{}+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${sNumber(30)}]`
map.U = `('!!'+[][${encode("entries")}]()[${encode("toString")}][${encode("call")}]())[${sNumber(10)}]`


map.q = `''[${encode("fontcolor")}]('!'+![]+${map['"']})[${sNumber(20)}]`





const compile = code => `(()=>{})[${encode("constructor")}](${encode(code)})()`

export { encode, encodeChar, encodeChars, compile, map, words }