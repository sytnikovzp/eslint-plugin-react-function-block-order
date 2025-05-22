const categorizeNode = require('../utils/categorize');

module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description:
        'Enforce specific order of code blocks in React functional components',
    },
    schema: [],
    messages: {
      wrongOrder:
        'Block of type "{{current}}" should come after "{{expected}}"',
    },
  },

  create(context) {
    return {
      FunctionDeclaration(node) {
        if (!node.id || !/^[A-Z]/.test(node.id.name)) return;

        const bodyNodes = node.body.body;
        const blocks = bodyNodes.map((n) => ({
          node: n,
          type: categorizeNode(n),
        }));

        const expectedOrder = [
          'props-destruction',
          'constants',
          'hooks',
          'handlers',
          'return',
        ];

        let lastIndex = -1;
        for (const { node, type } of blocks) {
          const currentIndex = expectedOrder.indexOf(type);
          if (currentIndex === -1) continue;
          if (currentIndex < lastIndex) {
            context.report({
              node,
              messageId: 'wrongOrder',
              data: {
                current: type,
                expected: expectedOrder[lastIndex],
              },
            });
          } else {
            lastIndex = currentIndex;
          }
        }
      },
    };
  },
};
