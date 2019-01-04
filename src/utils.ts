import Tone from 'tone';

export enum StyleType {
  PRIMARY = 'primary',
  SECONDARY = 'secondary',
  ACCENT = 'accent',
  ERROR = 'error',
  INFO = 'info',
  SUCCESS = 'success',
  WARNING = 'warning',
}

interface StyleOptions {
  darken?: number;
  lighten?: number;
  text?: boolean;
}

export const makeLookup = <T>(items: T[], getter: (item: T) => string) => {
  const lookup: {[key: string]: T} = {};
  items.forEach((item) => {
    lookup[getter(item)] = item;
  });
  return lookup;
};

export const makeStyle = (type: StyleType, options?: StyleOptions) => {
  options = options || {};

  if (options.darken !== undefined && options.lighten !== undefined) {
      throw Error('both `darken` and `lighten` cannot be given');
    }

  const validate = (v?: number) => {
      if (v === undefined) { return; }
      if (v >= 0 && v <= 4) { return; }
      throw Error('`darken` or `lighten` must be >= 0 and <= 4, not ' + v);
    };

  validate(options.darken);
  validate(options.lighten);

  let str = `${type}`;

  if (options.lighten !== undefined && options.lighten !== 0) {
      str += `-lighten-${options.lighten}`;
    } else if (options.darken !== undefined && options.darken !== 0) {
      str += `-darken-${options.darken}`;
    }

  if (options.text !== undefined) {
      str += '--text';
    }

  return str;
};

type Color = 'black' | 'white';

export const range = (a: number, b = 0, interval = 1) => {
  let start;
  let end;
  if (a > b) {
    start = 0; end = a;
  } else {
    start = a; end = b;
  }
  const rge = [];
  for (let i = start; i < end; i += interval) {
    rge.push(i);
  }
  return rge;
};

interface OctaveKey {
  value: string;
  color: Color;
  id: number;
}

const octaveKeys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'].reverse();
export const allKeys: OctaveKey[] = [];
let noteNumber = -octaveKeys.length + 1;  // A bit hacky but we want to start at C8 and end at A0
range(0, 9).reverse().forEach((value) => {
  octaveKeys.forEach((key) => {
    if (noteNumber >= 0 && noteNumber < 88) {
      allKeys.push({
        value: `${key}${value}`,
        color: key.endsWith('#') ? 'black' : 'white',
        id: noteNumber,
      });
    }
    noteNumber += 1;
  });
});


export const copy = <T>(o: T): T => {
  return JSON.parse(JSON.stringify(o));
};


export const Nullable = (o: { new(): object }) => {
  return {
    required: true,
    validator: (prop: any) => {
      // TODO I don't know how well the first check holds up but it works for now
      return typeof prop === o.name.toLowerCase() || prop === null;
    },
  };
};


export const Keys = {
  SHIFT: 16,
  DELETE: 46,
  BACKSPACE: 8,
  SPACE: 32,
};


export const Button = {
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2,
};

export function MapField<T extends MapFieldSetter>(o: T) {
  return (target: object, name: keyof T) => {
    Object.defineProperty(target, name, {
      get() {
        return o[name];
      },
      set(value) {
        o.setValue({key: name, value});
      },
      enumerable: true,
      configurable: true,
    });
  };
}

export interface MapFieldSetter {
  setValue<T extends keyof this>(payload: { key: T, value: any }): void;
}

export function toTickTime(time: number) {
  return `${time * Tone.Transport.PPQ}i`;
}
