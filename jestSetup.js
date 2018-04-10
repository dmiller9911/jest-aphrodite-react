const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { StyleSheetTestUtils } = require('aphrodite');
const {
  StyleSheetTestUtils: StyleSheetTestUtilsNoImportant,
} = require('aphrodite/no-important');

StyleSheetTestUtils.suppressStyleInjection();
StyleSheetTestUtilsNoImportant.suppressStyleInjection();

Enzyme.configure({ adapter: new Adapter() });
