import { StyleSheetTestUtils } from 'aphrodite';
import { ReactTestRendererJSON } from 'react-test-renderer';
import { getSelectors, getStyles } from './cssUtil';
import { getNodes } from './reactUtils';
import { ClassNameReplacer, replaceClassNames } from './replaceClassNames';

export interface SerializerOptions {
  removeVendorPrefixes?: boolean;
  classNameReplacer?: ClassNameReplacer;
}

export function createSerializer(
  getStyleSheetTestUtils: () => typeof StyleSheetTestUtils,
  { removeVendorPrefixes = false, classNameReplacer }: SerializerOptions = {},
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

// doing this to make it easier for users to mock things
// like switching between development mode and whatnot.
const getAphroditeStyleSheetTestUtils = (
  useImportant: boolean,
) => (): typeof StyleSheetTestUtils =>
  require(`aphrodite${useImportant ? '' : '/no-important'}`)
    .StyleSheetTestUtils;

export const serializer = (useImportant: boolean) =>
  createSerializer(getAphroditeStyleSheetTestUtils(useImportant));
