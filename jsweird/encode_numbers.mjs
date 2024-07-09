/**
 * This module provides functions for encoding arbitrary numbers in JavaScript
 * using only the characters ()[]+>!
 */

const map_number = {}
const map_number_depths = {}

const map_number_unstable = {}
const map_number_unstable_depths = {}

const get_digit_string = digit => `${map_number[digit]}+[]`


function register_number_encoding(map_number, input, val = undefined, depth = Infinity) {
  let ev_input = eval(input)

  if (val === undefined)
    val = ev_input

  if (typeof ev_input !== 'number') throw new Error(`Input '${input}' evaluated to ${ev_input} of type ${typeof ev_input}.`)
  if (ev_input !== val) throw new Error(`Input '${input}' evaluated to ${ev_input} and not the expected value ${val}.`)
  map_number[val] = input
  map_number_depths[val] = depth
}

function register_number_unstable_encoding(map_number_unstable, input, val = undefined, depth = Infinity) {
  let ev_input = eval(input)

  if (val === undefined)
    val = ev_input

  if (ev_input != val) throw new Error(`Input '${input}' evaluated to ${ev_input} and not the expected value ${val}.`)
  map_number_unstable[val] = input
  map_number_unstable_depths[val] = depth
}

// numbers
register_number_encoding(map_number, '+[]', 0, Infinity)
register_number_encoding(map_number, '+!![]', 1, Infinity)
register_number_encoding(map_number, '!![]+!![]', 2, Infinity)
register_number_encoding(map_number, '!![]+!![]+!![]', 3, Infinity)
register_number_encoding(map_number, '!![]+!![]+!![]+!![]', 4, 6)
register_number_encoding(map_number, '(+!![]+[+[]])>>!![]', 5, Infinity)
register_number_encoding(map_number, '!![]+(+!![]+[+[]]>>!![])', 6, Infinity)
register_number_encoding(map_number, '!![]+!![]+(+!![]+[+[]]>>!![])', 7, 6)
register_number_encoding(map_number, '!![]+!![]+!![]+(+!![]+[+[]]>>!![])', 8, 5)
register_number_encoding(map_number, '!![]+!![]+!![]+!![]+(+!![]+[+[]]>>!![])', 9, 3)
register_number_encoding(map_number, '!![]/(!![]+!![])', 0.5, Infinity)
register_number_unstable_encoding(map_number, '!![]/[]', Infinity, Infinity)


//(!![]+!![]+!![]+[+!![]]+[+[]]>>!![])+!![]+!![]+[+!![]]>>!![]

// unstable
register_number_unstable_encoding(map_number_unstable, '+[]', 0, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]', 1, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]', 2, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]+!![]', 3, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]+!![]+!![]', 4, 6)
register_number_unstable_encoding(map_number_unstable, '(+!![]+[+[]])>>!![]', 5, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]+(+!![]+[+[]]>>!![])', 6, Infinity)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]+(+!![]+[+[]]>>!![])', 7, 6)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]+!![]+(+!![]+[+[]]>>!![])', 8, 5)
register_number_unstable_encoding(map_number_unstable, '!![]+!![]+!![]+!![]+(+!![]+[+[]]>>!![])', 9, 3)
register_number_unstable_encoding(map_number_unstable, '+!![]+[+[]]', 10, Infinity)
register_number_unstable_encoding(map_number_unstable, '+!![]+[+!![]]', 11, Infinity)
register_number_unstable_encoding(map_number_unstable, '+!![]+[!![]+!![]]', 12, Infinity)



register_number_unstable_encoding(map_number_unstable, '!![]/[]', Infinity, Infinity)


/******** Basic number encoding methods *********/

const encodeNaturalNumberUnary = n => {
  /** Unary JSFuck encoding of a natural number */
  if (n === 0) return map_number[0]
  if (n === 1) return map_number[1]
  return Array.from({ length: n }, () => "!![]").join('+')
}

function encodeNaturalNumberGreedy(n) {
  /** Use this method when the type needs to be `Number` */
  let s = []
  for (let digit of n + [])
    s.push(map_number[digit])

  if (s.length === 1)
    return s[0]
  else
    if (hasUnmatchedGreaterThan(s[0]))
      return `+((${s[0]})+[${s.slice(1).join("]+[")}])`
    else
      return `+(${s[0]}+[${s.slice(1).join("]+[")}])`
}

function encodeNaturalNumberUnstableGreedy(n) {
  if (n === 1) return map_number_unstable[1]
  let s = []
  for (let digit of n + [])
    s.push(map_number[digit])

  if (s.length === 1)
    return s[0]
  else
    if (hasUnmatchedGreaterThan(s[0]))
      return `(${s[0]})+[${s.slice(1).join("]+[")}]`
    else
      return `${s[0]}+[${s.slice(1).join("]+[")}]`
}


function encodeNaturalNumberStringGreedy(n) {
  if (n < 10) return get_digit_string(n)
  return encodeNaturalNumberUnstableGreedy(n)
}

function findSmallestNumberEncodingInRange(min, max, depth) {
  let solution = encodeNaturalNumber(min, depth)

  for (let i = min + 1; i < max; i++) {
    let x = encodeNaturalNumber(i, depth)
    if (x.length < solution.length) solution = x
  }
  return solution;
}

function findSmallestUnstableNumberEncodingInRange(min, max, depth) {
  let solution = encodeNaturalNumberUnstable(min, depth)

  for (let i = min + 1; i < max; i++) {
    let x = encodeNaturalNumberUnstable(i, depth)
    if (x.length < solution.length) solution = x
  }
  return solution;
}

function hasUnmatchedGreaterThan(str) {
  let level = 0;
  for (let char of str) {
    level += (char === '(') - (char === ')')
    if (char === '>' && level === 0) return true;
  }
  return false;
}

function hasUnmatchedGreaterThanOrAdd(str) {
  let level = 0;
  for (let i = 0; i < str.length; i++) {
    let char = str[i]
    level += (char === '(') - (char === ')')
    if ((char === '>' || (char === '+' && i > 0)) && level === 0) return true;
  }
  return false;
}

const lengthAddNumberEncodings =
  (n, m) => {
    const ngt = hasUnmatchedGreaterThan(n)
    const mgt = hasUnmatchedGreaterThan(m)

    if ((n[0] === '+' && n[1] !== '(' && !ngt) && !(m[0] === '+' && m[1] !== '(' && !mgt)) {
      n, m = m, n
    }
    let sum = n.length + m.length + ngt * 2
    if (m[0] === '+' && m[1] !== '(' && !mgt)
      return sum
    else if (mgt || m[0] === '+')
      return sum + 3
    else
      return sum + 1
  }

const addNumberEncodings =
  (n, m) => {
    const ngt = hasUnmatchedGreaterThan(n)
    const mgt = hasUnmatchedGreaterThan(m)
    if ((n[0] === '+' && n[1] !== '(' && !ngt) && !(m[0] === '+' && m[1] !== '(' && !mgt)) {
      n, m = m, n
    }
    if (ngt) n = `(${n})`
    if (m[0] === '+' && m[1] !== '(' && !mgt)
      return n + m
    else if (mgt || m[0] === '+')
      return `${n}+(${m})`
    else
      return `${n}+${m}`
  }

function optimizeExpString(s) {
  return s.replace(/>>\(([^>()]+)\)/, '>>$1').replace(/>>!!\[\]((\+!!\[\])*)>>!!\[\]/, '>>!![]$1+!![]').replace('>>!![]>>(', '>>(!![]+').replace(/>>\(([^()]*)\)>>\(/, '>>($1+').replace('>>!![]+!![]+!![]+!![]+!![]', `>>(${map_number[5]})`).replace('!![]+!![]+!![]+!![]+!![]+!![]', map_number[6]).replace('!![]+!![]+!![]+!![]+!![]', map_number[5])//.replace('!![]+!![]+!![]+!![]+!![]+!![])', map_number[6] + ')').replace('!![]+!![]+!![]+!![]+!![])', map_number[5] + ')')//.replace('>>!![]>>!![]>>!![]', '>>(!![]+!![]+!![])').replace('>>!![]>>(', '>>(!![]+').replace(/>>\(([^()]*)\)>>\(/, '>>($1+').replace('!![]+!![]+!![]+!![]+!![]+!![])', map_number[6] + ')').replace('!![]+!![]+!![]+!![]+!![])', map_number[5] + ')').replace('>>!![]>>!![])', '>>!![]+!![])')
}

function encodeNaturalNumber(n, depth = 2) {
  if (n in map_number && map_number_depths[n] >= depth) return map_number[n]

  // We search recursively, is it better to construct n as
  // 1. a division x >> e
  // or
  // 2. as a sum x + y?

  let solution = n in map_number ? map_number[n] : encodeNaturalNumberGreedy(n)

  if (depth > 0) {
    for (let i = 1; i <= depth + 2; i++) {
      let e = encodeNaturalNumberUnstable(i, depth - 1)
      if (hasUnmatchedGreaterThanOrAdd(e)) e = `(${e})`
      if (24 + e.length >= solution.length) continue
      let x = findSmallestUnstableNumberEncodingInRange(n << i, (n + 1) << i, depth - 1)
      let s = `${x}>>${e}`
      s = optimizeExpString(s)
      if (s.length < solution.length)
        solution = s
    }

    for (let i = 1; i < n >> 1; i++) {
      let x = encodeNaturalNumber(n - i, depth - 1)
      if (x.length + 10 >= solution.length) continue
      let y = encodeNaturalNumber(i, depth - 1)
      if (lengthAddNumberEncodings(x, y) < solution.length)
        solution = addNumberEncodings(x, y)
    }
  }

  map_number[n] = solution
  map_number_depths[n] = depth

  if (n in map_number_unstable && solution.length < map_number_unstable[n].length) {
    map_number_unstable[n] = solution
  }

  return solution
}



function encodeNaturalNumberUnstable(n, depth = 2) {
  if (n in map_number_unstable && map_number_unstable_depths[n] >= depth) return map_number_unstable[n]

  // We search recursively, is it better to construct n as
  // 1. a division x >> e
  // or
  // 2. as a sum x + y?

  let solution = n in map_number_unstable ? map_number_unstable[n] : encodeNaturalNumberUnstableGreedy(n)

  if (depth > 0) {
    for (let i = 1; i <= depth + 2; i++) {
      let e = encodeNaturalNumberUnstable(i, depth - 1)
      if (hasUnmatchedGreaterThanOrAdd(e)) e = `(${e})`
      if (24 + e.length >= solution.length) continue
      let x = findSmallestUnstableNumberEncodingInRange(n << i, (n + 1) << i, depth - 1)
      let s = `${x}>>${e}`
      s = optimizeExpString(s)
      if (s.length < solution.length)
        solution = s
    }

    for (let i = 1; i < n >> 1; i++) {
      let x = encodeNaturalNumber(n - i, depth - 1)
      if (x.length + 10 >= solution.length) continue
      let y = encodeNaturalNumber(i, depth - 1)
      if (lengthAddNumberEncodings(x, y) < solution.length)
        solution = addNumberEncodings(x, y)
    }
  }

  map_number_unstable[n] = solution
  map_number_unstable_depths[n] = depth

  // if (typeof eval(solution) === 'number') {
  //   if (!(n in map_number) || solution.length < map_number[n].length) {
  //     map_number[n] = solution
  //     map_number_depths[n] = (n in map_number_depths ? Math.max(map_number_depths[n], depth) : depth)
  //   }
  // }

  return solution
}


const depth = 5

if (true) {
  let cum = 0;
  let count = 0;
  for (let i = 0; i <= 500; i++) {
    let res = encodeNaturalNumber(i, depth)
    count++
    cum += res.length
    // if (res !== encodeNaturalNumberGreedy(i))
    console.log(i, eval(res), res.length, typeof eval(res), res)

    let res2 = encodeNaturalNumberUnstable(i, depth)
    console.log(i, eval(res2), res2.length, typeof eval(res2), res2)
  }

  console.log("Average length:", cum / count)
}

if (false) {
  let cum = 0;
  let count = 0;
  for (let i = 0; i <= 500; i++) {
    let res = encodeNaturalNumber(i, 2)
    count++
    cum += res.length
    if (res !== encodeNaturalNumberGreedy(i))
      console.log(i, eval(res), res.length, typeof eval(res), res)
  }

  console.log("Average length:", cum / count)
}

// let i = 80085
// let res = encodeNaturalNumber(i, 2)
// console.log(i, eval(res), res.length, res)
// res = encodeNaturalNumber(i, 3)
// console.log(i, eval(res), res.length, res)

export { map_number }

const encodeNaturalNumberList = n => {
  let s = []
  for (let digit of n + [])
    s.push(encodeNaturalNumberUnary(digit))
  return `[${s.join("]+[")}]`
}
