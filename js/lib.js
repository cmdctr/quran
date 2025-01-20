export function fontAdjuster() {
    const elements = Array.from(document.querySelectorAll('*')).reduce((newarray, element) => {
        if (
            !['HTML', 'BODY', 'MAIN', 'DIALOG', 'HEAD', 'META', 'TITLE', 'SCRIPT', 'STYLE', 'LINK'].includes(element.tagName) &&
            !element.classList.contains('noslide')
        ) {
            element.setAttribute('data-size', parseFloat(window.getComputedStyle(element).fontSize))
            newarray.push(element)
        }
        return newarray
    }, [])
    
    let scaleFactor = 1
    
    return function({ target }) {
        scaleFactor += target.id === 'increase' && scaleFactor < 1.9 ? 0.2 : target.id === 'decrease' && scaleFactor > 1 ? -0.2 : 0
        
        if (scaleFactor == 0) return
        
        elements.forEach(element => {
            element.style.fontSize = (element.getAttribute('data-size') * parseFloat(scaleFactor)) + 'px'
        })
    }
}

export function fontSlider() {
    const elements = Array.from(document.querySelectorAll('*')).reduce((newarray, element) => {
        if (
            !['HTML', 'BODY', 'MAIN', 'DIALOG', 'HEAD', 'META', 'TITLE', 'SCRIPT', 'STYLE', 'LINK'].includes(element.tagName) &&
            !element.classList.contains('noslide')
        ) {
            element.setAttribute('data-size', parseFloat(window.getComputedStyle(element).fontSize))
            newarray.push(element)
        }
        return newarray
    }, [])
    
    return function({ target }) {
        elements.forEach(element => {
            element.style.fontSize = (element.getAttribute('data-size') * parseFloat(target.value)) + 'px'
        })
    }
}

export function indexed(dbName, storeName) {
    let request, store, blob, reader
    
    function open(permission) {
        return new Promise((resolve, reject) => {
            request = indexedDB.open(dbName, 1)
            
            request.onupgradeneeded = ({ target }) => {
                if (!target.result.objectStoreNames.contains(storeName)) {
                    target.result.createObjectStore(storeName)
                }
            }
    
            request.onsuccess = ({ target }) => resolve(target.result.transaction(storeName, permission).objectStore(storeName))
            request.onerror = ({ target }) => reject(target.error)
        })
    }
    
    async function set(key, value) {
        store = await open('readwrite')
        
        blob = new Blob([JSON.stringify(value)], { type: "application/json" })
        
        return new Promise((resolve, reject) => {
            request = store.put(blob, key)
            
            request.onsuccess = () => resolve(true)
            request.onerror = ({ target }) => reject(false)
        })
    }
    
    async function get(key) {
        store = await open('readonly')
        
        return new Promise((resolve, reject) => {
            request = store.get(key)
        
            request.onsuccess =  ({ target }) => {
                if (target.result) {
                    reader = new FileReader()
                    
                    reader.onload = () => resolve(JSON.parse(reader.result))
                    reader.onerror = (e) => reject(e.target.error)
                    
                    reader.readAsText(target.result)
                }
                else {
                    resolve(null)
                }
            }
            request.onerror = ({ target }) => reject(target.error)
        })
    }
    
    return { set, get }
}

export function getElementsById(...args) {
    return args.reduce((obj, id) => {
    										obj[id] = document.querySelector(`#${id}`)
    										return obj
    }, {})
}

export function pagination(perpage = 10) {
    let
        tp = 0,
        pd = 0,
        pu = 0,
        range = []
    
    return {
        currentPage: 1,
        totalItems: 0,
        
        get start() {
            return (+this.currentPage -1) * perpage
        },
            
        get end() {
            return this.currentPage * perpage
        },
            
        paginate() {
            tp = Math.ceil(this.totalItems / perpage)
            pd = +this.currentPage -perpage
            pu = +this.currentPage +perpage
            pd = pd > 0 ? pd : 1
            pu = pu > tp ? tp : pu
            
            switch (true) {
                case (tp < 8):
                    range = [1, 2, 3, 4, 5, 6, 7].slice(0, tp)
                    break
                case (this.currentPage > 4 && this.currentPage < +tp -3):
                    range = [1, `(${pd})`, +this.currentPage -1, this.currentPage, +this.currentPage +1, `(${pu})`, tp]
                    break
                case (this.currentPage > +tp -4):
                    range = [1, `(${pd})`, +tp -4, +tp -3, +tp -2, +tp -1, tp]
                    break
                default:
                    range = [1, 2, 3, 4, 5, `(${pu})`, tp]
            }
            
            return range
                .map(p => `<button value="${p}">${p}</button>`)
                .join('')
                .replace(/value=.?\((\d+?)\).?>\(\d+?\)<\/button>/gm, `title="${perpage} صفحات" value="$1">...</button>`)
                .replace(`>${this.currentPage}</button>`, ` disabled>${this.currentPage}</button>`)
        }
    }
}

export function searchnormal(
    word,
    nonconsonant = "[^ء-غف-يٱ ]*?"
) {
    return String(word)
        .replace(/[,@\.\[\]\(\)\{\}\-\|\^\!\$\*\+\=\\]/g, "")
        
        .replace(/([َُِ])([ّٔ])/g, "$2$1")
        
        .replace(/( و?يا) /g, "$1")
        .replace(/^(و?يا) /g, "$1")
        
        .replace(/الذ/g, "[@1]")
        .replace(/الل/g, "[@2]")
        .replace(/ا/g, "[@3]")
        .replace(/ي/g, "[@4]")
        .replace(/ى/g, "[@5]")
        .replace(/[أءؤئ]/g, "[@6]")
        .replace(/آ/g, "[@7]")
        .replace(/و/g, "[@8]")
        .replace(/ن/g, "[@9]")
    			 
        .replace(/\]([^\[]+?)\[/g, "],$1,[")
        .replace(/^([^\[]+?)\[/g, "$1,[")
        .replace(/\]([^\]]+)$/g, "],$1")
        .replace(/\]\[/g, "],[")
    
        .split(",")
    
        .reduce((reduced, entry) => 
            entry.startsWith("[")
            ? reduced + entry + nonconsonant
            : reduced + entry.split("").join(nonconsonant) + nonconsonant
        , "")
    
        .replace(/\[@1\]/g, "ٱلَّذِ")
        .replace(/\[@2\]/g, "((آ|ٱ)للّ|ٱلَّ(?=.[َْٰ]))")
        .replace(/\[@3\]/g, "([اٰٱ]|وٰ|ىٰ)")
        .replace(/\[@4\]/g, "(ا۟[^ ]|[ىيۦـ](?![ٰٔ]))")
        .replace(/\[@5\]/g, "([اۦٰى](?![َّْ]))")
        .replace(/\[@6\]/g, "[ٔئءإؤأ]")
        
        .replace(/\[@7\]/g, "(ءَا|َٔا|آ|َٔـٰ)")
        .replace(/\[@8\]/g, "[وۥ]")
        .replace(/\[@9\]/g, "(ي۟)?[نۨ]")
}

export function searchdiacritics(
    diacritics,
    mark = {
        c: "[\u0621-\u064A]",
        u: "[\u064B-\u0652]",
        n: "[^\u064B-\u0652]",
        a: "\u064E",
        e: "\u0650",
        o: "\u064F",
        i: "\u0652",
        w: "\u0651",
        s: "\u0020"
    }
) {
    return mark.s + "(" +
        diacritics.replace(/(.)/g, "@?$1")
            .replace(/@\?\-/g, "@(?=" + mark.n + ")")
            .replace(/@\?\+/g, "(@?" + mark.u + "|@(?=" + mark.n + "))")
            .replace(/\u0651@\?/g, mark.w)
            .replace(/@/g, mark.c)
        + ")(.*?(?=" + mark.s + "))"
}

export function ar(str) {
    return String(str).replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'.substr(digit, 1))
}

export function en(str) {
    return String(str).replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
}