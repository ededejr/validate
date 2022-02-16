import ValidatedFunction from './ValidatedFunction';
import { ValidationRuleMap } from './types';
import Validators from './validators';
import validate, { createObjectValidator } from './validate';

const createValidatedFunction = ValidatedFunction.create;

export {
	validate,
	Validators,
	ValidationRuleMap,
	createValidatedFunction,
	createObjectValidator,
};
