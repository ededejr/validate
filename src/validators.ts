type Validator = (arg: unknown) => boolean;
type ValidatorOp = (...validatorFn: Validator[]) => Validator;

/**
 * Ensure a given argument is an array using `Array.isArray`.
 */
export const array: Validator = (arg) => Array.isArray(arg);

/**
 * Ensure a given argument is a boolean using `typeof`.
 */
export const boolean: Validator = (arg) => typeof arg === 'boolean';

/**
 * Combine multiple validators into a single result.
 */
export const combine: ValidatorOp =
  (...validators) =>
  (arg) =>
    validators.every((validator) => validator(arg));

/**
 * Ensure a given argument is an integer using `typeof` and `Number.isInteger`.
 */
export const integer: Validator = (arg) =>
  typeof arg === 'number' && Number.isInteger(arg);

/**
 * Ensure a given argument is a number using `typeof`.
 */
export const number: Validator = (arg) => typeof arg === 'number';

/**
 * Ensure a given argument is an object using `typeof`,
 * as well as checks for `null` and `function`.
 *
 * Note:
 * Arrays are not considered objects.
 */
export const object: Validator = (arg) =>
  typeof arg === 'object' &&
  !Array.isArray(arg) &&
  arg !== null &&
  typeof arg !== 'function';

/**
 * Mark a field as optional, only validating if it is present.
 */
export const optional: ValidatorOp = (validatorFn) => (arg) =>
  arg ? validatorFn(arg) : true;

/**
 * Ensure a given argument is a string using `typeof`.
 */
export const string: Validator = (arg) => typeof arg === 'string';
