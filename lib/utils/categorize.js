function categorizeNode(node) {
  if (node.type === 'VariableDeclaration') {
    for (const decl of node.declarations) {
      if (
        decl.init &&
        decl.init.type === 'MemberExpression' &&
        decl.init.object.name === 'props'
      ) {
        return 'props-destruction';
      }

      if (
        decl.init &&
        decl.init.type === 'CallExpression' &&
        /^use[A-Z]/.test(decl.init.callee.name)
      ) {
        return 'hooks';
      }
    }
    return 'constants';
  }

  if (
    node.type === 'FunctionDeclaration' ||
    node.type === 'VariableDeclaration'
  ) {
    const name = node.id?.name ?? (node.declarations?.[0]?.id?.name || '');

    if (/^(handle|on|.*Handler)/.test(name)) {
      return 'handlers';
    }
  }

  if (node.type === 'ReturnStatement') {
    return 'return';
  }

  return 'other';
}

module.exports = categorizeNode;
