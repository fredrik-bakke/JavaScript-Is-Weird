/**
 * This module provides functions for encoding arbitrary JavaScript code into an
 * equivalent program only using the characters of the brainfuck language
 * []+-,.<>
 */


const map = { 'char': {}, 'word': {}, 'number': {} }
const map_number = map["number"]


const register = (input, val = undefined) => {
  let res = eval(input)
  if (input.includes(' ')) throw new Error(`Coding '${input}' contains spaces.`)

  if (val === undefined) { val = res }

  if ((val !== res || typeof val !== typeof res) && !(isNaN(val) && isNaN(res)))
    throw new Error(`Resulting value ${res} of type ${typeof res} is not equivalent to expected value ${val} of type ${typeof val}.`);

  let type = typeof res
  if (type === "string") { type = res.length === 1 ? "char" : "word" }

  if (!(type in map)) map[type] = {}

  // Check that the replacement is not worse
  if (res in map[type] && map[type][res].length <= input.length)
    throw new Error(`Tried to overwrite entry for '${res}' of type ${type} with '${input}' (${input.length} chars) when the current entry '${map[type][res]}' (${map[type][res].length} chars) is at least as good.`);

  map[type][res] = input
}

const get = (val) => {
  let type = typeof val
  if (type === "string") { type = val.length === 1 ? "char" : "word" }
  return (val in map[type]) ? map[type][val] : undefined
}

/** Effectively parenthesizes the expression @param expr using only the characters `[]+` */
const parenthesize = (expr) => `[${expr}][+[]]`

// undefined
register('[][[]]', undefined)
register('[]+[][[]]', 'undefined')

// booleans
register('[]<[]', false)
register('[]<[,,]', true)
register('[]+[[]<[]]', 'false')
register('[]+[[]<[,,]]', 'true')
register('[[]<[]]+[[]<[]]', 'falsefalse')
register('[[]<[,,]]+[[]<[,,]]', 'truetrue')
register('[[]<[]]+[[]<[,,]]', 'falsetrue')
register('[[]<[]]+-[]', 'false0')
register('[,,,,,]+-[]', ',,,,0')

// numbers
register('+[,,]', NaN)
register('[]+-[,,]', 'NaN')
register('+[]', 0)
register('++[[]][+[]]', 1)
register('--[[]][+[]]', -1)
register('--[[]][+[]]+[]', '-1')
register('++[[]][+[]]+[]', '1')
register(`++[[]<[,,]][+[]]`, 2)
register(`++[[]<[,,]][+[]]+[]`, '2')
register(`-++[[]<[,,]][+[]]`, -2)
register(`++[++[[]<[,,]][+[]]][+[]]`, 3)
register(`--[--[--[[]][+[]]][+[]]][+[]]`, -3)
register('++[[]<[,,]][+[]]<<++[[]][+[]]', 4)
register('++[[]][+[]]+[+[]]>>++[[]][+[]]', 5)
register('++[++[[]][+[]]+[+[]]>>++[[]][+[]]][+[]]', 6)
register('++[[]][+[]]+[+[]]-++[++[[]<[,,]][+[]]][+[]]', 7)
register('[++[[]][+[]]]+-[]-++[[]<[,,]][+[]]', 8)
register('--[[++[[]][+[]]]+-[]][+[]]', 9)
register('[++[[]][+[]]]+-[]', '10')
register('++[[++[[]][+[]]]+-[]][+[]]', 11)
register('++[[]][+[]]+[++[[]][+[]]]', '11')
register('++[++[[]<[,,]][+[]]+[+[]]][+[]]', 21)

register('[]+-[]', '0')
register('[+[]]+-[]', '00')
register('[+[]]+-[]+-[]', '000')

/******************************* NUMBER METHODS *******************************/

function encode_number_unary(n) {
  if (n === 0) return map_number[0]
  if (n === 1) return map_number[1]
  if (n === 2) return map_number[2]
  if (n === -1) return map_number[-1]
  if (n < -1) return `-${encode_number_unary(-n)}`
  return `++[${encode_number_unary(n - 1)}][+[]]`
}

function encode_number_anytype(n) {
  if (n < 10) return map_number[n]

  const digits = n + []
  let s = `${map_number[digits[0]]}`

  if (digits.length === 1) return s

  if (digits[0] == 5 || digits[0] == 4 || digits[1] == 0)
    s = `[${s}]`

  for (let i = 1; i < digits.length; i++) {
    let digit = digits[i]
    if (digit == 0) s += '+-[]'
    else s += `+[${map_number[+digit]}]`
  }
  return s
}

// for (let i = 0; i <= 1000; i++) {
//   const x = encode_number_anytype(i)
//   console.log(i, eval(x), typeof eval(x), x.length, x)
// }

function encode_number(n) {
  if (n < 10) return map_number[n]
  return `+[${encode_number_anytype(n)}]`
}


/****************************** CHARACTER METHODS *****************************/

function encode_char(x) {
  if (x in map['char'])
    return map['char'][x]
  const charcode = x.charCodeAt(0)
  // TODO: find way to avoid `()` here
  // ! WARN: if the characters below are not registered in time this method will loop indefinitely
  return `[[]+[]][+[]][${encode_chars("constructor")}][${encode_chars("fromCharCode")}](${encode_number_anytype(charcode)})`
}

function encode_chars(chars) {
  let s = []
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i]
    let encoding = encode_char(c)
    if (encoding[0] === '+' && s.length > 0) encoding = `[${encoding}]`
    s.push(encoding)
  }
  return s.join("+")
}

function pad_nonstring(length) {
  if (length === 0) return '[]'
  if (length < 5) return `[${','.repeat(length + 1)}]`
  else return `[${','.repeat(length - 5)}[]<[]]`
}

/******************************** WORD METHODS ********************************/

function check_words(str, pos) {
  for (const [key, value] of Object.entries(map['word']))
    if (str.startsWith(key, pos))
      return { word: key, wordCode: value }
  return null
}

function encode(input) {
  if (typeof input === 'number') {
    encode_number(input)
  }
  if (typeof input === 'function') {
    return encode_function(input.name)
  }
  else {
    const tokens = []
    for (let i = 0; i < input.length; i++) {
      let pair = check_words(input, i)
      if (pair !== null) {
        tokens.push(pair.wordCode)
        i += pair.word.length - 1
      }
      else
        tokens.push(encode_char(input[i]))
    }
    return tokens.join('+')
  }
}

/****************************** FUNCTION METHODS ******************************/

function encode_function(function_name) {
  return `[][${encode_chars(function_name)}]`
}

/****************************** MORE REGISTRATION *****************************/
// object
register('[]')
register('[]+[]')

// comma
register('[]+[,,]', ',')

// characters
register(`[${get('NaN')}][${get(0)}][${get(0)}]`, 'N')
register(`[${get('NaN')}][${get(0)}][${get(1)}]`, 'a')

register(`[${get('false')}][${get(0)}][${get(0)}]`, 'f')
register(`[${get('false')}][${get(0)}][${get(2)}]`, 'l')
register(`[${pad_nonstring(7)}+[[]<[]]][${get(0)}][${encode_number_anytype(10)}]`, 's')

register(`[${get('true')}][${get(0)}][${get(0)}]`, 't')
register(`[${get('true')}][${get(0)}][${get(1)}]`, 'r')
register(`[${get('undefined')}][${get(0)}][${get(0)}]`, 'u')
register(`[${get('undefined')}][${get(0)}][${get(1)}]`, 'n')
register(`[${get('undefined')}][${get(0)}][${get(2)}]`, 'd')
register(`[${pad_nonstring(3)}+[][[]]][${get(0)}][${encode_number_anytype(10)}]`, 'e')
register(`[${pad_nonstring(5)}+[][[]]][${get(0)}][${encode_number_anytype(10)}]`, 'i')
register(`[${get('-1')}][${get(0)}][${get(0)}]`, '-')

register(`[+[++[[]][+[]]+${get('e')}+[${get('1')}][+[]]+-[]+-[]][+[]]+[]][+[]][${get(2)}]`, '+')
register(`[+[${encode_number_anytype(11)}+${get('e')}+${encode_number_anytype(20)}]+[]][+[]][${get(1)}]`, '.')


// Infinity
register(`+[++[[]][+[]]+${get('e')}+[${get('1')}][+[]]+-[]+-[]+-[]][+[]]`, Infinity)
register(`${get(Infinity)}+[]`, 'Infinity')

register(`-[++[[]][+[]]+${get('e')}+[${get('1')}][+[]]+-[]+-[]+-[]][+[]]`, -Infinity)

register(`[${get('Infinity')}][${get(0)}][${get(0)}]`, 'I')
register(`[${pad_nonstring(2)}+${get(-Infinity)}][${get(0)}][${encode_number_anytype(10)}]`, 'y')

register(encode_function('at'))
register(`[]+${encode_function('at')}`)
register(`[${pad_nonstring(4)}+${encode_function('at')}][+[]][${encode_number_anytype(10)}]`, 'o')
register(`[${pad_nonstring(7)}+${encode_function('at')}][+[]][${encode_number_anytype(10)}]`, 'c')
register(`[[]+${encode_function('at')}][+[]][${encode_number_anytype(11)}]`, '(')
register(`[[]+${encode_function('at')}][+[]][${encode_number_anytype(12)}]`, ')')
register(`[${pad_nonstring(6)}+${encode_function('at')}][+[]][${encode_number_anytype(20)}]`, '{')
// ! The following are platform dependent and do not work in firefox
register(`[${pad_nonstring(2)}+${encode_function('at')}][+[]][${encode_number_anytype(10)}]`, ' ')
register(`[${pad_nonstring(4)}+${encode_function('at')}][+[]][${encode_number_anytype(20)}]`, '[')
register(`[[]+${encode_function('at')}][+[]][${encode_number_anytype(21)}]`, 'v')
register(`[${pad_nonstring(2)}+${encode_function('at')}][+[]][${encode_number_anytype(30)}]`, ']')
register(`[[]+${encode_function('at')}][+[]][${encode_number_anytype(30)}]`, '}')

register(`[[]+[+[]][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(11)}]`, 'm')
register(`[[]+[+[]][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(12)}]`, 'b')
register(`[+[]+[][${encode_chars("constructor")}]][+[]][${encode_number_anytype(10)}]`, 'A')
register(`[+[]+[[]<[]][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(10)}]`, 'B')
register(`[+[]+[[]+[]][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(10)}]`, 'S')
register(`[${pad_nonstring(6)}+[[]+[]][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(20)}]`, 'g')
register(`[+[]+[${encode_function('at')}][+[]][${encode_chars("constructor")}]][+[]][${encode_number_anytype(10)}]`, 'F')
register(`[][${encode_chars("constructor")}][${encode_chars("name")}]`, 'Array')
register(`[[]<[]][+[]][${encode_chars("constructor")}][${encode_chars("name")}]`, 'Boolean')
register(`[${encode_function('at')}][+[]][${encode_chars("constructor")}][${encode_chars("name")}]`, 'Function')
register(`[+[]][+[]][${encode_chars("constructor")}][${encode_chars("name")}]`, 'Number')
register(`[[]+[]][+[]][${encode_chars("constructor")}][${encode_chars("name")}]`, 'String')

// map['j'] = `([]+{})[${ encodeNumberUnstable(10) }]`
// map['O'] = `(+{}+{})[${ encodeNumberUnstable(11) }]`

// //function RegExp() { [native code] }
// words["RegExp"] = `/!/[${encode("constructor")}][${encode("name")}]`
// map['R'] = `(+[]+/!/[${encode("constructor")}])[${encodeNumberUnstable(10)}]`
// map['E'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(12)}]`

// map['\\'] = `([]+/\\\\/)[${encodeNumberUnstable(1)}]`
// map['/'] = `([]+/!/)[${encodeNumberUnstable(0)}]`
// map['!'] = `([]+/!/)[${encodeNumberUnstable(1)}]`
// map['='] = `([]+/=/)[${encodeNumberUnstable(1)}]`
// map['>'] = `([]+/>/)[${encodeNumberUnstable(1)}]`

// ! The below all use parentheses `()` to invoke a function
if (false) {
  register(`[${encode_number(101)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(21)})[${encode_number(1)}]`, 'h')
  register(`[${encode_number(101)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(21)})`)
  register(`[${encode_number(19)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(20)})`, 'j')
  register(`[${encode_number(20)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(21)})`, 'k')
  register(`[${encode_number(25)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(30)})`, 'p')
  register(`[${encode_number(26)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(30)})`, 'q')
  // register(`(${encode_number(31)})[${encode_chars("to")}+${get("String")}](${encode_number_anytype(32)})`, 'v')
  register(`[${encode_number(35)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(36)})`, 'z')
  register(`[${encode_number(33)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(35)})`, 'x')
  register(`[${encode_number(32)}][+[]][${encode_chars("to")}+${get("String")}](${encode_number_anytype(33)})`, 'w')
}
// map['%'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['!']})[${encodeNumberUnstable(0)}]`
// map['C'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']})[${encodeNumberUnstable(2)}]`

// map['D'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()({})[${encodeNumberUnstable(20)}]`
// map['G'] = `(![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['M'] = `(!![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['T'] = `(+{}+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['U'] = `(+{}+[][${encode("entries")}]()[${encode("toString")}][${encode("call")}]())[${encodeNumberUnstable(11)}]`

// map['"'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(12)}]`
// map[';'] = `([]+[])[${encode("fontcolor")}](+{}+${map['"']})[${encodeNumberUnstable(21)}]`
// map['&'] = `([]+[])[${encode("fontcolor")}](${map['"']})[${encodeNumberUnstable(13)}]`
// map['q'] = `([]+[])[${encode("fontcolor")}]([+[]]+![]+${map['"']})[${encodeNumberUnstable(20)}]`

// map['<'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(0)}]`
// map['?'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(2)}]`
// map[':'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(3)}]`

// Symbols in alphabet
const _alphabet = [];
for (const [_, submap] of Object.entries(map)) {
  for (const [_, encoding] of Object.entries(submap)) {
    for (let i = 0; i < encoding.length; i++) {
      const chr = encoding[i]
      if (!_alphabet.includes(chr))
        _alphabet.push(chr)
    }
  }
}
const alphabet = _alphabet.sort().join("");

function made_of_alphabet(str, alphabet) {
  /** Checks if @param str is made from characters in @param alphabet. */
  for (let char of str)
    if (!alphabet.includes(char))
      return false;
  return true;
}

const compile = code => made_of_alphabet(code, alphabet) ? code : `${encode_function('at')}[${encode_chars('constructor')}](${encode(code)})()`


console.log(map)

/** Compute statistics */
let cum = 0
let encoding_lengths = []
for (const [_, submap] of Object.entries(map)) {
  for (const [_, encoding] of Object.entries(submap)) {
    cum += encoding.length
    encoding_lengths.push(encoding.length)
  }
}

function median(arr) {
  if (!arr.length) return undefined;
  const s = [...arr].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : ((s[mid - 1] + s[mid]) / 2);
};

console.log("Average encoding length:", cum / encoding_lengths.length)
console.log("Median encoding length:", median(encoding_lengths))
console.log("Number of entries:", encoding_lengths.length)
console.log("Number of characters:", Object.entries(map.char).length)
console.log("Characters:", Object.keys(map.char).sort().join(''))
console.log("Alphabet:", alphabet)


export { register, get, alphabet, compile }
