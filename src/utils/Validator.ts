export type ObjectValidator<T> = {
  [key in keyof T]?: ParameterValidator<T, keyof T>;
}

interface ParameterValidatorObject<Type, Key extends keyof Type> {
  default?: any;
  min?: number;
  max?: number;
  func?: (obj: Type, validator: ObjectValidator<Type>, key: Key) => void;
}
type ParameterValidatorFunction<Type, Key extends keyof Type> = (obj: Type, key: Key) => void;
type ParameterValidator<Type, Key extends keyof Type> = ParameterValidatorObject<Type, Key> | ParameterValidatorFunction<Type, Key>

export function validateObject<Type extends Record<string, unknown>, Key extends keyof Type>(obj: Type, validator: ObjectValidator<Type>): void {
  for (const key of Object.keys(validator) as Key[]) {
    const paramValidator = validator[key];
    if (paramValidator !== undefined)  {
      if (typeof paramValidator === 'function') {
        paramValidator(obj, key);
      } else {
        if (paramValidator.func !== undefined) {
          paramValidator.func(obj, validator, key);
        } else {
          if ((typeof obj[key]) !== (typeof paramValidator.default)) {
            obj[key] = paramValidator.default
          }
          if (typeof obj[key] === 'number' && paramValidator.min !== undefined) {
            if (obj[key] < paramValidator.min) obj[key] = paramValidator.min as Type[Key];
          }
          if (typeof obj[key] === 'number' && paramValidator.max !== undefined) {
            if (obj[key] > paramValidator.max) obj[key] = paramValidator.max as Type[Key];
          }
        }
      }
    }
  }
}

export function minMax<Type, Key extends keyof Type>(def: number, min: number, max: number): (obj: Type, key: Key & keyof Type) => void {
  return (obj, key) => {
    if (typeof obj[key] !== 'number') {
      obj[key] = def as unknown as Type[Key];
      return;
    }
    if ((obj[key] as unknown as number) < min) {
      obj[key] = min as unknown as Type[Key];
    }
    if ((obj[key] as unknown as number) > max) {
      obj[key] = max as unknown as Type[Key];
    }
  };
}

export function oneOf<Type, Key extends keyof Type, Value>(def: Value, options: Value[]): (obj: Type, key: Key & keyof Type) => void {
  return (obj, key) => {
    if (typeof obj[key] !== typeof def) {
      obj[key] = def as unknown as Type[Key];
      return;
    }
    if (!options.includes(obj[key] as unknown as Value)) {
      obj[key] = def as unknown as Type[Key];
    }
  };
}

export function subsetOf<Type, Key extends keyof Type, Value>(options: Value[]): (obj: Type, key: Key & keyof Type) => void {
  return (obj, key) => {
    if (typeof obj[key] !== 'object' || !Array.isArray(obj[key])) {
      obj[key] = [] as unknown as Type[Key];
      return;
    }
    const validValues: Value[] = [];
    for (const value of obj[key] as unknown as Value[]) {
      if (options.includes(value)) validValues.push(value);
    }
    obj[key] = validValues as unknown as Type[Key];
  };
}