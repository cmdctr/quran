import app from './logic.js'

app.resetHTML = function() {
    	app.dom.search.value = app.input.value.replace(/\S/, '')
    	
    	; ['stats', 'content', 'pages'].forEach(element => app.dom[element].innerHTML = '')
										
										app.input.lastvalue = app.input.value
}

app.setHTML = function() {
    	app.dom.content.innerHTML = (
    	   `<ol start="${+app.pages.start + 1}">`
    	   +
    	   app.filter.results
    	       .slice(app.pages.start, app.pages.end)
    	       .map(entry =>
                	`<li>
                	      ${entry.ayah}<code data-tip="${entry.anum}:${entry.snum}">${entry.surah}:${entry.anum}</code>
                	</li>
                	`.replace(app.filter.marking, app[app.mode].highlighting)
    	             .replace(/[\u06E2\u06ED]/g, '')
    	             .replace(/\u0671/g, '\u0627')
    	       )
    	       .join('')
    	   +
    	   `</ol>`
    	)
    	
    	app.dom.stats.innerHTML = app.ar(
        	app.pages.totalItems
        	+
        	(app.filter.total ? '/' + app.filter.total : '')
    	)
    			        
    	app.dom.pages.innerHTML = app.ar(
        	app.pages.paginate()
    	)
    	
    	window.scrollTo({ top: app.pages.currentPage == 1 ? 0 : document.documentElement.scrollHeight })
}

export default app