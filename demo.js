const x = require("./index");


let parser = new x.InlineParser();
let chain = parser.getHoverIdentifierChain(`
async function main() {
var z = 0;

for (var i = 0; i < 10; i++) {
      z += i;
      console.log(z);
}
}
`, 6, 12);
console.log(JSON.stringify(chain));
