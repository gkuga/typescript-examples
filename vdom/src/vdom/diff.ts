export type Patch<T extends ChildNode> = ($node: T) => ChildNode | void

import type { Attrs, VNode } from './createElement'
import { render } from './render'

interface Iter<T> {
  readonly length: number
  [index: number]: T
}

const zip = <T, U>(xs: Iter<T>, ys: Iter<U>) => {
  const zipped: Array<[T, U]> = []
  for (let i = 0; i < Math.min(xs.length, ys.length); i++) {
    zipped.push([xs[i], ys[i]])
  }
  return zipped
}

type DiffAttrs = (oldAttrs: Attrs, newAttrs: Attrs) => Patch<Element>

const diffAttrs: DiffAttrs = (oldAttrs, newAttrs) => {
  const patches: Patch<Element>[] = []
  // set new attributes
  for (const [k, v] of Object.entries(newAttrs)) {
    if (!(k in oldAttrs) || v !== oldAttrs[k]) {
      patches.push($node => {
        $node.setAttribute(k, v)
        return $node
      })
    }
  }
  // remove old attributes
  for (const [k, v] of Object.entries(oldAttrs)) {
    if (!(k in newAttrs)) {
      patches.push($node => {
        $node.removeAttribute(k)
      })
    }
  }
  return $node => {
    for (const patch of patches) {
      patch($node)
    }
  }
}

type DiffChildren = (oldVChildren: VNode[], newVChildren: VNode[]) => Patch<Element | Text>

const diffChildren: DiffChildren = (oldVChildren, newVChildren) => {
  const childPatches: Patch<Element | Text>[] = []
  for (const [oldVChild, newVChild] of zip(oldVChildren, newVChildren)) {
    childPatches.push(diff(oldVChild, newVChild))
  }
  const additionalPatches: Patch<Element | Text>[] = []
  for (const additionalVChild of newVChildren.slice(oldVChildren.length)) {
    additionalPatches.push($node => {
      $node.appendChild(render(additionalVChild))
      return $node
    })
  }
  return $parent => {
    for (const [patch, $child] of zip(childPatches, $parent.childNodes)) {
      if ($child instanceof Element || $child instanceof Text)
        patch($child)
      else
        throw new Error(JSON.stringify($child))
    }
    for (const patch of additionalPatches) {
      patch($parent)
    }
    return $parent
  }
}

type Diff<T extends ChildNode> = (vOldNode: VNode, vNewNode: VNode) => Patch<T>

export const diff: Diff<Element | Text> = (vOldNode: VNode, vNewNode?: VNode) => {
  if (vNewNode === undefined) {
    return $node => {
      $node.remove()
    }
  }
  if (typeof vOldNode === 'string' || typeof vNewNode === 'string') {
    if (vOldNode !== vNewNode) {
      return $node => {
        const $newNode = render(vNewNode)
        $node.replaceWith($newNode)
        return $newNode
      }
    } else {
      return $node => { }
    }
  }
  if (vOldNode.tagName !== vNewNode.tagName) {
    return $node => {
      const $newNode = render(vNewNode)
      $node.replaceWith($newNode)
      return $newNode
    }
  }
  const patchAttrs = diffAttrs(vOldNode.attrs, vNewNode.attrs)
  const patchChildren = diffChildren(vOldNode.children, vNewNode.children)
  return $node => {
    if ($node instanceof Element) {
      patchAttrs($node)
      patchChildren($node)
    } else {
      throw new Error(JSON.stringify($node))
    }
    return $node
  }
}
