import Validators from '../validators';

describe('Validators', () => {
  describe('array', () => {
    test('Can validate an array type', () => {
      expect(Validators.array([])).toBe(true);
    });

    test('Fails non-array types', () => {
      expect(Validators.array('array')).toBe(false);
      expect(Validators.array(1)).toBe(false);
      expect(Validators.array({})).toBe(false);
    });
  });

  describe('number', () => {
    test('Can validate an number type', () => {
      expect(Validators.number(1)).toBe(true);
    });

    test('Fails non-number types', () => {
      expect(Validators.number('number')).toBe(false);
      expect(Validators.number([])).toBe(false);
      expect(Validators.number({})).toBe(false);
    });
  });

  describe('object', () => {
    test('Can validate an object type', () => {
      expect(Validators.object({})).toBe(true);
    });

    test('Fails non-object types', () => {
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
    test('Can validate an string type', () => {
      expect(Validators.string('string')).toBe(true);
    });

    test('Fails non-string types', () => {
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
    test('Can validate an boolean type', () => {
      expect(Validators.boolean(true)).toBe(true);
    });

    test('Fails non-boolean types', () => {
      expect(Validators.boolean({})).toBe(false);
      expect(Validators.boolean([])).toBe(false);
      expect(
        Validators.boolean(() => {
          return;
        })
      ).toBe(false);
    });
  });
});
