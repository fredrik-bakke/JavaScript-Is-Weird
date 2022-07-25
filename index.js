const zero = '+[]';
const one = '+!![]';

const number = n => {
  if (n === 0) return zero;
  return Array.from({length: n}, () => one).join('+ ');
}

// C

const map = {};

const fromChar = x => {
  if (!(x in map)) {
    const charCode = x.charCodeAt(0);
    return `([]+[])[${fromString('constructor')}][${fromString('fromCharCode')}](${number(charCode)})`;
  }
  return map[x];
}
const fromString = s =>s.split('').map(fromChar).join('+');


//NaN//console.log(+{}+[]);
map.N = `(+{}+[])[${number(0)}]`;
map.a = `(+{}+[])[${number(1)}]`;
//[object Object]//console.log({}+[]);
map['['] = `({}+[])[${number(0)}]`;
map.o = `({}+[])[${number(1)}]`;
map.b = `({}+[])[${number(2)}]`;
map.j = `({}+[])[${number(3)}]`;
map.c = `({}+[])[${number(5)}]`;
map[' '] = `({}+[])[${number(7)}]`;
map.O = `({}+[])[${number(8)}]`;
map[']'] = `({}+[])[${number(14)}]`;
//false//console.log(![]+[]);
map.f = `(![]+[])[${number(0)}]`;
map.l = `(![]+[])[${number(2)}]`;
map.s = `(![]+[])[${number(3)}]`;
//true//console.log(!![]+[]);
map.t = `(!![]+[])[${number(0)}]`;//map.t = `({}+[])[${number(6)}]`;
map.r = `(!![]+[])[${number(1)}]`;
map.u = `(!![]+[])[${number(2)}]`;
map.e = `(!![]+[])[${number(3)}]`;//map.e = `({}+[])[${number(4)}]`;
//Infinity//console.log((+!![]/+[])+[]);
map.I = `((+!![]/+[])+[])[${number(0)}]`;
map.n = `((+!![]/+[])+[])[${number(1)}]`;//map.n = `((+!![]/+[])+[])[${number(4)}]`;
map.i = `((+!![]/+[])+[])[${number(3)}]`;
map.y = `((+!![]/+[])+[])[${number(7)}]`;
//function RegExp() { [native code] }//console.log(eval(`([]+(/!/)[${fromString('constructor')}])`));
map.R = `([]+(/!/)[${fromString('constructor')}])[${number(9)}]`;
map.g = `([]+(/!/)[${fromString('constructor')}])[${number(11)}]`;
map.E = `([]+(/!/)[${fromString('constructor')}])[${number(12)}]`;
map.x = `([]+(/!/)[${fromString('constructor')}])[${number(13)}]`;
map.p = `([]+(/!/)[${fromString('constructor')}])[${number(14)}]`;
map['('] = `([]+(/!/)[${fromString('constructor')}])[${number(15)}]`;
map[')'] = `([]+(/!/)[${fromString('constructor')}])[${number(16)}]`;
map['{'] = `([]+(/!/)[${fromString('constructor')}])[${number(18)}]`;
map.v = `([]+(/!/)[${fromString('constructor')}])[${number(25)}]`;
map.d = `([]+(/!/)[${fromString('constructor')}])[${number(30)}]`;//map.d = `(${number(13)})[${fromString('toString')}](${number(14)})`;
map['}'] = `([]+(/!/)[${fromString('constructor')}])[${number(34)}]`;
//function String() { [native code] }//console.log(eval(`([]+([]+[])[${fromString('constructor')}])`));
map.S = `([]+([]+[])[${fromString('constructor')}])[${number(9)}]`;
///\\\\///console.log(/\\\\/+[]);
map['\\'] = `(/\\\\/+[])[${number(1)}]`;

map.h = `(${number(17)})[${fromString('toString')}](${number(18)})`;
map.k = `(${number(20)})[${fromString('toString')}](${number(21)})`;
map.m = `(${number(22)})[${fromString('toString')}](${number(23)})`;
map.q = `(${number(26)})[${fromString('toString')}](${number(27)})`;
map.w = `(${number(32)})[${fromString('toString')}](${number(33)})`;
map.z = `(${number(35)})[${fromString('toString')}](${number(36)})`;
//%5C//console.log(eval(`(()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']})`));
map['%'] = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(0)}]`;
map['5'] = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(1)}]`;
map.C = `((()=>{})[${fromString('constructor')}](${fromString('return escape')})()(${map['\\']}))[${number(2)}]`;

const compile = code => `(()=>{})[${fromString('constructor')}](${fromString(code)})()`;

const code = compile('console.log("Hello world!");');
//console.log(code);
console.log(code.length);
eval(code);


let present = "";
let missing = "";

for (let letter of "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789/\\()[]{}!@#$%^&*_-+=|:;<>,.?/'\"`~")
{
  if (letter in map)
    present += letter;
  else
    missing += letter;
}
console.log(missing);

for (letter of present)
{
  let actual = eval(map[letter]);
  if (actual != letter)
    console.log(`The map for ${letter} is wrong! It evaluated to ${actual}.`);
}


let missingPerf = 0;
for (let letter of missing)
  missingPerf += fromChar(letter).length;
missingPerf /= missing.length;

console.log(`Average code length for non-mapped characters: ${Math.round(missingPerf)}`);



debugger;