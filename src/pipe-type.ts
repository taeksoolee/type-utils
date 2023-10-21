type FirstType<T> = T extends [infer First, ...infer Rest] ? First : never;
type LastType<T> = T extends [...infer Rest, infer Last] ? Last : never;

type Chain = [string, string, string, number];
type Foo = LastType<Chain>;

type ChainFunctions<T, R=[]> = T extends [infer First, infer Second, ...infer Rest] ? ChainFunctions<[Second, ...Rest], [...(R extends unknown[] ? R : []), (input: First) => Second]> : R;

type Test = ChainFunctions<[string, string, string, number, string, string, number]>;

const pipe = <C extends unknown[]>(...functions: ChainFunctions<C>) => (initial: FirstType<C>) => {
  return (functions as Function[]).reduce((a, c) => {
    return c(a);
  }, initial) as LastType<C>;
};

const plusOne = (val: number) => val + 1;
const toFixed = (val: number) => val.toFixed(2);

const c = pipe<[number, number, string]>(
  plusOne,
  toFixed,
);

const r1 = c(1);

const removeDash = (input: string) => input.replace(/-/g, '');
const sliceEightChar = (input: string) => input.slice(0, 8);

const p = '1993-02-11';

const r2 = pipe<[string, string, string]>(
  removeDash,
  sliceEightChar,
)(p);

console.log(r2);

const numToDate = (input: number) => new Date(input);
const dateToStr = (input: Date) => input.toString(); 

const numToDateStr = pipe<[number, Date, string]>(
  numToDate,
  dateToStr,
);

const r3 = numToDateStr(10000);
console.log(r3);