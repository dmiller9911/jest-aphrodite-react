import { css, StyleSheet, StyleSheetTestUtils } from 'aphrodite';
import * as React from 'react';
import { createSerializer } from './serializer';
import { checkSnapshotForEachMethod} from './testUtil';

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

test('removes vendor prefixed rules', () => {
  checkSnapshotForEachMethod(
    <Wrapper>
      <Title>
        Hello World, this is my first component styled with aphrodite!
      </Title>
    </Wrapper>,
  );
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
  checkSnapshotForEachMethod(<div className={css(styles.root)} />);
});
