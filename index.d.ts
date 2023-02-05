type Switchable = undefined | number | string | boolean;
/**
 * @param args The input to switch over.
 * @returns A switch interface.
 */
declare function sw<T extends Switchable, R extends Switchable>(args: T[]): Sw<T, R>;
declare class Sw<T extends Switchable, R extends Switchable | void> extends Function {
    #private;
    constructor(value: Switchable[]);
    case(expectation: T[]): this;
    break(): this;
    do(fn: (arg?: R) => Promise<R | void> | R | void): this;
    default(fn: (arg?: R) => Promise<R | void> | R | void): this;
    execute(): Promise<R | void>;
}
export default sw;
