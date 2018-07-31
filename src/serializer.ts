import { StyleSheetTestUtils } from 'aphrodite';
import { ReactTestRendererJSON } from 'react-test-renderer';
import { getSelectors, getStyles } from './cssUtil';
import { getNodes } from './reactUtils';
import { ClassNameReplacer, replaceClassNames } from './replaceClassNames';

export interface SerializerOptions {
  removeVendorPrefixes?: boolean;
  classNameReplacer?: ClassNameReplacer;
}

interface TrackedHTMLElement extends HTMLElement {
  withStyles?: boolean;
}

export function createSerializer(
  getStyleSheetTestUtils: () => typeof StyleSheetTestUtils,
  { removeVendorPrefixes = false, classNameReplacer }: SerializerOptions = {},
): jest.SnapshotSerializerPlugin {
  function test(val: any) {
    return (
      val &&
      !val.withStyles &&
      (val.$$typeof === Symbol.for('react.test.json') ||
        (val instanceof HTMLElement && !isBeingSerialized(val)))
    );
  }

  function print(val: ReactTestRendererJSON, printer: (val: any) => string) {
    const nodes = getNodes(val);
    nodes.forEach((node: any) => (node.withStyles = true));

    const selectors = getSelectors(nodes);
    const styles = getStyles(
      selectors,
      getStyleSheetTestUtils,
      removeVendorPrefixes,
    );

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

  return {
    test,
    print,
  };
}

function isBeingSerialized(node: TrackedHTMLElement) {
  let currentNode = node;

  while (currentNode) {
    if (currentNode.withStyles) {
      return true;
    }
    currentNode = currentNode.parentNode as TrackedHTMLElement;
  }
  return false;
}

// doing this to make it easier for users to mock things
// like switching between development mode and whatnot.
const getAphroditeStyleSheetTestUtils = (
  useImportant: boolean,
) => (): typeof StyleSheetTestUtils =>
  require(`aphrodite${useImportant ? '' : '/no-important'}`)
    .StyleSheetTestUtils;

export const serializer = (useImportant: boolean) =>
  createSerializer(getAphroditeStyleSheetTestUtils(useImportant));
