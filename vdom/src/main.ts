import { createElement } from './vdom/createElement'
import { render } from './vdom/render'
import { mount } from './vdom/mount'

const vApp = createElement('div', {
	attrs: {
		id: 'app',
	},
	children: [
		createElement("img", {
			attrs: {
				src: "https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif",
			},
		}),
	],
})

const $app = render(vApp)

const root = document.getElementById('app')

if (root)
	mount($app, root)

console.log($app)
