import { createContext, } from "unctx";

export const ctx = createContext<ReturnType<typeof createAwsome>>();

export const useAwesome = ctx.use;

export function createAwsome() {
  let _name = ''

  return {
    setName: (name: string) => _name = name,
    do: () => `awsome ${_name}`,
  }
}
