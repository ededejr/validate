import { FunctionWithValidations, ValidationRuleMap } from "./types";
import { createValidator } from "./validate";

export default class ValidatedFunction<Target, Result = any> {
  rules: ValidationRuleMap<Target>;
  private validator: (t: Target) => Boolean;
  private executor: (arg: Target) => Result;

  static create = createValidatedFunction;

  constructor(rules: ValidationRuleMap<Target>,  func: (arg: Target) => Result) {
    this.rules = rules;
    this.validator = createValidator<Target>(rules);
    this.executor = func;
  }

  execute(arg: Target) {
    if (this.validator(arg)) {
      return this.executor(arg);
    } else {
      throw new Error(`Failed validation for "${this.executor.name}", with ${JSON.stringify(arg)}`);
    }
  }
}

function createValidatedFunction<Target, Result = any>(
  rules: ValidationRuleMap<Target>,  
  func: (arg: Target) => Result
): FunctionWithValidations<Target, Result> {

  const executor = new ValidatedFunction<Target, Result>(rules, func);
  
  const f: FunctionWithValidations<Target, Result> = (arg: Target) => {
    return executor.execute(arg);
  }
  f.rules = executor.rules;

  return f;
}