import { ReactTestRendererJSON } from 'react-test-renderer';

function getNodes(
  node: ReactTestRendererJSON,
  nodes: ReactTestRendererJSON[] = [],
) {
  if (node.children) {
    const children: ReactTestRendererJSON[] =
      typeof node.children === 'function'
        ? (node as any).children()
        : node.children;

    children.forEach(child => getNodes(child, nodes));
  }

  if (typeof node === 'object') {
    nodes.push(node);
  }

  return nodes;
}

export { getNodes };
