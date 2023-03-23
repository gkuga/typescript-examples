import type { VNode } from './createElement'

export const render = (vNode: VNode) => {
  const $el = document.createElement(vNode.tagName)

  for (const [k, v] of Object.entries(vNode.attrs)) {
    $el.setAttribute(k, v)
  }

  for (const child of vNode.children) {
    const $child = render(child)
    $el.append($child)
  }

  return $el
}
