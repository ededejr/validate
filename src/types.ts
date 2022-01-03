/**
 * An Object which should be validated
 */
export type BaseTarget = {[key: string]: unknown};

/**
 * A function which tests if a given parameter is valid.
 */
export type ValidationFunction<T = unknown> = (arg: T) => boolean;

/**
 * A collection of validation functions.
 */
export type ValidationRuleMap<Target extends BaseTarget> = {
  [Property in keyof Target]: ValidationFunction
};