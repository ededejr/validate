import { BaseTarget, ValidationRuleMap } from "./types";

export const Validators = Object.freeze({
  string: (arg: any) => typeof arg === 'string',
  number: (arg: any) => typeof arg === 'number',
  object: (arg: any) => Object(arg) === arg,
  array: (arg: any) => Array.isArray(arg),
});

/**
 * Validate a target with a ValidationRuleMap
 * @param rules 
 * @param target 
 * @returns 
 */
export function validate<
  Target extends BaseTarget, 
  RuleType extends ValidationRuleMap<Target>
>(rules: RuleType, target: Target) {
  return Object.keys(target).every(property => rules[property](target[property]));
}

/**
 * Create a validator for a ValidationRuleMap
 * @param rules 
 * @returns 
 */
export function createValidator<Target>(rules: ValidationRuleMap<Target>) {
  return (target: Target) => validate<Target, ValidationRuleMap<Target>>(rules, target);
}