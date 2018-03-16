import { css, StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import * as enzyme from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import { createSerializer } from './serializer';

expect.addSnapshotSerializer(
  createSerializer(() => StyleSheetTestUtils, { removeVendorPrefixes: true }),
);

const Wrapper: React.SFC = props => {
  const styles = StyleSheet.create({
    wrapper: {
      display: 'flex',
      transform: 'translate(0, 0)',
    },
  });
  return <section className={css(styles.wrapper)} {...props} />;
};

const Title: React.SFC = props => {
  const styles = StyleSheet.create({
    title: {
      color: 'palevioletred',
      fontSize: '1.5em',
      textAlign: 'center',
    },
  });
  return <h1 className={css(styles.title)} {...props} />;
};

test('removes vendor prefixed rules from react-test-renderer', () => {
  const tree = reactTestRenderer
    .create(
      <Wrapper>
        <Title>
          Hello World, this is my first component styled with aphrodite!
        </Title>
      </Wrapper>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('removes vendor prefixed rules from enzyme', () => {
  const ui = (
    <Wrapper>
      <Title>
        Hello World, this is my first component styled with aphrodite!
      </Title>
    </Wrapper>
  );

  const enzymeMethods = ['shallow', 'mount', 'render'];
  enzymeMethods.forEach(method => {
    const tree = (enzyme as any)[method](ui);
    expect(toJson(tree)).toMatchSnapshot(`enzyme.${method}`);
  });
});

test('removes vendor prefixes inside mediaQueries', () => {
  const styles = StyleSheet.create({
    root: {
      '@media(min-width: 200px)': {
        transform: 'translate(0, 0)',
      },
      '@supports(display: grid)': {
        display: 'flex',
      },
    },
  });
  const tree = reactTestRenderer
    .create(<div className={css(styles.root)} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
