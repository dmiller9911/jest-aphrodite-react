import { css, StyleSheet } from 'aphrodite';
import * as enzyme from 'enzyme';
import toJson from 'enzyme-to-json';
import * as React from 'react';
import * as reactTestRenderer from 'react-test-renderer';
import { aphroditeSerializer } from './serializer';

expect.addSnapshotSerializer(aphroditeSerializer);

const Wrapper: React.SFC = props => {
  const styles = StyleSheet.create({
    wrapper: {
      background: 'papayawhip',
      padding: '4em',
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

test('react-test-renderer', () => {
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

test('enzyme', () => {
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

test('works when the root element does not have styles', () => {
  const tree = reactTestRenderer
    .create(
      <div>
        <Wrapper />
      </div>,
    )
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test(`doesn't fail for nodes without styles`, () => {
  const tree = reactTestRenderer.create(<div />).toJSON();
  expect(tree).toMatchSnapshot();
});

test('joins multiple classes', () => {
  const styles = StyleSheet.create({
    first: { color: 'red' },
    second: { backgroundColor: 'black' },
    third: { color: 'blue' },
  });
  const tree = reactTestRenderer
    .create(<div className={css(styles.first, styles.second, styles.third)} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('supports mediaQueries', () => {
  const styles = StyleSheet.create({
    root: {
      color: 'red',
      '@media(min-width: 200px)': {
        color: 'black',
      },
    },
  });
  const tree = reactTestRenderer
    .create(<div className={css(styles.root)} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});

test('supports pseudo selectors', () => {
  const styles = StyleSheet.create({
    root: {
      color: 'red',
      ':hover': {
        color: 'green',
      },
      '@media(min-width: 200px)': {
        ':hover': {
          color: 'black',
        },
      },
    },
  });
  const tree = reactTestRenderer
    .create(<div className={css(styles.root)} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
