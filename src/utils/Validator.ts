export type ObjectValidator<T> = {
  [key in keyof T]?: ParameterValidator<T, keyof T>;
}

interface ParameterValidator<T, U extends keyof T> {
  default?: any;
  min?: number;
  max?: number;
  func?: (obj: T, validator: ObjectValidator<T>, key: U) => void;
}

export function validateObject<T extends Record<string, unknown>, U extends keyof T>(obj: T, validator: ObjectValidator<T>): void {
  for (const key of Object.keys(validator) as U[]) {
    const paramValidator = validator[key];
    if (paramValidator !== undefined)  {
      if (paramValidator.func !== undefined) {
        paramValidator.func(obj, validator, key);
      } else {
        if ((typeof obj[key]) !== (typeof paramValidator.default)) {
          obj[key] = paramValidator.default
        }
        if (typeof obj[key] === 'number' && paramValidator.min !== undefined) {
          if (obj[key] < paramValidator.min) obj[key] = paramValidator.min as T[U];
        }
        if (typeof obj[key] === 'number' && paramValidator.max !== undefined) {
          if (obj[key] > paramValidator.max) obj[key] = paramValidator.max as T[U];
        }
      }
    }
  }
}