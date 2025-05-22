const { RuleTester } = require('eslint');
const rule = require('../lib/rules/order');

const ruleTester = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    parserOptions: {
      ecmaFeatures: { jsx: true },
    },
  },
});

ruleTester.run('order', rule, {
  valid: [
    {
      code: `
        function MyComponent(props) {
          const { title } = props;
          const theme = 'light';
          const [count, setCount] = useState(0);
          const handleClick = () => {};
          return <div>{title}</div>;
        }
      `,
    },
  ],
  invalid: [
    {
      code: `
        function MyComponent(props) {
          const [count, setCount] = useState(0);
          const { title } = props;
          return <div>{title}</div>;
        }
      `,
      errors: [
        {
          messageId: 'wrongOrder',
          data: {
            current: 'props-destruction',
            expected: 'hooks',
          },
        },
      ],
    },
  ],
});
