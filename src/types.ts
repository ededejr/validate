/**
 * An Object which should be validated
 */
export type BaseTarget = Record<string | number | symbol, unknown> | object;

/**
 * A function which tests if a given parameter is valid.
 */
export type ValidationFunction<T = unknown> = (arg: T) => boolean;

/**
 * A collection of validation functions.
 */
export type ValidationRuleMap<Target> = {
  [Property in keyof Target]: ValidationFunction<Target[Property]>;
};
