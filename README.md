# Validate

> Totally unnecessary but fun. 

An experimental POC for validating function parameters before execution.

This idea came about while working on a React project which was driven via a remote server using socket.io. 

Function requests would be sent down with parameters and they would be executed in the browser. To prevent malicious payloads from executing, this would secure local functions by ensuring their parameters always passed custom validations.

## Examples

### Using built in validators
```ts
import { ValidatedFunctions, Validators, ValidationRuleMap } from '@dxede/validate';

// Writing a wrapper for demonstration purposes
function createValidatedCopy<Target, Result>(f: (p: Target) => Result, rules: ValidationRuleMap<Target>) {
  return ValidatedFunctions.create<Target, Result>(rules, f);
}

// Set up our scenario, in this case we'll work with simple coordinates
type Coordinates = { x: number, y: number };
type CoordinateOperator<Result = number> = (c: Coordinates) => Result;

// Write a function to print coordinates
const _print: CoordinateOperator<string> = ({ x, y }) => `(${x}, ${y})`;

// Create a validated copy of print
const print = createValidatedCopy<Coordinates, ReturnType<typeof _print>>(print, { x: Validators.number, y: Validators.number  });

// Now we can use print
print({ x: 9, y: 10 }) // Success
print({ x: 9, y: '10' }) // Error
```

### Using custom validators

There's really no restriction on how you validate, as long as your validation function returns a boolean. This also makes it easy to validate nested objects.

```ts
const print = createValidatedCopy<Coordinates, ReturnType<typeof _print>>(print, { x: (x) => x%2 === 0, y: (y) => `${y}`.includes('1')  });

print({ x: 9, y: 10 }) // Error, 9%2 is not 0
print({ x: 6, y: 22 }) // Error, 22 as a string does not contain "1"
```
