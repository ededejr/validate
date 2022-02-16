import ValidatedFunction from '../ValidatedFunction';

describe('ValidatedFunction', () => {
	test('can be created', () => {
		const validatedFunc = ValidatedFunction.create(
			(data: { a: string | [] }) => data.a.length,
			{
				a: (a) => Object.keys(a).includes('length'),
			}
		);
		expect(validatedFunc).toBeDefined();
	});

	test('throws errors if invalid', () => {
		const validatedFunc = ValidatedFunction.create(
			(data: { a: string | [] }) => data.a.length,
			{
				a: (a) => Boolean(Object.keys(a).includes('length') && a.length),
			}
		);
		expect(validatedFunc).toBeDefined();
		expect(() => validatedFunc({ a: [] })).toThrowError();
	});
});
