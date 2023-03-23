export type Elem = {
  tagName: keyof HTMLElementTagNameMap
  attrs: { [keys: string]: string }
  children: Array<VNode>
}

export type VNode = string | Elem

export type CreateElement = (
  tagName: keyof HTMLElementTagNameMap,
  options: {
    attrs?: { [keys: string]: string },
    children?: Array<VNode>,
  },
) => Elem

export const createElement: CreateElement = (tagName, { attrs = {}, children = [] }) => {
  return {
    tagName,
    attrs,
    children,
  }
}
