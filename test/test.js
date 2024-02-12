var assert = require('assert');
const x = require("./../index");

function parse(args) {
  console.log(JSON.stringify(args));
  let parser = new x.InlineParser();
  let chain = parser.getHoverIdentifierChain(args[0], args[1], args[2]);
  console.log(JSON.stringify(chain));
  return chain;
}

describe('parse()', function () {
  const tests = [
    {args: ["x += a", 1, 6], expected: [{ type: 1, value: "a" }]},
    {args: ["x += a.b", 1, 8], expected: [{ type: 1, value: "a" }, { type: 1, value: "b" }]},
    {args: [
`
async function main() {
var z = 0;

for (var i = 0; i < 10; i++) {
      z += i;
      console.log(z);
}
}
`, 6, 7
    ],
    expected: [
      { type: 1, value: "z" }
    ]
   },
   {args: [
`
async function main() {
var z = 0;

for (var i = 0; i < 10; i++) {
      z += i;
      console.log(z);
}
}
`, 6, 12
        ],
        expected: [
          { type: 1, value: "i" }
        ]
       }
  ];

  tests.forEach(({args, expected}) => {
    it(`correctly parses identifier sequence`, function () {
      const res = parse(args);
      assert.deepEqual(res, expected);
    });
  });
});