import { css, StyleSheet } from 'aphrodite';
import * as React from 'react';
import { aphroditeSerializer } from '.';
import { checkSnapshotForEachMethod} from './testUtil';

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

test('Wrapper', () => {
  checkSnapshotForEachMethod(
    <Wrapper>
      <Title>
        Hello World, this is my first component styled with aphrodite!
      </Title>
    </Wrapper>
  );
});

test('when the root element does not have styles', () => {
  checkSnapshotForEachMethod(
    <div>
      <Wrapper />
    </div>
  );
});

test(`doesn't fail for nodes without styles`, () => {
  checkSnapshotForEachMethod(<div />);
});

test('joins multiple classes', () => {
  const styles = StyleSheet.create({
    first: { color: 'red' },
    second: { backgroundColor: 'black' },
    third: { color: 'blue' },
  });
  checkSnapshotForEachMethod(<div className={css(styles.first, styles.second, styles.third)} />);
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
  checkSnapshotForEachMethod(<div className={css(styles.root)} />);
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
  checkSnapshotForEachMethod(<div className={css(styles.root)} />);
});
