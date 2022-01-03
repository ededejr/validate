/**
 * An Object which should be validated
 */
export type BaseTarget = {[key: string]: any};

/**
 * A function which tests if a given parameter is valid.
 */
export type ValidationFunction<T = any> = (arg: T) => Boolean;

/**
 * A collection of validation functions.
 */
export type ValidationRuleMap<Target extends BaseTarget> = {
  [Property in keyof Target]: ValidationFunction
};