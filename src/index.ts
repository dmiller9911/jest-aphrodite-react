import { ClassNameReplacer, replaceClassNames } from './replaceClassNames';
import {
  aphroditeSerializer,
  createSerializer,
  SerializerOptions,
} from './serializer';

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
