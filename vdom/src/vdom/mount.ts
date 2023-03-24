export const mount = ($node: Text | Element, $target: Element) => {
  $target.replaceWith($node)
  return $node
}
