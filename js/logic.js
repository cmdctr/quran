import app from './data.js'

app.searchInAyah = function() {
										[ app.input.keyword, app.input.keynum ] = app[`search${app.mode}`](app.input.value).split(':')
										
										app.filter.marking = new RegExp(`(${app.input.keyword})(?=.+t[^l]+l)`, 'g')
										
										app.filter.results = app.scripture[app.mode].filter(obj => {
																				app.filter.verses = (obj.ayah.match(new RegExp(app.input.keyword, 'g')) || []).length
    											app.filter.total += app.filter.verses
    											return !!app.filter.verses
    	})
}
										
app.searchInTitle = function() {
    	[ app.input.keyword, app.input.keynum ] = app.input.value.replace(/\s*:\s*/g, ':').split(':')
    			            
    	app.filter.marking = null
    	
    	app.filter.results = /^[٠-٩]+$/.test(app.input.keyword)
        	? app.scripture.normal.filter(obj => (
            	(app.input.keyword == obj.snum)
            	&&
            	(app.input.keynum == '' || app.input.keynum == obj.anum)
        	))
        	: app.scripture.normal.filter(obj => (
            	(app.input.keyword == '' || obj.surah.includes(app.input.keyword))
            	&&
            	(app.input.keynum == '' || app.input.keynum == obj.anum)
        	))
}

app.diacritics = {
										validate() {
																				app.input.value = app.ar(app.input.value
																				    .replace(/[^\u064B-\u0652\s\+\-]/g, '')
																				    .replace(/\s/g, '')
																				)
																				
																				app.dom.search.value = '   ' + app.input.value
    																				.replace(/(\S)/g, '$1   ')
    																				.replace(/\s{4,}/g, '   ')
    																				.trimRight()
										},
										
										filter() {
																				app.searchInAyah()
										},
										
										highlighting(...args) {
																				return ` <mark>${args[2]}</mark>${args[(app.input.value.match(/\+/g) || []).length + 3]}`
										}
}

app.normal = {
										validate() {
																				app.input.value = app.ar(app.input.value
    																				.replace(/[^\u0621-\u06520-9٠-٩\s\:]/g, '')
    																				.replace(/\s{2,}/g, ' ')
																				)
    																				
																				app.dom.search.value = app.input.value
										},
										
										filter() {
																				app.input.value.includes(':')
    																				? app.searchInTitle()
    																				: app.searchInAyah()
										},
										
										highlighting(...args) {
																				return `<mark>${args[1]}</mark>`
										}
}

export default app