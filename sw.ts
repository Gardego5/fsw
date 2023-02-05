type Switchable = undefined | number | string | boolean;

function sw<T extends Switchable, R extends Switchable>(...args: T[]) {
  return new Sw<T, R>(...args);
}

class Sw<T extends Switchable, R extends Switchable | void> {
  #correct = false;
  #done = false;
  #args: Switchable[];
  #stack: ((arg?: R) => Promise<R | void> | R | void)[] = [];

  constructor(...args: T[]) {
    this.#args = args;
  }

  case(...expectation: T[]): this {
    if (this.#args.reduce((p, v, i) => p && expectation[i] == v, true))
      this.#correct = true;

    console.log(this.#args, expectation);

    return this;
  }

  break(): this {
    if (this.#correct) this.#done = true;

    this.#correct = false;
    return this;
  }

  statement(fn: (arg?: R) => Promise<R | void> | R | void): this {
    if (this.#done) return this;
    if (this.#correct) this.#stack.push(fn);

    return this;
  }

  default(fn: (arg?: R) => Promise<R | void> | R | void): this {
    if (this.#done) return this;

    this.#stack.push(fn);
    return this;
  }

  async close(): Promise<R | void> {
    let funnelled;
    for (const fn of this.#stack) funnelled = await fn(funnelled ?? undefined);

    if (funnelled) return funnelled;
  }
}

export default sw;
