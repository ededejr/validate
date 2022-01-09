# Validate

> An experimental POC for validating function parameters before execution.

This idea was inspired by a React project from a few years ago which was driven via a remote server using Socket.io. Instructions could be sent down with parameters and to be executed in the browser. To prevent malicious payloads from executing, `validate` would secure local functions by ensuring their parameters always passed validations.

## Examples

### Validating an object's shape
```ts
import { validate } from '@ededejr/validate';

interface Person {
  name: string;
  age: number;
}

const isPerson = validate(
  { name: 'Cole', age: 1 }.
  {
    name: Validators.string,
    age: (number) => number > 0
  }
) // true;
```

### Reusing ValidationRuleMaps
```ts
import { createObjectValidator } from '@ededejr/validate';

interface Person {
  name: string;
  age: number;
}

const validatePerson = createObjectValidator<Person>({
  name: Validators.string,
  age: (number) => number > 0
});

const isPerson = validatePerson({ name: 'Cole', age: 1 }) // true;
```

### Validated Functions

There's really no restriction on how you validate, as long as your validation function returns a boolean. This also makes it easy to validate nested objects.

```ts
import { createValidatedFunction, Validators } from '@ededejr/validate';

// Set up our scenario, in this case we'll work with simple coordinates
type Coordinates = { x: number, y: number };
type CoordinateOperator<Result = number> = (c: Coordinates) => Result;

// Write a function to print coordinates
const _print: CoordinateOperator<string> = ({ x, y }) => `(${x}, ${y})`;

const print = createValidatedFunction<Coordinates, ReturnType<typeof _print>>(
  _print, 
  { 
    x: (x) => x%2 === 0, 
    y: (y) => `${y}`.includes('1') 
  }
);

print({ x: 9, y: 10 }) // Error, 9%2 is not 0
print({ x: 6, y: 22 }) // Error, 22 as a string does not contain "1"
```

### Validated functions with provided Validators
```ts
import { createValidatedFunction, Validators } from '@ededejr/validate';

// Set up our scenario, in this case we'll work with simple coordinates
type Coordinates = { x: number, y: number };
type CoordinateOperator<Result = number> = (c: Coordinates) => Result;

// Write a function to print coordinates
const _print: CoordinateOperator<string> = ({ x, y }) => `(${x}, ${y})`;

// Create a validated copy of print
const print = createValidatedFunction<Coordinates, ReturnType<typeof _print>>(
  _print, 
  { 
    x: Validators.number, 
    y: Validators.number  
  }
);

// Now we can use print
print({ x: 9, y: 10 }) // Success
print({ x: 9, y: '10' }) // Error
```

### Validating Nested Objects

You can specify how deep your validations could go, even within Objects!

```ts
import { createValidatedFunction, createObjectValidator, Validators } from '@ededejr/validate';

// Bringing back coordinates
type Coordinate = { x: number, y: number };
type CoordinateOperator<Result = number> = (c: Coordinate) => Result;

// Let's create a line type
type Line = { start: Coordinate, end: Coordinate };

// Create a coordinate validator that ensures a coordinate is always valid
const coordinateValidator = createObjectValidator({ 
  x: Validators.number, 
  y: Validators.number 
});

// Create a distance function that measures the distance between two coordinates
const _distance = ({ start, end }: Line) => Math.sqrt( 
  (start.x - end.x)*(start.x - end.x) * (start.y - end.y)*(start.y - end.y) 
);

// Created a validated version of distance
const distance = createValidatedFunction<Line, number>(
  _distance, 
  { 
    start: coordinateValidator,
    end: coordinateValidator 
  }
);

// Now we can use the validated distance
distance({ start: { x: 10, y: 25 }, end: { x: 50, y: 40 } }) // Success
distance({ start: { x: 10, y: 25 }, end: { x: '50', y: '40' } }) // Error
```
