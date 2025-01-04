import app from './view.js'

app.dispatchInput = async function({ target }) {
    app.input.value = target.value.trimLeft()
    app.input.firstletter = app.input.value.charAt(0)
										
										app.mode = /[\u0621-\u064A0-9٠-٩:]/.test(app.input.firstletter) ? 'normal' : /[\u064B-\u0652\+\-]/.test(app.input.firstletter) ? 'diacritics' : false
										
										if (!app.mode) return app.resetHTML()
										
    app[app.mode].validate()
										
    if (app.input.value === app.input.lastvalue) return
    app.input.lastvalue = app.input.value
    
    if (!app.scripture[app.mode]) {
    										app.scripture[app.mode] = await app.scripture.db.get(app.mode)
    										
    										if (!app.scripture[app.mode]) {
    																				app.dom.loading.showModal()
    																				
        										app.scripture.response = await fetch(`./json/${app.mode}.json`)
        										app.scripture[app.mode] = await app.scripture.response.json()
    										        										
    																				await app.scripture.db.set(app.mode, app.scripture[app.mode])
    										        										
    																				app.dom.loading.close()
    										}
    }
										
    app.filter.total = 0  
    app[app.mode].filter()
    app.pages.totalItems = app.filter.results.length
    
    app.pages.currentPage = 1
    app.setHTML()
}

app.dispatchPage = function({ target }) {
										if (target.tagName !== 'BUTTON') return
    app.pages.currentPage = app.en(target.value)
    app.setHTML()
}

app.dispatchHelp = function() {
										document.body.classList.toggle('no-scroll')
										app.dom.modal.open ? app.dom.modal.close() : app.dom.modal.showModal()
}

app.dispatchDetails = function({ target }) {
										app.dom.expand.classList.toggle('italic')
										app.dom.arrow.textContent = target.open ? '↑' : '↓'
}

app.dispatchSlider = app.slider()

export default app