// An object which can be validated
export type BaseTarget = {[key: string]: any};
export type ValidationFunction<T = any> = (arg: T) => Boolean;
export type ValidationRuleMap<Target extends BaseTarget> = {
  [Property in keyof Target]: ValidationFunction
};

// A function which will only execute if validations have passed
interface FunctionWithValidations<Target, Result = any> extends Function {
  rules: ValidationRuleMap<Target>;
  (arg: Target): Result;
}