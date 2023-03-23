export const mount = ($node: HTMLElement, $target: HTMLElement) => {
  $target.replaceWith($node)
  return $node
}
