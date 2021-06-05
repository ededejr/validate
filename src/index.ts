import { ValidationRuleMap } from "./types";
import { validate, Validators } from "./validate";
import ValidatedFunctions from "./ValidatedFunctions";

function createValidatedCopy<Target, Result>(f: (p: Target) => Result, rules: ValidationRuleMap<Target>) {
  return ValidatedFunctions.create<Target, Result>(rules, f);
}


/**
 * Simple numeric params
 */
type Coordinates = { x: number, y: number };
type CoordinateOperator<Result = number> = (c: Coordinates) => Result;

const multiply: CoordinateOperator = ({ x, y }) => x * y;
const divide: CoordinateOperator = ({ x, y }) => x / y;
const print: CoordinateOperator<string> = ({ x, y }) => `(${x}, ${y})`;

const vMultiply = createValidatedCopy<Coordinates, number>(multiply, { x: Validators.number, y: Validators.number });
const vDivide = createValidatedCopy<Coordinates, number>(
  divide,
  { 
    x: Validators.number,
    y: (y) => Validators.number(y) && y > 0
  }
);
const vPrint = createValidatedCopy<Coordinates, string>(print, { x: Validators.number, y: Validators.number });

attempt(vMultiply, { x: 5, y: 6 })
attempt(vDivide, { x: 10, y: 2 });
attempt(vDivide, { x: 10, y: 0 });
attempt(vPrint, { x: 0, y: 0 });


/**
 * Nested objects
 */
type Line = { start: Coordinates, end: Coordinates };
type LineOperator<Result = number> = (c: Line) => Result;
const distance: LineOperator = ({ start, end }) => Math.sqrt( (start.x - end.x)*(start.x - end.x) * (start.y - end.y)*(start.y - end.y) );

const lineValidator = (s: Coordinates) => validate({ x: Validators.number, y: Validators.number }, s);
const vDistance = createValidatedCopy<Line, number>(distance, { start: lineValidator, end: lineValidator });

attempt(vDistance, { start: { x: 10, y: 25 }, end: { x: 50, y: 40 } });


function attempt<T>(f: (...args: T[]) => any, ...args: T[]) {
  try {
    return console.log(f(...args));
  } catch (error) {
    console.log(error.message);  
  }
}