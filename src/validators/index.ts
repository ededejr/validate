import { ValidationChain } from './validation-chain';
import { TypedValidator, ValidatorOp } from './types';

/**
 * Ensure a given argument is an array using `Array.isArray`.
 */
export function array<T = unknown>(arg: unknown): arg is T[] {
  return Array.isArray(arg);
}

/**
 * Ensure a given argument is an array of a given type.
 * This is useful for validating arrays of objects.
 * @param validatorFn A validator function to apply to each element.
 */
export function arrayOf<T>(validatorFn: TypedValidator<T>) {
  return (arg: unknown): arg is T[] => {
    if (!array(arg)) {
      return false;
    }

    return arg.every(validatorFn);
  };
}

/**
 * Ensure a given argument is a boolean using `typeof`.
 */
export function boolean(arg: unknown): arg is boolean {
  return typeof arg === 'boolean';
}

/**
 * Ensure a given argument is a date using the underlying `Date` object.
 */
export function date(arg: unknown): arg is Date {
  if (string(arg)) {
    return !isNaN(Date.parse(arg));
  } else if (number(arg)) {
    return new Date(arg).toString() !== 'Invalid Date';
  }
  return arg instanceof Date;
}

/**
 * Ensure a given argument is a number using `typeof`.
 */
export function number(arg: unknown): arg is number {
  return typeof arg === 'number';
}

/**
 * Ensure a given argument is an object using `typeof`,
 * as well as checks for `null` and `function`.
 *
 * Note:
 * Arrays are not considered objects.
 */
export function object(arg: unknown): arg is Record<string, unknown> {
  return (
    typeof arg === 'object' &&
    !Array.isArray(arg) &&
    arg !== null &&
    typeof arg !== 'function'
  );
}

/**
 * Ensure a given argument is a string using `typeof`.
 */
export function string(arg: unknown): arg is string {
  return typeof arg === 'string';
}

/**
 * Ensure a given argument is a string matching a given pattern.
 * @param pattern - A regular expression to test against.
 */
export function pattern(pattern: RegExp) {
  return (arg: unknown): arg is string => string(arg) && pattern.test(arg);
}

/**
 * Ensure a given argument is `null` or `undefined`.
 * This is useful for optional fields.
 */
export function nullish(arg: unknown): arg is null | undefined {
  return arg === null || arg === undefined;
}

/**
 * Combine multiple validators into a single result.
 * If any validator fails, the result is false.
 *
 * Note: Validators are evaluated in order and only until
 * the first failure.
 */
export const combine: ValidatorOp =
  (...validators) =>
  (arg) => {
    let index = 0;

    while (index < validators.length) {
      const validator = validators[index];

      if (!validator(arg)) {
        return false;
      }

      index++;
    }

    return true;
  };

/**
 * Mark a field as optional, only validating if it is present.
 */
export const optional: ValidatorOp = (validatorFn) => (arg) =>
  nullish(arg) ? true : validatorFn(arg);

/**
 * Creates a chainable structure for running multiple validations
 * in series. In contrast to the {@link combine} function which
 * combines all inputs with `&&`, this function will bail out
 * on the first failure.
 *
 * @example
 * A simple chain to verify a string is a date.
 * ```ts
 * const isValidDateString = Validators.chainable()
 *  .chain(Validators.string)
 *  .chain(Validators.date);
 *
 * const isValidDate = isValidDateString('2021-01-01'); // true
 * ```
 *
 * @example
 * Dealing with complex types is also supported via Generics.
 *
 * ```ts
 * const isValidUser = Validators.chainable()
 *  .chain(Validators.object)
 *  .chain<Record<string, unknown>>(obj => obj.hasOwnProperty('name'))
 *  .chain<{ name: string }>(({ name }) => Validators.pattern(/^[a-z]+$/i)(name))
 * ```
 */
export function chainable() {
  return new ValidationChain();
}
