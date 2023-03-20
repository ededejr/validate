import * as Validators from './validators';
import ValidatedFunction from './ValidatedFunction';
import { ValidationRuleMap } from './types';
import validate, { createObjectValidator } from './validate';

const createValidatedFunction = ValidatedFunction.create;

export {
  validate,
  Validators,
  ValidationRuleMap,
  createValidatedFunction,
  createObjectValidator,
};
