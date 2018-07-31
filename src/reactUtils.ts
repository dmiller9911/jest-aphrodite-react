import { ReactTestRendererJSON } from 'react-test-renderer';

function getNodes(
  node: ReactTestRendererJSON | HTMLElement,
  nodes: (ReactTestRendererJSON | HTMLElement)[] = [],
) {
  if (node.children) {
    const children: (ReactTestRendererJSON | HTMLElement)[] =
      typeof node.children === 'function'
        ? (node as any).children()
        : node.children;

    if (Array.isArray(children)) {
      children.forEach(child => getNodes(child, nodes));
    }
  }

  if (typeof node === 'object') {
    nodes.push(node);
  }

  return nodes;
}

export { getNodes };
