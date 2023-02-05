type Switchable = undefined | number | string | boolean;

/**
 * @param args The input to switch over.
 * @returns A switch interface.
 */
function sw<T extends Switchable, R extends Switchable>(args: T[]) {
  return new Sw<T, R>(args);
}

class Sw<T extends Switchable, R extends Switchable | void> extends Function {
  #correct = false;
  #done = false;
  #args: Switchable[];
  #stack: ((arg?: R) => Promise<R | void> | R | void)[] = [];

  constructor(value: Switchable[]) {
    super("return arguments.callee.execute()");
    this.#args = value;
  }

  case(expectation: T[]): this {
    if (this.#args.reduce((p, v, i) => p && expectation[i] == v, true))
      this.#correct = true;

    return this;
  }

  break(): this {
    if (this.#correct) this.#done = true;

    this.#correct = false;
    return this;
  }

  do(fn: (arg?: R) => Promise<R | void> | R | void): this {
    if (this.#done) return this;
    if (this.#correct) this.#stack.push(fn);

    return this;
  }

  default(fn: (arg?: R) => Promise<R | void> | R | void): this {
    if (this.#done) return this;

    this.#stack.push(fn);
    return this;
  }

  async execute(): Promise<R | void> {
    let funnelled;
    for (const fn of this.#stack) funnelled = await fn(funnelled ?? undefined);

    if (funnelled) return funnelled;
  }
}

export default sw;
