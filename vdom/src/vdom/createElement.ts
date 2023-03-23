export type VNode = {
  tagName: keyof HTMLElementTagNameMap
  attrs: { [keys: string]: string }
  children: Array<VNode>
}

export type CreateElement = (
  tagName: keyof HTMLElementTagNameMap,
  options: {
    attrs?: { [keys: string]: string },
    children?: Array<VNode>,
  },
) => VNode

export const createElement: CreateElement = (tagName, { attrs = {}, children = [] }) => {
  return {
    tagName,
    attrs,
    children,
  }
}
