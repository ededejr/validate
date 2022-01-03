/**
 * Provided basic validators.
 */
const Validators = Object.freeze({
  string: (arg: any) => typeof arg === 'string',
  number: (arg: any) => typeof arg === 'number',
  object: (arg: any) => Object(arg) === arg,
  array: (arg: any) => Array.isArray(arg),
});

export default Validators;