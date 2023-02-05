type Switchable = undefined | number | string | boolean;
declare function sw<T extends Switchable, R extends Switchable>(...args: T[]): Sw<T, R>;
declare class Sw<T extends Switchable, R extends Switchable | void> {
    #private;
    constructor(...args: T[]);
    case(...expectation: T[]): this;
    break(): this;
    statement(fn: (arg?: R) => Promise<R | void> | R | void): this;
    default(fn: (arg?: R) => Promise<R | void> | R | void): this;
    close(): Promise<R | void>;
}
export default sw;
