class A {
  private static readonly brand: never
}

class B {
  private static readonly brand: never
}

// In the case of static property, type checking passes.
const a: A = new B()
