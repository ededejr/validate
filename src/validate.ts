import { BaseTarget, ValidationRuleMap } from './types';

/**
 * Validate a target with a ValidationRuleMap
 * @param rules
 * @param target
 * @returns
 */
export default function validate<Target extends BaseTarget>(
	rules: ValidationRuleMap<Target>,
	target: Target
): boolean {
	return Object.keys(target).every((property) =>
		rules[property](target[property] as Target[typeof property])
	);
}

/**
 * Create a validator from a ValidationRuleMap
 * @param rules
 * @returns
 */
export function createObjectValidator<Target extends BaseTarget>(
	rules: ValidationRuleMap<Target>
) {
	return (target: Target): boolean => validate<Target>(rules, target);
}
