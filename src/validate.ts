import { BaseTarget, ValidationRuleMap } from './types';

/**
 * Validate a target with a ValidationRuleMap
 * @param rules
 * @param target
 * @returns
 */
export default function validate<Target extends BaseTarget>(
  target: Target,
  rules: ValidationRuleMap<Target>
): boolean {
  return Object.keys(target).every((property) => {
    const rule = rules[property as keyof typeof rules];
    const field = target[property as keyof typeof target];
    return rule(field);
  });
}

/**
 * Create a validator from a ValidationRuleMap
 * @param rules
 * @returns
 */
export function createObjectValidator<Target extends BaseTarget>(
  rules: ValidationRuleMap<Target>
) {
  return (target: Target): boolean => validate<Target>(target, rules);
}
