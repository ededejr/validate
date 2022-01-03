import { BaseTarget, ValidationRuleMap } from './types';

/**
 * Validate a target with a ValidationRuleMap
 * @param rules 
 * @param target 
 * @returns 
 */
export default function validate<
  Target extends BaseTarget, 
  RuleType extends ValidationRuleMap<Target>
>(rules: RuleType, target: Target): boolean {
  return Object.keys(target).every(property => rules[property](target[property]));
}

/**
 * Create a validator from a ValidationRuleMap
 * @param rules 
 * @returns 
 */
export function createObjectValidator<Target>(rules: ValidationRuleMap<Target>) {
  return (target: Target): boolean => validate<Target, ValidationRuleMap<Target>>(rules, target);
}