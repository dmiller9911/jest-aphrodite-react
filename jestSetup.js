const Enzyme = require('enzyme');
const Adapter = require('enzyme-adapter-react-16');
const { StyleSheetTestUtils } = require('aphrodite');

StyleSheetTestUtils.suppressStyleInjection();

Enzyme.configure({ adapter: new Adapter() });
