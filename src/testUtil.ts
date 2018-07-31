import * as enzyme from 'enzyme';
import toJson from 'enzyme-to-json';
import * as reactTestRenderer from 'react-test-renderer';
import { render, cleanup } from 'react-testing-library';

export function checkSnapshotForEachMethod(ui: JSX.Element) {
  const rtrResult = reactTestRenderer.create(ui).toJSON();
  expect(rtrResult).toMatchSnapshot('react-test-renderer');

  const enzymeMethods = ['shallow', 'mount', 'render'];
  enzymeMethods.forEach(method => {
    const tree = (enzyme as any)[method](ui);
    expect(toJson(tree)).toMatchSnapshot(`enzyme.${method}`);
  });

  const { container } = render(ui);
  expect(container.firstChild).toMatchSnapshot('react-testing-library');
  cleanup();
}
