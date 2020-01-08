import { PathReporter } from 'io-ts/lib/PathReporter';
import * as t from 'io-ts';
export {
  string,
  number,
  literal,
  object,
  Type,
  TypeC,
  boolean,
  undefined,
  array,
  InterfaceType,
  type,
  Mixed,
  partial,
  RecordC,
  record,
  union,
  TypeOf,
  intersection,
  StringC,
  Props,
  NumberC,
  BooleanC,
  ArrayC,
  nullType as null,
  Any,
} from 'io-ts';

export interface DecodeSuccess<T> {
  type: 'success';
  decoded: T;
}

export interface Error {
  type: 'error';
  message: string;
}

export const decodeItem = <T>(type: t.Type<T>, item: unknown): Error | DecodeSuccess<T> => {
  const i = type.decode(item);
  if (i.isLeft()) {
    const errors = PathReporter.report(i);
    return {
      type: 'error',
      message: errors.join('\n'),
    };
  }

  return {
    type: 'success',
    decoded: i.value,
  };
};