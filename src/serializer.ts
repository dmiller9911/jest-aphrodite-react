import { StyleSheetTestUtils } from 'aphrodite';
import * as css from 'css';
import { ReactTestRendererJSON } from 'react-test-renderer';
import { ClassNameReplacer, replaceClassNames } from './replaceClassNames';

export function createSerializer(
  getStyleSheetTestUtils: () => typeof StyleSheetTestUtils,
  classNameReplacer?: ClassNameReplacer,
): jest.SnapshotSerializerPlugin {
  function test(val: any) {
    return (
      val && !val.withStyles && val.$$typeof === Symbol.for('react.test.json')
    );
  }

  function print(val: ReactTestRendererJSON, printer: (val: any) => string) {
    const nodes = getNodes(val);
    nodes.forEach((node: any) => (node.withStyles = true));

    const selectors = getSelectors(nodes);
    const styles = getStyles(selectors);
    const printedVal = printer(val);
    if (styles) {
      return replaceClassNames(
        selectors,
        styles,
        printedVal,
        classNameReplacer,
      );
    } else {
      return printedVal;
    }
  }

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

  function getSelectors(nodes: ReactTestRendererJSON[]) {
    return nodes.reduce<string[]>((selectors, node) => {
      const props =
        typeof node.props === 'function' ? (node as any).props() : node.props;
      return getSelectorsFromProps(selectors, props);
    }, []);
  }

  function getSelectorsFromProps(selectors: string[], props: any) {
    const className: string = props.className || props.class;
    if (className) {
      selectors = [
        ...selectors,
        ...className
          .toString()
          .split(' ')
          .map(cn => `.${cn}`),
      ];
    }
    return selectors;
  }

  function getStyles(nodeSelectors: string[]) {
    const styles = getStyleSheetTestUtils()
      .getBufferedStyles()
      .join('');
    const ast = css.parse(styles);
    const rules = ast.stylesheet.rules.filter(filter);
    const mediaQueries = getMediaQueries(ast, filter);

    ast.stylesheet.rules = [...rules, ...mediaQueries];

    const ret = css.stringify(ast);

    function filter(rule: css.Rule) {
      if (rule.type === 'rule') {
        return rule.selectors.some(selector => {
          const baseSelector = selector.split(/:| |\./).filter(s => !!s)[0];
          return nodeSelectors.some(
            sel => sel === baseSelector || sel === `.${baseSelector}`,
          );
        });
      }
      return false;
    }

    return ret;
  }

  function getMediaQueries(
    ast: css.Stylesheet,
    filter: (rule: css.Rule) => boolean,
  ) {
    return ast.stylesheet.rules
      .filter(rule => rule.type === 'media' || rule.type === 'supports')
      .reduce((acc, mediaQuery: css.Media | css.Supports) => {
        mediaQuery.rules = mediaQuery.rules.filter(filter);

        if (mediaQuery.rules.length) {
          return [...acc, mediaQuery];
        }

        return acc;
      }, []);
  }

  return {
    test,
    print,
  };
}

// doing this to make it easier for users to mock things
// like switching between development mode and whatnot.
const getAphroditeStyleSheetTestUtils = (): typeof StyleSheetTestUtils =>
  require('aphrodite').StyleSheetTestUtils;

export const aphroditeSerializer = createSerializer(
  getAphroditeStyleSheetTestUtils,
);
