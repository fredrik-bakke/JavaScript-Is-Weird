const zero = "+[]";
const one = "+!+[]";

const unaryNumber = n => {
  if (n == 0) return zero;
  if (n == 1) return one;
  return Array.from({ length: n }, () => "!+[]").join('+');
}

const listNumber = n => {
  let s = [];
  for (digit of n + [])
    s.push(unaryNumber(digit));
  return "[" + s.join("]+[") + "]";
}

function strNumber(n) {
  let s = [];
  for (digit of n + [])
    s.push(unaryNumber(digit));

  return s[0] + "+[" + s.slice(1).join("]+[") + "]";
}

// Use when the difference between number and string is unimportant
function number(n) {
  let s = [];
  for (digit of n + [])
    s.push(unaryNumber(digit));

  if (s.length == 1)
    return s[0];
  else
    return "+(" + s[0] + "+[" + s.slice(1).join("]+[") + "]" + ")";
}

function sNumber(n) {
  let s = [];
  for (digit of n + [])
    s.push(unaryNumber(digit));

  if (s.length == 1)
    return s[0];
  else
    return s[0] + "+[" + s.slice(1).join("]+[") + "]";
}

const map = {};
const words = {}; // For strings of connected characters

function checkWords(str, pos) {
  for (const [key, value] of Object.entries(words))
    if (str.startsWith(key, pos))
      return { word: key, wordCode: value };
  return null;
}
const encodeChar = x => {
  if (x in map)
    return map[x];
  const charCode = x.charCodeAt(0);
  return `([]+[])[${encodeChars("constructor")}][${encodeChars("fromCharCode")}](${sNumber(charCode)})`;
}
const encodeChars = s => s.split("").map(encodeChar).join("+");


const encode = s => {
  const tokens = [];
  for (let i = 0; i < s.length; i++) {
    let pair = checkWords(s, i);
    if (pair !== null) {
      tokens.push(pair.wordCode);
      i += pair.word.length - 1;
    }
    else
      tokens.push(encodeChar(s[i]));
  }
  return tokens.join('+');
};



for (let i = 0; i < 10; i++)
  map[i + []] = strNumber(i);

//[object Object]//console.log({}+[]);
map['['] = `([]+{})[${sNumber(0)}]`;
map.o = `([]+{})[${sNumber(1)}]`;
map.b = `([]+{})[${sNumber(2)}]`;
map.j = `([]+{})[${sNumber(3)}]`;
map.c = `([]+{})[${sNumber(5)}]`;
map[' '] = `([]+{})[${sNumber(7)}]`;
map.O = `([]+{})[${sNumber(8)}]`;
map[']'] = `([]+{})[${sNumber(14)}]`;

words["false"] = "![]+[]";
map.f = `([]+![])[${sNumber(0)}]`;
map.a = `([]+![])[${sNumber(1)}]`;
map.l = `([]+![])[${sNumber(2)}]`;
map.s = `([]+![])[${sNumber(3)}]`;

words["true"] = "!![]+[]";
map.t = `([]+!![])[${sNumber(0)}]`;
map.r = `([]+!![])[${sNumber(1)}]`;
map.e = `([]+!![])[${sNumber(3)}]`;

words["NaN"] = "+{}+[]";
map.N = `(+{}+[])[${sNumber(0)}]`;

words["Infinity"] = "+!![]/+[]+[]"
map.I = `(+!![]/+[]+[])[${sNumber(0)}]`;
map.i = `(+!![]/+[]+[])[${sNumber(3)}]`;
map.y = `(+!![]/+[]+[])[${sNumber(7)}]`;

words["undefined"] = "[]+[][[]]";
map.u = `([]+[][[]])[${sNumber(0)}]`;
map.n = `([]+[][[]])[${sNumber(1)}]`;
map.d = `([]+[][[]])[${sNumber(2)}]`;


map.m = `([]+(+[])[${encode("constructor")}])[${sNumber(11)}]`;

// Names
words["Array"] = `[][${encode("constructor")}][${encode("name")}]`;
map.A = `([]+[][${encode("constructor")}])[${sNumber(9)}]`;

words["Number"] = `(+[])[${encode("constructor")}][${encode("name")}]`;

words["Boolean"] = `(![])[${encode("constructor")}][${encode("name")}]`;
map.B = `([]+(![])[${encode("constructor")}])[${sNumber(9)}]`;


words["Function"] = `[][${encode("flat")}][${encode("constructor")}][${encode("name")}]`;
map.F = `([]+[][${encode("flat")}][${encode("constructor")}])[${sNumber(9)}]`;


words["String"] = `([]+[])[${encode("constructor")}][${encode("name")}]`;
map.S = `([]+([]+[])[${encode("constructor")}])[${sNumber(9)}]`;
map.v = `([]+[][${encode("flat")}])[${sNumber(23)}]`;

//function RegExp() { [native code] }//console.log(eval(`([]+(/!/)[${fromString('constructor')}])`));
words["RegExp"] = `([]+/!/[${encode("constructor")}])[${encode("name")}]`;
map.R = `([]+/!/[${encode("constructor")}])[${sNumber(9)}]`;
map.g = `([]+/!/[${encode("constructor")}])[${sNumber(11)}]`;
map.E = `([]+/!/[${encode("constructor")}])[${sNumber(12)}]`;
map.x = `([]+/!/[${encode("constructor")}])[${sNumber(13)}]`;
map.p = `([]+/!/[${encode("constructor")}])[${sNumber(14)}]`;

///\\\\///console.log(/\\\\/+[]);
map['\\'] = `([]+/\\\\/)[${sNumber(1)}]`;
map['/'] = `([]+/!/)[${sNumber(0)}]`;
map['!'] = `([]+/!/)[${sNumber(1)}]`;
map['('] = `([]+/()/)[${sNumber(1)}]`;
map[')'] = `([]+/()/)[${sNumber(2)}]`;
map['{'] = `([]+/{/)[${sNumber(1)}]`;
map['}'] = `([]+/}/)[${sNumber(1)}]`;
map['='] = `([]+/=/)[${sNumber(1)}]`;
map['>'] = `([]+/>/)[${sNumber(1)}]`;
//map['<'] = `([]+/</)[${number(1)}]`;
//map['"'] = `([]+/"/)[${number(1)}]`;
//map['\''] = `([]+/'/)[${number(1)}]`;

map.h = `(${number(17)})[${encode("toString")}](${sNumber(20)})`;
map.k = `(${number(20)})[${encode("toString")}](${sNumber(21)})`;
map.q = `(${number(26)})[${encode("toString")}](${sNumber(30)})`;
map.w = `(${number(32)})[${encode("toString")}](${sNumber(33)})`;
map.z = `(${number(35)})[${encode("toString")}](${sNumber(36)})`;

//%5C//console.log(eval(`(()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']})`));
map['%'] = `((()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']}))[${sNumber(0)}]`;
map.C = `((()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']}))[${sNumber(2)}]`;


//1.1e+21//console.log(eval(`+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[]`));
map['.'] = `(+(${sNumber(11)}+[${map.e}]+${listNumber(20)})+[])[${sNumber(1)}]`;
map['+'] = `(+(${sNumber(1)}+[${map.e}]+${listNumber(21)})+[])[${sNumber(2)}]`;


const compile = code => `(()=>{})[${encode("constructor")}](${encode(code)})()`;


let missing = "";

for (let letter of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\()[]{}!@#$%^&*_-+=|:;<>,.?/'\"`~") {
  if (!(letter in map))
    missing += letter;
}
console.log(missing);

for (const [key, value] of Object.entries(map)) {
  let actual = eval(value);
  if (actual !== key)
    console.error(`The map for '${key}' is wrong! It evaluated to ${actual}.`);
}

const perf = chars => {
  let cum = 0;
  for (let char of chars)
    cum += encodeChar(char).length;
  return cum / chars.length;
}

let mapPerf = 0;
for (const [key, value] of Object.entries(map))
  mapPerf += value.length;

mapPerf /= Object.entries(map).length;
console.log(`There are ${Object.entries(map).length} mapped characters. Average code length is ${Math.round(mapPerf)}.`);
let missingPerf = perf(missing);
console.log(`There are ${missing.length} non-mapped characters. Average code length is ${Math.round(missingPerf)}.`);




const code = compile("console.log('Hello world!');");
// console.log(code);

console.log("Hello world length: " + code.length);
eval(code);






debugger;