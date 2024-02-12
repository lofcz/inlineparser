const x = require("./index");


let parser = new x.InlineParser();
let chain = parser.getHoverIdentifierChain("x += a", 1, 6);
console.log(JSON.stringify(chain));
