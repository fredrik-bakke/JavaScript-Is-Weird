/**
 * This module provides functions for encoding arbitrary JavaScript code into an
 * extended version of the JSFuck dialect. While JSFuck only allows for the six
 * characters `!()+[]`, the extended dialect we permit consists of the
 * characters `!()+/=>[\]{}*`.
 */

import { map_natural_number } from "./encode_numbers.mjs";


const map = { 'char': {}, 'word': {}, 'number': map_natural_number }



const register_encoding = (map, input, val = undefined) => {
  let res = eval(input)

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

const register_number_encoding = (map, input, val = undefined, depth = Infinity) => {
  register_encoding(map, input, val)
  let res = eval(input)
  depths[res] = depth
}

const get_encoding = (map, val) => {
  let type = typeof val
  if (type === "string") { type = val.length === 1 ? "char" : "word" }
  return map[type][val]
}

// undefined
register_encoding(map, '{}', undefined)
register_encoding(map, '[]+[][[]]', "undefined")
register_encoding(map, '[[]]')

console.log(map)

// booleans
register_encoding(map, '![]', false)
register_encoding(map, '!![]', true)
register_encoding(map, '![]+[]', "false")
register_encoding(map, '!![]+[]', "true")
register_encoding(map, '[![]]+![]', "falsefalse")

register_encoding(map, '+[]+[+[]]', "00")

register_number_encoding(map, '+{}', NaN)
register_encoding(map, '+{}+[]', "NaN")
register_number_encoding(map, "!![]/[]", Infinity)
register_encoding(map, "!![]/[]+[]", "Infinity")

// objects
register_encoding(map, '[]') // object ''
register_encoding(map, "[]+{}", "[object Object]")


// function checkWords(str, pos) {
//   for (const [key, value] of Object.entries(words))
//     if (str.startsWith(key, pos))
//       return { word: key, wordCode: value }
//   return null
// }
// const encodeChar = x => {
//   if (x in map)
//     return map[x]
//   const charCode = x.charCodeAt(0)
//   return `([] + [])[${ encodeChars("constructor") }][${ encodeChars("fromCharCode") }](${ encodeNumberUnstable(charCode) })`
// }
// const encodeChars = s => s.split("").map(encodeChar).join("+")


// const encode = input => {
//   if (typeof input === "number") {
//     return encodeNumber(input)
//   }
//   else {
//     const tokens = []
//     for (let i = 0; i < input.length; i++) {
//       let pair = checkWords(input, i)
//       if (pair !== null) {
//         tokens.push(pair.wordCode)
//         i += pair.word.length - 1
//       }
//       else
//         tokens.push(encodeChar(input[i]))
//     }
//     return tokens.join('+')
//   }
// }

// for (let i = 3; i < 10; i++)
//   register_encoding(map, encodeNumber(i), i)
// for (let i = 0; i < 10; i++)
//   register_encoding(map, encodeNumberString(i), i.toString())


if (false) {
  // Let's do a character search
  register_encoding(map, "[]+" + get_encoding(map, false) + '+' + get_encoding(map, true))
  // register_encoding(map, `(${ map["number"][3] }) * (${ map["number"][3] })`)
  // register_encoding(map, `(${ map["number"][2] }) * (${ map["number"][4] })`)
  // register_encoding(map, `(${ map["number"][2] }) ** (${ map["number"][3] })`)
  register_encoding(map, `${encodeNumber(10)} `)
  register_encoding(map, `${encodeNumber(11)} `)
  register_encoding(map, `${encodeNumber(12)} `)
  register_encoding(map, `${encodeNumber(13)} `)
  register_encoding(map, `${encodeNumber(14)} `)
  register_encoding(map, `${encodeNumber(15)} `)
  register_encoding(map, `${encodeNumber(16)} `)
  register_encoding(map, `${encodeNumber(17)} `)
  register_encoding(map, `${encodeNumber(18)} `)
  register_encoding(map, `${encodeNumber(19)} `)
  register_encoding(map, `${encodeNumber(10)}>> ${encodeNumber(1)} `)
  register_encoding(map, `${encodeNumber(12)}>> ${encodeNumber(1)} `)
  // register_encoding(map, `${ encodeNumber(14) }>> ${ encodeNumber(1) } `)
  register_encoding(map, `${encodeNumber(30)}>> ${encodeNumber(1)} `)
  register_encoding(map, `${encodeNumber(32)}>> ${encodeNumber(1)} `)
  register_encoding(map, `${encodeNumber(25)} `)
  register_encoding(map, `${encodeNumber(100)}>> ${encodeNumber(2)} `)
  // register_encoding(map, `${ encodeNumber(34) }>> ${ encodeNumber(1) } `)
  // register_encoding(map, `(${ map["number"][2] }) * (${ map["number"][3] })`)
}


// for (let word in map["words"])
//   for (let i = 0; i <

// map['['] = `([] + {})[${ encodeNumberUnstable(0) }]`
// map['o'] = `([] + {})[${ encodeNumberUnstable(1) }]`
// map['b'] = `([] + {})[${ encodeNumberUnstable(2) }]`
// map['j'] = `([] + {})[${ encodeNumberUnstable(10) }]`
// map['c'] = `(![] + {})[${ encodeNumberUnstable(10) }]`
// map[' '] = `(+{} + {})[${ encodeNumberUnstable(10) }]`
// map['O'] = `(+{} + {})[${ encodeNumberUnstable(11) }]`
// map[']'] = `([+[]] + ![] + {})[${ encodeNumberUnstable(20) }]`
// map['e'] = `([] + {})[${ encodeNumberUnstable(11) }]`

// words["false"] = "![]+[]"
// map['f'] = `([] + ![])[${ encodeNumberUnstable(0) }]`
// map['a'] = `([] + ![])[${ encodeNumberUnstable(1) }]`
// map['l'] = `([] + ![])[${ encodeNumberUnstable(2) }]`
// map['s'] = `([] + ![])[${ encodeNumberUnstable(3) }]`

// words["true"] = "!![]+[]"
// map['t'] = `([] + !![])[${ encodeNumberUnstable(0) }]`
// map['r'] = `([] + !![])[${ encodeNumberUnstable(1) }]`

// words["NaN"] = "+{}+[]"
// map['N'] = `(+{} + [])[${ encodeNumberUnstable(0) }]`

// words["Infinity"] = "!![]/[]+[]"
// map['I'] = `(!![] / [] + [])[${ encodeNumberUnstable(0) }]`
// map['y'] = `(+{} + [!![] / []])[${ encodeNumberUnstable(10) }]`

// words["undefined"] = "[]+[][[]]"
// map['u'] = `([] + [][[]])[${ encodeNumberUnstable(0) }]`
// map['n'] = `([] + [][[]])[${ encodeNumberUnstable(1) }]`
// map['d'] = `([] + [][[]])[${ encodeNumberUnstable(2) }]`
// map['i'] = `([![]] + [][[]])[${ encodeNumberUnstable(10) }]`

// map['m'] = `([] + (+[])[${ encode("constructor") }])[${ encodeNumberUnstable(11) }]`
// map['A'] = `(+[] + [][${ encode("constructor") }])[${ encodeNumberUnstable(10) }]`
// map['B'] = `(+[] + (![])[${ encode("constructor") }])[${ encodeNumberUnstable(10) }]`

// // map['F'] = `([] + [][${ encode("flat") }][${ encode("constructor") }])[${ encodeNumberUnstable(9) }]`
// map['F'] = `(+[] + (() => { })[${ encode("constructor") }])[${ encodeNumberUnstable(10) }]`
// // map['v'] = `([] + [][${ encode("flat") }])[${ encodeNumberUnstable(23) }]` //this code is platform dependent (does not work in firefox)


// words["String"] = `([] + [])[${ encode("constructor") }][${ encode("name") }]`
// map['S'] = `(+[] + ([] + [])[${ encode("constructor") }])[${ encodeNumberUnstable(10) }]`
// //function RegExp() { [native code] }
// words["RegExp"] = `/ !/[${encode("constructor")}][${encode("name")}]`
// map['R'] = `(+[]+/!/[${encode("constructor")}])[${encodeNumberUnstable(10)}]`
// map['g'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(11)}]`
// map['E'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(12)}]`
// map['x'] = `([]+/!/[${encode("constructor")}])[${encodeNumberUnstable(13)}]`
// map['p'] = `([+[]]+![]+/!/[${encode("constructor")}])[${encodeNumberUnstable(20)}]`

// ///\\\\/
// map['\\'] = `([]+/\\\\/)[${encodeNumberUnstable(1)}]`
// map['/'] = `([]+/!/)[${encodeNumberUnstable(0)}]`
// map['!'] = `([]+/!/)[${encodeNumberUnstable(1)}]`
// map['('] = `([]+/()/)[${encodeNumberUnstable(1)}]`
// map[')'] = `([]+/()/)[${encodeNumberUnstable(2)}]`
// map['{'] = `([]+/{/)[${encodeNumberUnstable(1)}]`
// map['}'] = `([]+/}/)[${encodeNumberUnstable(1)}]`
// map['='] = `([]+/=/)[${encodeNumberUnstable(1)}]`
// map['>'] = `([]+/>/)[${encodeNumberUnstable(1)}]`

// map['h'] = `(${encodeNumber(101)})[${encode("toString")}](${encodeNumberUnstable(21)})[${encodeNumberUnstable(1)}]`
// map['k'] = `(${encodeNumber(20)})[${encode("toString")}](${encodeNumberUnstable(21)})`
// map['v'] = `(${encodeNumber(31)})[${encode("toString")}](${encodeNumberUnstable(32)})`
// map['w'] = `(${encodeNumber(32)})[${encode("toString")}](${encodeNumberUnstable(33)})`
// map['z'] = `(${encodeNumber(35)})[${encode("toString")}](${encodeNumberUnstable(36)})`

// map['%'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['!']})[${encodeNumberUnstable(0)}]`
// map['C'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']})[${encodeNumberUnstable(2)}]`


// map['D'] = `(()=>{})[${encode("constructor")}](${encode("return escape")})()({})[${encodeNumberUnstable(20)}]`
// map['G'] = `(![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['M'] = `(!![]+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['T'] = `(+{}+(()=>{})[${encode("constructor")}](${encode("return Date")})()())[${encodeNumberUnstable(30)}]`
// map['U'] = `(+{}+[][${encode("entries")}]()[${encode("toString")}][${encode("call")}]())[${encodeNumberUnstable(11)}]`
// map['.'] = `(+(${encodeNumberUnstable(11)}+${map.e}+${encodeNumberList(20)})+[])[${encodeNumberUnstable(1)}]`
// map['+'] = `(+(${encodeNumberUnstable(1)}+${map.e}+${encodeNumberList(21)})+[])[${encodeNumberUnstable(2)}]`
// map['-'] = `(+(${encode('.')}+${encodeNumberList("0000001")})+[])[${encodeNumberUnstable(2)}]`


// map['"'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(12)}]`
// map[';'] = `([]+[])[${encode("fontcolor")}](+{}+${map['"']})[${encodeNumberUnstable(21)}]`
// map['&'] = `([]+[])[${encode("fontcolor")}](${map['"']})[${encodeNumberUnstable(13)}]`
// map['q'] = `([]+[])[${encode("fontcolor")}]([+[]]+![]+${map['"']})[${encodeNumberUnstable(20)}]`

// map['<'] = `([]+[])[${encode("fontcolor")}]()[${encodeNumberUnstable(0)}]`
// map['?'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(2)}]`
// map[':'] = `([]+/!/[${encode("constructor")}]())[${encodeNumberUnstable(3)}]`

// map[','] = `[[]][${encode("concat")}]([[]])+[]`

// // Symbols in alphabet
// let alphabet = [];
// for (const [_, value] of Object.entries(map)) {
//   for (let chr of value)
//     if (!alphabet.includes(chr))
//       alphabet.push(chr)
// }
// alphabet.sort();

// function madeOf(str, alphabet) {
//   /** Checks if @param str is made from characters in @param alphabet. */
//   for (let char of str)
//     if (!alphabet.includes(char))
//       return false;
//   return true;
// }

// const compile = code => madeOf(code, alphabet) ? code : `(()=>{})[${encode("constructor")}](${encode(code)})()`

// export { encode, encodeChar, encodeChars, encodeNumber, compile, map, words, alphabet }

// console.log(map)
