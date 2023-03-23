export type Attrs = { [keys: string]: string }

export type Elem = {
  tagName: keyof HTMLElementTagNameMap
  attrs: Attrs
  children: Array<VNode>
}

export type VNode = string | Elem

export type CreateElement = (
  tagName: keyof HTMLElementTagNameMap,
  options: {
    attrs?:  Attrs,
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
