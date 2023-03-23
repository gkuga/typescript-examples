export const mount = ($node: Text | HTMLElement, $target: Text | HTMLElement) => {
  $target.replaceWith($node)
  return $node
}
