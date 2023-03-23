import type { Elem, VNode } from './createElement'

export const render = (vNode: VNode) => {
  if (typeof vNode === 'string')
    return document.createTextNode(vNode)
  return renderElem(vNode)
}

export const renderElem = ({ tagName, attrs, children }: Elem) => {
  const $el = document.createElement(tagName)

  for (const [k, v] of Object.entries(attrs)) {
    $el.setAttribute(k, v)
  }

  for (const child of children) {
    const $child = render(child)
    $el.append($child)
  }

  return $el
}
