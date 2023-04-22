import * as Validators from '../validators';

describe('Validators', () => {
  describe('array', () => {
    test('validates array types', () => {
      expect(Validators.array([])).toBe(true);
    });

    test('fails non-array types', () => {
      expect(Validators.array('array')).toBe(false);
      expect(Validators.array(1)).toBe(false);
      expect(Validators.array({})).toBe(false);
    });
  });

  describe('number', () => {
    test('can validate an number type', () => {
      expect(Validators.number(1)).toBe(true);
    });

    test('fails non-number types', () => {
      expect(Validators.number('number')).toBe(false);
      expect(Validators.number([])).toBe(false);
      expect(Validators.number({})).toBe(false);
    });
  });

  describe('object', () => {
    test('can validate an object type', () => {
      expect(Validators.object({})).toBe(true);
    });

    test('fails non-object types', () => {
      expect(Validators.object([])).toBe(false);
      expect(Validators.object('object')).toBe(false);
      expect(
        Validators.object(() => {
          return;
        })
      ).toBe(false);
    });
  });

  describe('string', () => {
    test('can validate an string type', () => {
      expect(Validators.string('string')).toBe(true);
    });

    test('fails non-string types', () => {
      expect(Validators.string({})).toBe(false);
      expect(Validators.string([])).toBe(false);
      expect(
        Validators.string(() => {
          return;
        })
      ).toBe(false);
    });
  });

  describe('boolean', () => {
    test('can validate an boolean type', () => {
      expect(Validators.boolean(true)).toBe(true);
    });

    test('fails non-boolean types', () => {
      expect(Validators.boolean({})).toBe(false);
      expect(Validators.boolean([])).toBe(false);
      expect(
        Validators.boolean(() => {
          return;
        })
      ).toBe(false);
    });
  });

  describe('optional', () => {
    test('validates optional types when present', () => {
      expect(Validators.optional(Validators.string)('string')).toBe(true);
      expect(Validators.optional(Validators.string)(undefined)).toBe(true);
    });

    test('fails if provided type does not match the required', () => {
      expect(Validators.optional(Validators.string)({})).toBe(false);
      expect(Validators.optional(Validators.string)([])).toBe(false);
      expect(
        Validators.optional(Validators.string)(() => {
          return;
        })
      ).toBe(false);
    });
  });

  describe('combine', () => {
    test('can validate combinations', () => {
      const validateNumAsString = Validators.combine(
        Validators.string,
        Validators.number
      );
      const validateDateAsNum = Validators.combine(
        Validators.number,
        Validators.date
      );

      expect(validateNumAsString('string')).toBe(false);
      expect(validateNumAsString(1)).toBe(false);
      expect(validateDateAsNum(10)).toBe(true);
    });

    test('can validate a combination with optional types', () => {
      expect(
        Validators.combine(
          Validators.optional(Validators.string),
          Validators.optional(Validators.number)
        )('string')
      ).toBe(false);
      expect(
        Validators.combine(
          Validators.optional(Validators.string),
          Validators.optional(Validators.number)
        )(undefined)
      ).toBe(true);
    });

    test('can validate provided and custom types', () => {
      const validator = Validators.combine(
        Validators.pattern(/[a-z]+@gmail.com$/i),
        (value) => `${value}`.length > 10
      );

      expect(validator('string')).toBe(false);
      expect(validator('example@gmail.com')).toBe(true);
    });

    test('fails non-combined types', () => {
      expect(Validators.combine(Validators.string, Validators.number)({})).toBe(
        false
      );
      expect(Validators.combine(Validators.string, Validators.number)([])).toBe(
        false
      );
      expect(
        Validators.combine(
          Validators.string,
          Validators.number
        )(() => {
          return;
        })
      ).toBe(false);
    });
  });

  describe('arrayOf', () => {
    test('can validate an array of type', () => {
      expect(Validators.arrayOf(Validators.string)(['string'])).toBe(true);
    });

    test('fails non-array of types', () => {
      expect(Validators.arrayOf(Validators.string)(['string', 1])).toBe(false);
      expect(Validators.arrayOf(Validators.string)([1])).toBe(false);
    });
  });

  describe('nullish', () => {
    test('can validate an nullish type', () => {
      expect(Validators.nullish(null)).toBe(true);
      expect(Validators.nullish(undefined)).toBe(true);
    });

    test('fails non-nullish types', () => {
      expect(Validators.nullish(1)).toBe(false);
      expect(Validators.nullish('string')).toBe(false);
      expect(Validators.nullish({})).toBe(false);
    });
  });

  describe('pattern', () => {
    test('can validate a pattern', () => {
      expect(Validators.pattern(/^string$/i)('string')).toBe(true);
    });

    test('fails if pattern input is not string', () => {
      expect(Validators.pattern(/^string$/i)(1)).toBe(false);
    });

    test('fails if pattern does not match', () => {
      expect(Validators.pattern(/^string$/i)('string1')).toBe(false);
    });
  });

  describe('date', () => {
    test('validates various input types for dates', () => {
      expect(Validators.date(1679326882357)).toBe(true);
      expect(Validators.date('2020-01-01')).toBe(true);
      expect(Validators.date(new Date())).toBe(true);
      expect(Validators.date(1.1)).toBe(true);
    });

    test('fails non valid inputs', () => {
      expect(Validators.date('string')).toBe(false);
      expect(Validators.date({})).toBe(false);
      expect(Validators.date([])).toBe(false);
      expect(
        Validators.date(() => {
          /**/
        })
      ).toBe(false);
    });
  });

  describe.only('makeChain', () => {
    test('validates a chain', () => {
      const validator = Validators.makeChain()
        .link(Validators.string)
        .link(Validators.pattern(/[a-z]+@gmail.com$/i));
      expect(validator('edede@gmail.com')).toBe(true);
    });

    test('validates a chain with typed params', () => {
      const validator = Validators.makeChain()
        .link(Validators.string)
        // at this point I know it's a string
        .link<string>((v) => v.length > 10)
        .link(
          Validators.pattern(
            /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}Z$/i
          )
        )
        .link(Validators.date);

      expect(validator('2020-01-01T00:00:00Z')).toBe(true);
      expect(validator('2020-01-01T00:00:00')).toBe(false);
    });

    test('complex types', () => {
      const validator = Validators.makeChain()
        .link(Validators.arrayOf(Validators.number))
        // at this point I know it's a string
        .link<number[]>((v) => v.length > 2)
        .link<number[]>((v) => v.every((n) => n % 2 === 0));

      expect(validator(['string', 'string', 'string', 1, 2, 3])).toBe(false);
      expect(validator(['string', 'string', 1, 2])).toBe(false);
      expect(validator([1, 2, 3])).toBe(false);
      expect(validator([2, 4, 6])).toBe(true);
    });
  });
});
