import app from './events.js'

app.dom.search.oninput = app.dispatchInput
    
app.dom.pages.onclick = app.dispatchPage

app.dom.menu.onclick = app.dispatchHelp

app.dom.close.onclick = app.dispatchHelp

app.dom.inner.ontoggle = app.dispatchDetails

app.dom.slider.oninput = app.dispatchSlider

app.dom.search.dispatchEvent(new Event('input'))