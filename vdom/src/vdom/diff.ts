export type Patch = ($node: HTMLElement) => HTMLElement

import type { Attrs, VNode } from './createElement'
import { render } from './render'

const diffAttrs = (oldAttrs: Attrs, newAttrs: Attrs) => {
  const patches: Patch[] = []
  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    patches.push($node => {
      $node.setAttribute(k, v)
      return $node
    })
  }
  // remove old attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k)
        return $node
      })
    }
  }
  return ($node: HTMLElement) => {
    for (const patch of patches) {
      patch($node)
    }
  }
}

export const diff = (vOldNode: VNode, vNewNode: VNode) => {
  if (vNewNode === undefined) {
    return ($node: HTMLElement) => {
      $node.remove()
      return undefined
    }
  }
  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    if (vOldNode !== vNewNode) {
      return ($node: HTMLElement) => {
        const $newNode = render(vNewNode)
        $node.replaceWith()
        return $newNode
      }
    } else {
      return ($node: HTMLElement) => undefined
    }
  }
  if (vOldNode.tagName !== vNewNode.tagName) {
    return ($node: HTMLElement) => {
      const $newNode = render(vNewNode)
      $node.replaceWith($newNode)
      return $newNode
    }
  }
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
  //const patchChildren = diffChildren(vOldNode.children, vNewNode.children)
  return ($node: HTMLElement) => {
    patchAttrs($node)
    //patchChildren($node)
    return $node
  }
}
