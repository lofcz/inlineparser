const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

export class InlineParser {
  ast = {};
  lastCode = "";

  getHoverIdentifierChain(code, line, column) {

    if (code !== this.lastCode) {
        this.ast = parser.parse(code);
        this.code = code;
    }

    let nodeAtCursor = undefined;
    let nodes = [];
    
    traverse(this.ast, {
        enter(path) {
    
          const { start, end } = path.node.loc;
          if (start.line <= line && end.line >= line && start.column <= column && end.column >= column) {
            nodeAtCursor = path.node;
            nodes.push(nodeAtCursor)
          }
          else {
            nodes.push(path.node)
          }
        },
    });
      
    function getFullIdentifierPath(node) {
        let identifiers = [];
        let nodeIndex = nodes.indexOf(node);
    
        function processNode(cNode) {
          if (t.isIdentifier(cNode)) {
            identifiers.push({
              type: "identifier",
              value: cNode.name
            });
          }
          else if (t.isLiteral(cNode)) {
              identifiers.push({
                type: "literal",
                value: cNode.value
              });
          }
          else {
            return false;
          }
    
          return true;
        }
    
        processNode(node);
    
        if (nodeIndex > 1) {
            for (var i = nodeIndex - 1; i > 0; i--) {
                var cNode = nodes[i];
    
                if (!processNode(cNode)) {
                  break;
                }
            }
        }
    
        return identifiers.reverse();
    }
    
    if (nodeAtCursor) {
        let identifiers = getFullIdentifierPath(nodeAtCursor);
        return identifiers;
    }

    return [];
  }
}