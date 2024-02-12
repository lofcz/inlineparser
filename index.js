const parser = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const t = require("@babel/types");

const NodeTypes = {
	Unknown: 0,
	Identifier: 1,
	Literal: 2,
}

class InlineParser {
  ast = {};
  lastCode = "";

  getHoverIdentifierChain(code, line, column) {


    if (code !== this.lastCode) {
       try {
        this.ast = parser.parse(code);
        this.code = code;
       }
       catch (e) {
        this.code = code;
       }
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

    function getFullIdentifierPathSimple(node) {
      let identifiers = [];
      let nodeIndex = nodes.indexOf(node);
    
      function processNode(cNode) {
        if (t.isIdentifier(cNode)) {
          identifiers.push({
            type: NodeTypes.Identifier,
            value: cNode.name
          });
        }
        else if (t.isLiteral(cNode)) {
            identifiers.push({
              type: NodeTypes.Literal,
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
      
    function getFullIdentifierPathStrategySwitch(node) {
        let identifiers = [];
        let nodeIndex = nodes.indexOf(node);
        let startNode = null;
    
        function processNode(cNode) {
          if (t.isIdentifier(cNode) || t.isLiteral(cNode)) {
              return false;
          }
          else {
            startNode = cNode;
            return true;
          }
        }
    
        if (nodeIndex > 1) {
            for (var i = nodeIndex - 1; i > 0; i--) {
                var cNode = nodes[i];
    
                if (processNode(cNode)) {
                  break;
                }
            }
        }

        let finalStartNode = null;

        if (t.isAssignmentExpression(startNode)) {
          var col = column;
          finalStartNode = startNode.right.start <= col && startNode.right.end >= col ? startNode.right : startNode.left;
          identifiers.push({
            type: NodeTypes.Identifier,
            value: finalStartNode.name
          });
        }
        else if (t.isMemberExpression(startNode) || t.isOptionalMemberExpression(startNode)) {
            return getFullIdentifierPathSimple(node);
        }

        return identifiers.reverse();
    }
    
    if (nodeAtCursor) {
        let identifiers = getFullIdentifierPathStrategySwitch(nodeAtCursor);
        return identifiers;
    }

    return [];
  }
}

module.exports = {
  InlineParser,
};