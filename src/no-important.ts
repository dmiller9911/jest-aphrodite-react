import { ClassNameReplacer, replaceClassNames } from './replaceClassNames';
import { createSerializer, serializer, SerializerOptions } from './serializer';

const aphroditeSerializer = serializer(false);
const { test, print } = aphroditeSerializer;

export {
  aphroditeSerializer,
  createSerializer,
  replaceClassNames,
  print,
  test,
  ClassNameReplacer,
  SerializerOptions,
};
