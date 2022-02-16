import validate, { createObjectValidator } from '../validate';

describe('Validate', () => {
	test('validates a given object', () => {
		expect(
			validate({ a: (a: string) => a.includes('a') }, { a: 'abcde' })
		).toBe(true);
	});

	test('validates a nested object', () => {
		expect(
			validate(
				{
					a: (a) => a.name.includes('a') && a.age > 5,
				},
				{
					a: {
						age: 10,
						name: 'abcde',
					},
				}
			)
		).toBe(true);
	});

	test('fails a given object', () => {
		expect(validate({ a: (a) => a.includes('z') }, { a: 'abcde' })).toBe(false);
	});
});

describe('createObjectValidator', () => {
	test('returns a validation function', () => {
		const validator = createObjectValidator<{ a: string }>({
			a: (a) => a.includes('a'),
		});
		expect(validator({ a: 'abcde' })).toBe(true);
	});

	test('returns a validation function that fails', () => {
		const validator = createObjectValidator<{ a: string }>({
			a: (a) => a.includes('z'),
		});
		expect(validator({ a: 'abcde' })).toBe(false);
	});
});
