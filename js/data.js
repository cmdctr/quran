import * as lib from './lib.js'

const app = { ...lib }

app.dom = app.getElementsById('expand', 'menu', 'modal', 'close', 'search', 'stats', 'content', 'pages', 'loading', 'inner', 'arrow', 'slider')

app.pages = app.pagination()

app.mode = ''

app.scripture = {
										db: app.indexed('database', 'table'),
										response: null,
										normal: null,
										diacritics: null
}

app.filter = {
										results: [],
										marking: null,
										verses: 0,
										total: 0
}
												
app.input = {
										value: '',
										lastvalue: '',
										firstletter: '',
										keyword: 0,
										keynum: 0
}

export default app