type A = {
  a1: number;
  a2: string;
}

type B = Pick<A, "a1">;

const b: B = {
  a1: 1
}


type C = A["a1"];

const c: C = 1

type A1 = {
  a1: { a1_1: number; }
  a2: { a2_1: string; }
}

type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never;
type PickAndFlatten<T, K extends keyof T> = UnionToIntersection<T[K]>;

type Result = UnionToIntersection<A | B | C>;


type D = PickAndFlatten<A1, "a1" | "a2">

const d: D = { a1_1: 1, a2_1: "foo" }

type E = A1["a1"] & A1["a2"]

const e: E = { a1_1: 1, a2_1: "foo" }

type A2 = UnionToIntersection<A1["a1"] | A1["a2"]>;

const f: A2 = { a1_1: 1, a2_1: "foo" }
