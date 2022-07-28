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

const number = n => {
  if (n < 10)
    return unaryNumber(n);
  return `+(${listNumber(n)})`;
}

const map = {};

const words = {}; // For strings of connected characters

function checkWords(str, pos) {
  for (const [key,value] of Object.entries(words))
    if (str.startsWith(key, pos))
      return {word: key, wordCode: value};
  return null;
}
const encodeChar = x => {
  if (x in map)
    return map[x];
  const charCode = x.charCodeAt(0);
  return `([]+[])[${encodeChars("constructor")}][${encodeChars("fromCharCode")}](${number(charCode)})`;
}
const encodeChars = s => s.split("").map(encodeChar).join("+");


const encode = s => {
  const tokens = [];
  for(let i = 0; i < s.length; i++) {
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
  map[i + []] = number(i) + "+[]";

//[object Object]//console.log({}+[]);
map['['] = `([]+{})[${number(0)}]`;
map.o = `([]+{})[${number(1)}]`;
map.b = `([]+{})[${number(2)}]`;
map.j = `([]+{})[${number(3)}]`;
map.c = `([]+{})[${number(5)}]`;
map[' '] = `([]+{})[${number(7)}]`;
map.O = `([]+{})[${number(8)}]`;
map[']'] = `([]+{})[${number(14)}]`;

words["false"] = "![]+[]";
map.f = `([]+![])[${number(0)}]`;
map.a = `([]+![])[${number(1)}]`;
map.l = `([]+![])[${number(2)}]`;
map.s = `([]+![])[${number(3)}]`;

words["true"] = "!![]+[]";
map.t = `([]+!![])[${number(0)}]`;
map.r = `([]+!![])[${number(1)}]`;
map.e = `([]+!![])[${number(3)}]`;

words["NaN"] = "+{}+[]";
map.N = `(+{}+[])[${number(0)}]`;

words["Infinity"] = "+!![]/+[]+[]"
map.I = `(+!![]/+[]+[])[${number(0)}]`;
map.i = `(+!![]/+[]+[])[${number(3)}]`;
map.y = `(+!![]/+[]+[])[${number(7)}]`;

words["undefined"] = "[]+[][[]]";
map.u = `([]+[][[]])[${number(0)}]`;
map.n = `([]+[][[]])[${number(1)}]`;
map.d = `([]+[][[]])[${number(2)}]`;


map.m = `([]+(+[])[${encode("constructor")}])[${number(11)}]`;

// Names
words["Array"] = `[][${encode("constructor")}][${encode("name")}]`;
words["Number"] = `(+[])[${encode("constructor")}][${encode("name")}]`;
words["Boolean"] = `(![])[${encode("constructor")}][${encode("name")}]`;
words["String"] = `([]+[])[${encode("constructor")}][${encode("name")}]`;
words["Function"] = `[][${encode("flat")}][${encode("constructor")}][${encode("name")}]`;
words["String"] = `([]+[])[${encode("constructor")}][${encode("name")}]`;
words["RegExp"] = `([]+/!/[${encode("constructor")}])[${encode("name")}]`;



//function RegExp() { [native code] }//console.log(eval(`([]+(/!/)[${fromString('constructor')}])`));
map.R = `([]+/!/[${encode("constructor")}])[${number(9)}]`;
map.g = `([]+/!/[${encode("constructor")}])[${number(11)}]`;
map.E = `([]+/!/[${encode("constructor")}])[${number(12)}]`;
map.x = `([]+/!/[${encode("constructor")}])[${number(13)}]`;
map.p = `([]+/!/[${encode("constructor")}])[${number(14)}]`;
//map['}'] = `([]+(/!/)[${fromString("constructor")}])[${number(34)}]`;
//function String() { [native code] }//console.log(eval(`([]+([]+[])[${fromString("constructor")}])`));
map.S = `([]+([]+[])[${encode("constructor")}])[${number(9)}]`;
map.v = `([]+[][${encode("flat")}])[${number(23)}]`; 
///\\\\///console.log(/\\\\/+[]);
map['\\'] = `([]+/\\\\/)[${number(1)}]`;
map['/'] = `([]+/!/)[${number(0)}]`;
map['!'] = `([]+/!/)[${number(1)}]`;
map['('] = `([]+/()/)[${number(1)}]`;
map[')'] = `([]+/()/)[${number(2)}]`;
map['{'] = `([]+/{/)[${number(1)}]`;
map['}'] = `([]+/}/)[${number(1)}]`;
map['='] = `([]+/=/)[${number(1)}]`;
map['>'] = `([]+/>/)[${number(1)}]`;
//map['<'] = `([]+/</)[${number(1)}]`;
//map['"'] = `([]+/"/)[${number(1)}]`;
//map['\''] = `([]+/'/)[${number(1)}]`;


map.h = `(${number(17)})[${encode("toString")}](${number(20)})`;
map.k = `(${number(20)})[${encode("toString")}](${number(21)})`;
map.q = `(${number(26)})[${encode("toString")}](${number(30)})`;
map.w = `(${number(32)})[${encode("toString")}](${number(33)})`;
map.z = `(${number(35)})[${encode("toString")}](${number(36)})`;

//%5C//console.log(eval(`(()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']})`));
map['%'] = `((()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']}))[${number(0)}]`;
map.C = `((()=>{})[${encode("constructor")}](${encode("return escape")})()(${map['\\']}))[${number(2)}]`;


//1.1e+101//console.log(eval(`+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[]`));
map['.'] = `(+[${listNumber(11)}+[${map.e}]+${listNumber(20)}]+[])[${number(1)}]`;
map['+'] = `(+[${listNumber(11)}+[${map.e}]+${listNumber(20)}]+[])[${number(4)}]`;



console.log("constructor length: " + encode("constructor").length);

const compile = code => `(()=>{})[${encode("constructor")}](${encode(code)})()`;

const code = compile("console.log('Hello world!');");
//console.log(code);
console.log("Hello world length: " + code.length);
eval(code);


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



debugger;