import { createObjectValidator } from './validate';
import { BaseTarget, ValidationRuleMap } from './types';

export default class ValidatedFunction<
  Target extends BaseTarget,
  Result = unknown
> {
  rules: ValidationRuleMap<Target>;
  private validator: (t: Target) => boolean;
  private executor: (arg: Target) => Result;

  constructor(rules: ValidationRuleMap<Target>, func: (arg: Target) => Result) {
    this.rules = rules;
    this.validator = createObjectValidator<Target>(rules);
    this.executor = func;
  }

  protected execute(arg: Target): Result {
    if (this.validator(arg)) {
      return this.executor(arg);
    } else {
      throw new Error(
        `Failed validation for "${this.executor.name}", with ${JSON.stringify(
          arg
        )}`
      );
    }
  }

  static create<Target extends BaseTarget, Result = unknown>(
    func: (arg: Target) => Result,
    rules: ValidationRuleMap<Target>
  ): FunctionWithValidations<Target, Result> {
    const executor = new ValidatedFunction<Target, Result>(rules, func);
    const f: FunctionWithValidations<Target, Result> = (arg: Target) =>
      executor.execute(arg);
    f.rules = executor.rules;
    return f;
  }
}

/**
 * A function which will only execute if validations have passed
 */
interface FunctionWithValidations<Target extends BaseTarget, Result = unknown>
  extends Function {
  rules: ValidationRuleMap<Target>;
  (arg: Target): Result;
}
