import { JSXToTextConverter, jsxToText, JSXToTextOptions } from '../jsx-to-text';

describe('JSXToTextConverter', () => {
  let converter: JSXToTextConverter;

  beforeEach(() => {
    converter = new JSXToTextConverter();
  });

  describe('Basic JSX Elements', () => {
    test('simple div with text', () => {
      const jsx = '<div>Hello World</div>';
      expect(jsxToText(jsx)).toBe('Hello World');
    });

    test('nested elements', () => {
      const jsx = '<div><span>Hello</span> <strong>World</strong></div>';
      expect(jsxToText(jsx)).toBe('Hello World');
    });

    test('self-closing elements', () => {
      const jsx = '<div>Hello<br />World</div>';
      expect(jsxToText(jsx)).toBe('HelloWorld');
    });

    test('empty elements', () => {
      const jsx = '<div></div>';
      expect(jsxToText(jsx)).toBe('');
    });
  });

  describe('JSX Expressions', () => {
    test('simple variable', () => {
      const jsx = '<div>Hello {name}</div>';
      expect(jsxToText(jsx)).toBe('Hello {name}');
    });

    test('multiple variables', () => {
      const jsx = '<div>Hello {firstName} {lastName}</div>';
      expect(jsxToText(jsx)).toBe('Hello {firstName} {lastName}');
    });

    test('string literals', () => {
      const jsx = '<div>Hello {"World"}</div>';
      expect(jsxToText(jsx)).toBe('Hello {"World"}');
    });

    test('numeric literals', () => {
      const jsx = '<div>Count: {42}</div>';
      expect(jsxToText(jsx)).toBe('Count: {42}');
    });

    test('boolean literals', () => {
      const jsx = '<div>Status: {true}</div>';
      expect(jsxToText(jsx)).toBe('Status: {true}');
    });

    test('null literal', () => {
      const jsx = '<div>Value: {null}</div>';
      expect(jsxToText(jsx)).toBe('Value: {null}');
    });
  });

  describe('Complex Expressions', () => {
    test('function calls', () => {
      const jsx = '<div>Result: {getValue()}</div>';
      expect(jsxToText(jsx)).toBe('Result: {getValue()}');
    });

    test('function calls with arguments', () => {
      const jsx = '<div>Result: {getValue(user.id, "default")}</div>';
      expect(jsxToText(jsx)).toBe('Result: {getValue(user.id, "default")}');
    });

    test('member expressions', () => {
      const jsx = '<div>User: {user.name}</div>';
      expect(jsxToText(jsx)).toBe('User: {user.name}');
    });

    test('nested member expressions', () => {
      const jsx = '<div>User: {user.profile.firstName}</div>';
      expect(jsxToText(jsx)).toBe('User: {user.profile.firstName}');
    });

    test('array access', () => {
      const jsx = '<div>Item: {items[0]}</div>';
      expect(jsxToText(jsx)).toBe('Item: {items[0]}');
    });

    test('string property access', () => {
      const jsx = '<div>Property: {user["firstName"]}</div>';
      expect(jsxToText(jsx)).toBe('Property: {user["firstName"]}');
    });

    test('binary expressions', () => {
      const jsx = '<div>Sum: {a + b}</div>';
      expect(jsxToText(jsx)).toBe('Sum: {a + b}');
    });

    test('complex binary expressions', () => {
      const jsx = '<div>Result: {(a + b) * c}</div>';
      expect(jsxToText(jsx)).toBe('Result: {(a + b) * c}');
    });

    test('conditional expressions', () => {
      const jsx = '<div>Status: {isActive ? "Online" : "Offline"}</div>';
      expect(jsxToText(jsx)).toBe('Status: {isActive ? "Online" : "Offline"}');
    });

    test('nested conditional expressions', () => {
      const jsx = '<div>Status: {isActive ? (isPremium ? "Premium" : "Basic") : "Inactive"}</div>';
      expect(jsxToText(jsx)).toBe('Status: {isActive ? (isPremium ? "Premium" : "Basic") : "Inactive"}');
    });
  });

  describe('Template Literals', () => {
    test('simple template literal', () => {
      const jsx = '<div>Hello {`${firstName} ${lastName}`}</div>';
      expect(jsxToText(jsx)).toBe('Hello {`${firstName} ${lastName}`}');
    });

    test('template literal with expressions', () => {
      const jsx = '<div>URL: {`/api/users/${userId}/profile`}</div>';
      expect(jsxToText(jsx)).toBe('URL: {`/api/users/${userId}/profile`}');
    });

    test('complex template literal', () => {
      const jsx = '<div>Path: {`/api/${version}/users/${user.id}/posts/${post.slug}`}</div>';
      expect(jsxToText(jsx)).toBe('Path: {`/api/${version}/users/${user.id}/posts/${post.slug}`}');
    });
  });

  describe('Mixed Content', () => {
    test('text, expressions, and nested elements', () => {
      const jsx = '<div>Hello {name}! <span>Welcome to {appName}</span></div>';
      expect(jsxToText(jsx)).toBe('Hello {name}! Welcome to {appName}');
    });

    test('complex nested structure', () => {
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
      expect(jsxToText(jsx)).toBe('Welcome {user.name} You have {unreadCount} unread messages Recent Activity Last login: {lastLogin}');
    });
  });

  describe('Edge Cases', () => {
    test('JSX with comments', () => {
      const jsx = '<div>Hello {/* This is a comment */} World</div>';
      expect(jsxToText(jsx)).toBe('Hello World');
    });

    test('JSX with multiple comments', () => {
      const jsx = '<div>Hello {/* comment 1 */} {name} {/* comment 2 */} World</div>';
      expect(jsxToText(jsx)).toBe('Hello {name} World');
    });

    test('JSX with whitespace', () => {
      const jsx = '<div>  Hello  {name}  World  </div>';
      expect(jsxToText(jsx)).toBe('Hello {name} World');
    });

    test('JSX with newlines', () => {
      const jsx = '<div>\nHello\n{name}\nWorld\n</div>';
      expect(jsxToText(jsx)).toBe('Hello {name} World');
    });

    test('JSX with tabs', () => {
      const jsx = '<div>\tHello\t{name}\tWorld\t</div>';
      expect(jsxToText(jsx)).toBe('Hello {name} World');
    });
  });

  describe('Options and Customization', () => {
    test('preserveWhitespace: true', () => {
      const converter = new JSXToTextConverter({ preserveWhitespace: true });
      const jsx = '<div>  Hello  {name}  World  </div>';
      expect(converter.convert(jsx)).toBe('  Hello  {name}  World  ');
    });

    test('preserveExpressions: false', () => {
      const converter = new JSXToTextConverter({ preserveExpressions: false });
      const jsx = '<div>Hello {name} World</div>';
      expect(converter.convert(jsx)).toBe('Hello World');
    });

    test('custom expression handler', () => {
      const converter = new JSXToTextConverter({
        expressionHandler: (expr) => `[${expr}]`
      });
      const jsx = '<div>Hello {name} World</div>';
      expect(converter.convert(jsx)).toBe('Hello [name] World');
    });

    test('custom expression handler with complex expressions', () => {
      const converter = new JSXToTextConverter({
        expressionHandler: (expr) => `[EXPR: ${expr}]`
      });
      const jsx = '<div>User: {user.name}, Count: {items.length}</div>';
      expect(converter.convert(jsx)).toBe('User: [EXPR: user.name], Count: [EXPR: items.length]');
    });
  });

  describe('Error Handling', () => {
    test('invalid JSX syntax', () => {
      const invalidJSX = '<div>Hello <unclosed>';
      expect(jsxToText(invalidJSX)).toBe(invalidJSX); // Should fallback to original
    });

    test('empty string', () => {
      expect(jsxToText('')).toBe('');
    });

    test('non-JSX string', () => {
      const plainText = 'Just plain text';
      expect(jsxToText(plainText)).toBe(plainText);
    });
  });

  describe('Real-world Examples', () => {
    test('button component', () => {
      const jsx = `
        <button 
          className={\`btn btn-\${variant} \${size ? \`btn-\${size}\` : ''}\`}
          disabled={isLoading}
          onClick={handleClick}
        >
          {isLoading ? 'Loading...' : children}
        </button>
      `;
      const result = jsxToText(jsx);
      // The converter extracts all expressions, so check that the key expression is present
      expect(result).toContain('isLoading ? \'Loading...\' : children');
    });

    test('form component', () => {
      const jsx = `
        <form onSubmit={handleSubmit}>
          <label htmlFor="email">Email:</label>
          <input 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)}
            required 
          />
          <button type="submit" disabled={!email}>
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      `;
      const result = jsxToText(jsx);
      // The converter extracts all expressions, so check that key parts are present
      expect(result).toContain('Email:');
      expect(result).toContain('isSubmitting ? \'Submitting...\' : \'Submit\'');
    });

    test('navigation component', () => {
      const jsx = `
        <nav className="navbar">
          <div className="nav-brand">
            <a href="/">{brandName}</a>
          </div>
          <ul className="nav-menu">
            {menuItems.map(item => (
              <li key={item.id}>
                <a href={item.href} className={item.isActive ? 'active' : ''}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      `;
      const result = jsxToText(jsx);
      // The converter extracts all expressions, so check that key parts are present
      expect(result).toContain('brandName');
      expect(result).toContain('menuItems.map');
      expect(result).toContain('item.label');
    });
  });

  describe('Performance Tests', () => {
    test('large JSX structure', () => {
      const largeJSX = Array(1000).fill(0).map((_, i) => 
        `<div key="${i}">Item ${i}: {getValue(${i})}</div>`
      ).join('');
      
      const start = performance.now();
      const result = jsxToText(largeJSX);
      const end = performance.now();
      
      expect(result).toContain('Item 0: {getValue(0)}');
      expect(result).toContain('Item 999: {getValue(999)}');
      expect(end - start).toBeLessThan(100); // Should complete in under 100ms
    });

    test('deeply nested JSX', () => {
      let deepJSX = '<div>';
      for (let i = 0; i < 100; i++) {
        deepJSX += `<span>Level ${i}: {getLevel(${i})}`;
      }
      for (let i = 0; i < 100; i++) {
        deepJSX += '</span>';
      }
      deepJSX += '</div>';
      
      const start = performance.now();
      const result = jsxToText(deepJSX);
      const end = performance.now();
      
      expect(result).toContain('Level 0: {getLevel(0)}');
      expect(result).toContain('Level 99: {getLevel(99)}');
      expect(end - start).toBeLessThan(50); // Should complete in under 50ms
    });
  });
});
