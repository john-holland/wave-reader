import { parse } from '@babel/parser';
import traverse from '@babel/traverse';

const jsx = `
  <div>
    <header>
      <h1>Welcome {user.name}</h1>
      <p>You have {unreadCount} unread messages</p>
    </header>
    <main>
      <section>
        <h2>Recent Activity</h2>
        <p>Last login: {lastLogin}</p>
      </section>
    </main>
  </div>
`;

const ast = parse(jsx, {
  sourceType: 'module',
  plugins: ['jsx', 'typescript']
});

console.log('AST:', JSON.stringify(ast, null, 2));

// Find all JSXText nodes
let textNodes: any[] = [];
let expressionNodes: any[] = [];

traverse(ast, {
  JSXText: (path: any) => {
    textNodes.push({
      value: path.node.value,
      start: path.node.start,
      end: path.node.end,
      raw: jsx.slice(path.node.start, path.node.end)
    });
  },
  JSXExpressionContainer: (path: any) => {
    expressionNodes.push({
      expression: path.node.expression.type,
      start: path.node.start,
      end: path.node.end,
      raw: jsx.slice(path.node.start, path.node.end)
    });
  }
});

console.log('\nText Nodes:');
textNodes.forEach((node, i) => {
  console.log(`${i}: "${node.value}" (${node.start}-${node.end})`);
});

console.log('\nExpression Nodes:');
expressionNodes.forEach((node, i) => {
  console.log(`${i}: ${node.expression} (${node.start}-${node.end})`);
});

console.log('\nRaw JSX:');
console.log(JSON.stringify(jsx));
