export type Validator = (arg: unknown) => boolean;
export type TypedValidator<T = unknown> = (arg: unknown) => arg is T;

export type ValidatorFn<T = unknown> = Validator | TypedValidator<T>;

export type ValidatorOp = (...validatorFn: ValidatorFn[]) => Validator;
