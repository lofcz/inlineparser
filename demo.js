const x = require("./index");

export default function () {
    let parser = new x.InlineParser();
    let chain = parser.getHoverIdentifierChain("let x = a.b.c", 1, 13);
    console.log(JSON.stringify(chain));
}