/**
 * Provided basic validators.
 */
const Validators = Object.freeze({
  array: (arg: unknown) => Array.isArray(arg),
  number: (arg: unknown) => typeof arg === 'number',
  object: (arg: unknown) =>
    typeof arg === 'object' &&
    !Array.isArray(arg) &&
    arg !== null &&
    typeof arg !== 'function',
  string: (arg: unknown) => typeof arg === 'string',
});

export default Validators;
