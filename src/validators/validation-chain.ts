import { TypedValidator, ValidatorFn } from './types';

type ChainableValidator<T> = TypedValidator<T> & {
  link: <Y>(fn: (arg: Y) => boolean) => ChainableValidator<Y>;
};

export class ValidationChain {
  private head: Node | null = null;
  private tail: Node | null = null;

  public link<T = unknown, I = unknown>(
    fn: (arg: I) => boolean
  ): ChainableValidator<T> {
    const node = new Node(fn as ValidatorFn);

    if (!this.head) {
      this.head = node;
      this.tail = this.head;
    }

    this.tail?.connect(node);
    this.tail = node;

    const call = (arg: unknown): arg is T => this.validate<T>(arg);
    return Object.assign(call, {
      link: this.link.bind(this),
    });
  }

  private validate<T>(arg: unknown): arg is T {
    let current = this.head;

    while (current) {
      if (!current.validator || !current.validator(arg)) {
        return false;
      }
      current = current.next;
    }

    return true;
  }
}

class Node {
  constructor(public validator: ValidatorFn, public next: Node | null = null) {}

  public connect(next: Node) {
    this.next = next;
    return next;
  }
}
