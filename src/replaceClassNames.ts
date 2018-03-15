export type ClassNameReplacer = (className: string, index: number) => string;

const aphroditeMatcher = /(_[\w\d]+(\-o_O\-)*)/gi;

const defaultClassNameReplacer: ClassNameReplacer = className => {
  return className
    .replace('.', '')
    .replace(aphroditeMatcher, (_match, _hash, sep) => {
      return sep ? '-' : '';
    });
};

export const replaceClassNames = (
  selectors: string[],
  styles: string,
  code: string,
  replacer: ClassNameReplacer = defaultClassNameReplacer,
) => {
  let index = 0;
  return selectors.reduce((acc, className) => {
    if (styles.includes(className)) {
      const escapedRegex = new RegExp(
        className.replace('.', '').replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&'),
        'g',
      );
      return acc.replace(escapedRegex, replacer(className, index++));
    }
    return acc;
  }, `${styles}\n\n${code}`);
};
