import { StyleSheetTestUtils } from 'aphrodite';
import * as css from 'css';
import { isPrefixedValue } from 'css-in-js-utils';
import { ReactTestRendererJSON } from 'react-test-renderer';

function isCSSDeclaration(decl: css.Node): decl is css.Declaration {
  return decl.type === 'declaration';
}

function isCSSRule(rule: css.Node): rule is css.Rule {
  return rule.type === 'rule';
}

function isCSSMediaQuery(rule: css.Node): rule is css.Media {
  return rule.type === 'media';
}

function isCSSSupportsQuery(rule: css.Node): rule is css.Supports {
  return rule.type === 'supports';
}

function getSelectors(nodes: (ReactTestRendererJSON | HTMLElement)[]) {
  return nodes.reduce<string[]>((selectors, node) => {
    if (node instanceof HTMLElement) {
      return getSelectorsFromDOM(selectors, node);
    } else {
      const props =
        typeof node.props === 'function' ? (node as any).props() : node.props;
      return [...selectors, ...getSelectorsFromProps(props)];
    }
  }, []);
}

function getSelectorsFromProps(props: any = {}) {
  const className: string = props.className || props.class;
  if (className) {
    return className
      .toString()
      .split(' ')
      .map(cn => `.${cn}`);
  }
  return [];
}

function getSelectorsFromDOM(selectors: string[], node: HTMLElement) {
  const allChildren = node.querySelectorAll('*');
  const nodeSelectors = Array.from(node.classList).map(cn => `.${cn}`);
  selectors = Array.from(allChildren).reduce((s, c) => {
    s.push(...Array.from(c.classList).map(cn => `.${cn}`));
    return s;
  }, selectors);
  return [...nodeSelectors, ...selectors];
}

function filterPrefixedDelcartions(rule: css.Rule): css.Rule {
  return {
    ...rule,
    declarations: rule.declarations.filter(declaration => {
      if (isCSSDeclaration(declaration)) {
        return (
          !isPrefixedValue(declaration.value) &&
          !isPrefixedValue(declaration.property)
        );
      }
    }),
  };
}

function ruleMatchesSelectors(rule: css.Rule, nodeSelectors: string[]) {
  return rule.selectors.some(selector => {
    const baseSelector = selector.split(/:| |\./).filter(s => !!s)[0];
    return nodeSelectors.some(
      sel => sel === baseSelector || sel === `.${baseSelector}`,
    );
  });
}

function filterRules(
  nodes: css.Node[],
  nodeSelectors: string[],
  removeVendorPrefixes: boolean,
): css.Rule[] {
  return nodes.reduce((acc, node) => {
    if (isCSSRule(node)) {
      const matches = ruleMatchesSelectors(node, nodeSelectors);
      if (matches) {
        return removeVendorPrefixes
          ? [...acc, filterPrefixedDelcartions(node)]
          : [...acc, node];
      }
      return acc;
    }

    if (isCSSMediaQuery(node) || isCSSSupportsQuery(node)) {
      node.rules = filterRules(node.rules, nodeSelectors, removeVendorPrefixes);
      return node.rules.length ? [...acc, node] : acc;
    }

    return acc;
  }, []);
}

function getStylesAst(
  nodeSelectors: string[],
  getTestUtils: () => typeof StyleSheetTestUtils,
  removeVendorPrefixes: boolean,
) {
  const styles = getTestUtils()
    .getBufferedStyles()
    .join('');
  const ast = css.parse(styles);

  ast.stylesheet.rules = filterRules(
    ast.stylesheet.rules,
    nodeSelectors,
    removeVendorPrefixes,
  );

  return ast;
}

function getStyles(
  nodeSelectors: string[],
  getTestUtils: () => typeof StyleSheetTestUtils,
  removeVendorPrefixes: boolean,
) {
  const ast = getStylesAst(nodeSelectors, getTestUtils, removeVendorPrefixes);
  return css.stringify(ast);
}

export { getSelectors, getStyles };
