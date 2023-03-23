export const mount = ($node: Text | HTMLElement, $target: HTMLElement) => {
  $target.replaceWith($node)
  return $node
}
