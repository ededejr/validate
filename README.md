# Validate

`validate` is an experimental module for validating pojos.

## Installation

```
npm install @ededejr/validate
```

## Usage

### Validating an object

The provided `validate` function can be used to test a given object against a set of rules.

```ts
import { validate } from '@ededejr/validate';

const isValid = validate(
  {
    name: 'Edede',
    handle: '@ededejr',
  },
  {
    name: (name) => name.length === 5,
    handle: (handle) => handle.startsWith('@'),
  }
); // true;
```

This has its uses, but can be somewhat cumbersome to do this for every object.

### Reusing validation rules

Rather than inlining validation rules for an object, we can create a validator which expects a certain object type and reuse it.

```ts
import { createObjectValidator } from '@ededejr/validate';

interface Person {
  name: string;
  age: number;
}

const validatePerson = createObjectValidator<Person>({
  name: Validators.string,
  age: (number) => number > 0,
});

const isPerson = validatePerson({ name: 'Cole', age: 1 }); // true;
```

### Creating functions with validated parameters

Extending things further, we can create special functions that validate their parameters before executing. This can be ideal for situations where remote execution is permitted, or inputs come over the wire.

```ts
import { createValidatedFunction, Validators } from '@ededejr/validate';

// Set up our scenario, in this case we'll work with simple coordinates
type Coordinates = { x: number; y: number };
type CoordinateOperator<Result = number> = (c: Coordinates) => Result;

// Write a function to print coordinates
const _print: CoordinateOperator<string> = ({ x, y }) => `(${x}, ${y})`;

// Create a validated copy of print
const print = createValidatedFunction<Coordinates, ReturnType<typeof _print>>(
  _print,
  {
    x: Validators.number,
    y: Validators.number,
  }
);

// Now we can use print
print({ x: 9, y: 10 }); // Success
print({ x: 9, y: '10' }); // Error
```

### Validating deeply nested objects

It is also possible to specify how deep your validations need to go, this is especially useful for nested Objects.

```ts
import {
  createValidatedFunction,
  createObjectValidator,
  Validators,
} from '@ededejr/validate';

// Bringing back coordinates
type Coordinate = { x: number; y: number };
type CoordinateOperator<Result = number> = (c: Coordinate) => Result;

// Let's create a line type
type Line = { start: Coordinate; end: Coordinate };

// Create a coordinate validator that ensures a coordinate is always valid
const coordinateValidator = createObjectValidator<Coordinate>({
  x: Validators.number,
  y: Validators.number,
});

// Create a distance function that measures the distance between two coordinates
const _distance = ({ start, end }: Line) =>
  Math.sqrt(
    (start.x - end.x) *
      (start.x - end.x) *
      (start.y - end.y) *
      (start.y - end.y)
  );

// Created a validated version of distance
const distance = createValidatedFunction<Line, ReturnType<typeof _distance>>(
  _distance,
  {
    start: coordinateValidator,
    end: coordinateValidator,
  }
);

// Now we can use the validated distance
distance({ start: { x: 10, y: 25 }, end: { x: 50, y: 40 } }); // Success
distance({ start: { x: 10, y: 25 }, end: { x: '50', y: '40' } }); // Error
```
