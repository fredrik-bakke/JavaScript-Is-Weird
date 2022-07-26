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
  return `+[${listNumber(n)}]`;
}
console.log(number(10));

const map = {};

const fromChar = x => {
  if (x in map)
    return map[x];
  const charCode = x.charCodeAt(0);
  return `([]+[])[${fromString("constructor")}][${fromString("fromCharCode")}](${number(charCode)})`;
}
const fromString = s => s.split("").map(fromChar).join('+');


for (let i = 0; i < 10; i++)
  map[i+[]] = number(i)+"+[]";

map["10"] = "[+!+[]]+[+[]]+[]";
map["11"]= "[+!+[]]+[+!+[]]+[]";
map["100"]= "[+!+[]]+[+[]]+[+[]]+[]";


//[object Object]//console.log({}+[]);
map['['] = `([]+{})[${number(0)}]`;
map.o    = `([]+{})[${number(1)}]`;
map.b    = `([]+{})[${number(2)}]`;
map.j    = `([]+{})[${number(3)}]`;
map.c    = `([]+{})[${number(5)}]`;
map[' '] = `([]+{})[${number(7)}]`;
map.O    = `([]+{})[${number(8)}]`;
map[']'] = `([]+{})[${number(14)}]`;
//false//console.log(![]+[]);
map.f = `([]+![])[${number(0)}]`;
map.a = `([]+![])[${number(1)}]`;
map.l = `([]+![])[${number(2)}]`;
map.s = `([]+![])[${number(3)}]`;
//true//console.log(!![]+[]);
map.t = `([]+!![])[${number(0)}]`;//map.t = `({}+[])[${number(6)}]`;
map.r = `([]+!![])[${number(1)}]`;
// map.u = `([]+!![])[${number(2)}]`;
map.e = `([]+!![])[${number(3)}]`;//map.e = `({}+[])[${number(4)}]`;
//Infinity//console.log((+!![]/+[])+[]);
map.I = `([]+(+!![]/+[]))[${number(0)}]`;
map.i = `([]+(+!![]/+[]))[${number(3)}]`;
map.y = `([]+(+!![]/+[]))[${number(7)}]`;

//undefined//console.log([][[]]);
map.u = `([]+[][[]])[${number(0)}]`;
map.n = `([]+[][[]])[${number(1)}]`;
map.d = `([]+[][[]])[${number(2)}]`;

// console.log(eval(`${fromString("11e100")}`));
// map['.'] = 

//function RegExp() { [native code] }//console.log(eval(`([]+(/!/)[${fromString('constructor')}])`));
map.R = `([]+(/!/)[${fromString("constructor")}])[${number(9)}]`;
map.g = `([]+(/!/)[${fromString("constructor")}])[${number(11)}]`;
map.E = `([]+(/!/)[${fromString("constructor")}])[${number(12)}]`;
map.x = `([]+(/!/)[${fromString("constructor")}])[${number(13)}]`;
map.p = `([]+(/!/)[${fromString("constructor")}])[${number(14)}]`;
map.v = `([]+(/!/)[${fromString("constructor")}])[${number(25)}]`;
map['}'] = `([]+(/!/)[${fromString("constructor")}])[${number(34)}]`;
//function String() { [native code] }//console.log(eval(`([]+([]+[])[${fromString("constructor")}])`));
map.S = `([]+([]+[])[${fromString("constructor")}])[${number(9)}]`;
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


map.h = `(${number(17)})[${fromString("toString")}](${number(18)})`;
map.k = `(${number(20)})[${fromString("toString")}](${number(21)})`;
map.m = `(${number(22)})[${fromString("toString")}](${number(23)})`;
map.q = `(${number(26)})[${fromString("toString")}](${number(27)})`;
map.w = `(${number(32)})[${fromString("toString")}](${number(33)})`;
map.z = `(${number(35)})[${fromString("toString")}](${number(36)})`;
//%5C//console.log(eval(`(()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']})`));
map['%'] = `((()=>{})[${fromString("constructor")}](${fromString("return escape")})()(${map['\\']}))[${number(0)}]`;
map.C = `((()=>{})[${fromString("constructor")}](${fromString("return escape")})()(${map['\\']}))[${number(2)}]`;
//NaN//console.log(+{}+[]);
map.N = `(+{}+[])[${number(0)}]`;
map["1.1e+101"] = `+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[]`;
//1.1e+101//console.log(eval(`+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[]`));
map['.'] = `(+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[])[${number(1)}]`;
map['+'] = `(+[[+!+[]]+[+!+[]]+[${map.e}]+[+!+[]]+[+[]]+[+[]]]+[])[${number(4)}]`;
console.log()


console.log("constructor length: " + fromString("constructor").length);

const compile = code => `(()=>{})[${fromString("constructor")}](${fromString(code)})()`;

const code = compile("console.log(\"Hello world!\");");
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
    cum += fromChar(char).length;
  return cum / chars.length;
}

let mapPerf = 0;
for (const [key, value] of Object.entries(map))
  mapPerf += value.length;

mapPerf /= Object.entries(map).length;
console.log(`There are ${Object.entries(map).length} mapped characters. Average code length is ${Math.round(mapPerf)}.`);
let missingPerf = perf(missing);
console.log(`There are ${missing.length} mapped characters. Average code length is ${Math.round(missingPerf)}.`);



debugger;