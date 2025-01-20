/**
 * Adjusts the font size of all eligible elements on the page based on user interaction.
 * 
 * This function creates a font adjustment utility. It selects all elements on the page
 * (excluding certain tags such as HTML, BODY, MAIN, and elements with the "noslide" css class),
 * stores their original font sizes in a `data-size` attribute, and allows their font sizes 
 * to be dynamically increased or decreased.
 * 
 * @function fontAdjuster
 * @returns {function} A callback function that can be attached to events (e.g., click) to adjust font sizes.
 * 
 * @example
 * // Initialize the font adjuster
 * const adjustFontSize = fontAdjuster();
 * 
 * // Attach the returned function to buttons with IDs 'increase' and 'decrease'
 * document.getElementById('increase').addEventListener('click', adjustFontSize);
 * document.getElementById('decrease').addEventListener('click', adjustFontSize);
 * 
 * @description
 * - The font size of each eligible element is scaled proportionally based on its original font size.
 * - The adjustment is triggered by a target element's ID ('increase' to enlarge, 'decrease' to shrink).
 * - Font size is capped between 1.0x and 2.0x of the original size.
 */
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

/**
 * Creates a slider function to dynamically adjust font sizes of specific elements on the page.
 *
 * This function scans the DOM and identifies all elements except for a predefined set of
 * excluded tags (e.g., `<HTML>`, `<BODY>`, `<SCRIPT>`). It also skips elements with the css class `noslide`.
 * The identified elements have their original font size saved as a `data-size` attribute.
 * 
 * The returned function allows you to adjust the font size of these elements by multiplying their 
 * original size with a value from an input slider.
 *
 * @returns {function} A function that adjusts the font sizes of elements based on a slider input.
 * The function accepts an event object as its argument, and it uses the `value` of the `target` 
 * property from the event to scale the font sizes.
 *
 * @example
 * // Initialize the slider adjustment function
 * const adjustFontSize = fontSlider();
 * 
 * // Attach the returned function to an input slider
 * document.querySelector('#slider').addEventListener('input', adjustFontSize);
 *
 * // HTML example:
 * // <input type="range" id="slider" min="1" max="2" step="0.2" value="1">
 */
function fontSlider() {
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

/**
 * Provides a utility for interacting with an IndexedDB database, allowing for storage and retrieval
 * of JSON-serializable data using key-value pairs.
 *
 * This function creates a wrapper around the IndexedDB API for managing a specific database
 * and object store, offering `set` and `get` methods for easy access.
 *
 * @param {string} dbName - The name of the database to be used or created.
 * @param {string} storeName - The name of the object store to be used or created.
 * @returns {Object} An object containing two asynchronous methods:
 * - `set(key, value)`: Stores a value (JSON-serializable) in the database under the specified key.
 * - `get(key)`: Retrieves a value by key and parses it back into its original form.
 *
 * @example
 * // Initialize the IndexedDB utility
 * const db = indexed('myDatabase', 'myStore');
 *
 * // Save a value to the database
 * await db.set('user', { name: 'John Doe', age: 30 })
 *
 * // Retrieve a value from the database
 * await db.get('user')
 *
 * @functions
 * // open(permission)
 * Opens a connection to the IndexedDB database and object store with the specified permissions.
 *
 * @param {string} permission - The permission level for the transaction ('readonly' or 'readwrite').
 * @returns {Promise<IDBObjectStore>} A promise that resolves to the object store.
 * 
 * // set(key, value)
 * Stores a value in the database under the specified key.
 *
 * @param {string} key - The key under which the value should be stored.
 * @param {*} value - The value to store (must be JSON-serializable).
 * @returns {Promise<boolean>} A promise that resolves to `true` if the operation is successful, or rejects if it fails.
 * 
 * // get(key)
 * Retrieves a value from the database by key.
 *
 * @param {string} key - The key of the value to retrieve.
 * @returns {Promise<*>} A promise that resolves to the retrieved value, or `null` if the key does not exist.
 */
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

/**
 * Retrieves DOM elements by their IDs and returns them as properties of an object.
 *
 * This function takes a list of IDs as arguments, queries the DOM for elements with those IDs, 
 * and returns an object where each key is an ID and the value is the corresponding DOM element.
 *
 * @param {...string} args - A list of IDs to select elements by.
 * @returns {Object<string, HTMLElement|null>} An object containing the selected elements. 
 * If an ID does not exist in the DOM, its value in the object will be `null`.
 *
 * @example
 * // HTML Example:
 * // <div id="header"></div>
 * 
 * // Usage:
 * const elements = getElementsById('header', etc);
 * 
 * // Accessing elements:
 * elements.header.textContent = 'This is the header';
 */
export function getElementsById(...args) {
    return args.reduce((obj, id) => {
    										obj[id] = document.querySelector(`#${id}`)
    										return obj
    }, {})
}

/**
 * Creates a pagination utility to handle item ranges and generate paginated navigation buttons.
 *
 * This function provides a pagination system, calculating ranges and dynamically generating
 * button-based navigation for pages. It includes support for displaying ellipses (`...`) when there
 * are too many pages to display at once.
 *
 * @param {number} [perpage=10] - The number of items per page. Defaults to 10 if not specified.
 * @returns {Object} An object with the following properties and methods:
 * - `currentPage {number}`: The current active page. Default is `1`.
 * - `totalItems {number}`: The total number of items to paginate. Default is `0`.
 * - `start {number}` (getter): The starting index of the current page's items (zero-based).
 * - `end {number}` (getter): The ending index of the current page's items (exclusive).
 * - `paginate() {string}`: Generates and returns the HTML string for the pagination buttons.
 *
 * The method dynamically calculates the pagination range based on the total number of items,
 * the current page, and the number of items per page. Buttons include ellipses (`...`) when
 * skipping pages for brevity. The current page button is disabled.
 *
 * @returns {string} An HTML string representing the pagination buttons.
 *
 * @example
 * // Initialize the pagination system with 5 items per page
 * const pager = pagination(5);
 * 
 * // Set total items
 * pager.totalItems = 42;
 * 
 * // Set current page
 * pager.currentPage = 3;
 * 
 * // Access item range for the current page
 * console.log(pager.start); // 10
 * console.log(pager.end);   // 15
 * 
 * // Generate the pagination buttons
 * const buttonsHTML = pager.paginate();
 * console.log(buttonsHTML);
 * 
 * // Output example:
 * // <button value="1">1</button><button value="2">2</button>
 * // <button value="3" disabled>3</button>
 * // <button value="4">4</button><button value="5">5</button>
 * // <button title="5 صفحات" value="6">...</button><button value="9">9</button>
 * 
 * @locals
 * - `tp {number}`: Total pages
 * - `pd {number}`: Page down (previous range page)
 * - `pu {number}`: Page up (upcoming range page)
 * - `range {array}`: calculated page numbers
 */

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

/**
 * Transforms an Arabic word into a normalized regex-compatible pattern for flexible text matching.
 *
 * This function normalizes Arabic text by handling special characters, replacing Arabic letters with regex patterns,
 * and generating a string pattern that includes variations and non-consonant separators for advanced search functionalities.
 * It is useful for implementing fuzzy or phonetic search in the Quranic text based on the Uthmani version provided by Tanzil.net
 *
 * @param {string} word - The input Arabic word or text to be transformed into a regex-compatible pattern.
 * @param {string} [nonconsonant="[^ء-غف-يٱ ]*?"] - A regex pattern to match non-consonant characters. Defaults to a generic Arabic-compatible pattern.
 * @returns {string} A normalized string representing the transformed word or text as a regex-compatible search pattern.
 *
 * @example
 * // Normalize an Arabic word for regex search
 * const pattern = searchnormal("السلام");
 */
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

/**
 * This function constructs a regex pattern based on user provided Arabic diacritics. It is useful for advanced Quranic text
 * search that considers diacritic variations and is based on the Simple version provided by Tanzil.net
 *
 * @param {string} diacritics - The diacritics to be included in the regex pattern. Special characters 
 * such as `-` or `+` are used for specific matching behaviors:
 * - `-`: Matches letters without diacritics.
 * - `+`: Matches letters with or without diacritics.
 * - `\u0651`: Matches the Shadda (Arabic doubling mark).
 * @param {Object} [mark] - An object defining regex patterns for matching different components of Arabic diacritics.
 * - `mark.c` {string}: Regex pattern to match Arabic letters. Default is `[\u0621-\u064A]`.
 * - `mark.u` {string}: Regex pattern to match diacritic marks. Default is `[\u064B-\u0652]`.
 * - `mark.n` {string}: Regex pattern to match non-diacritic characters. Default is `[^\u064B-\u0652]`.
 * - `mark.a` {string}: Matches the Fatha diacritic (ـَ). Default is `\u064E`.
 * - `mark.e` {string}: Matches the Kasra diacritic (ـِ). Default is `\u0650`.
 * - `mark.o` {string}: Matches the Damma diacritic (ـُ). Default is `\u064F`.
 * - `mark.i` {string}: Matches the Sukoon diacritic (ـْ). Default is `\u0652`.
 * - `mark.w` {string}: Matches the Shadda diacritic (ـّ). Default is `\u0651`.
 * - `mark.s` {string}: Matches space characters. Default is `\u0020`.
 * @returns {string} A regex-compatible string pattern that matches Arabic text with the specified diacritic rules.
 *
 * @example
 * // Match Arabic text with specific diacritics
 * const pattern = searchdiacritics("\u064E\u0651+");
 */
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

/**
 * Converts English digits (0-9) in a string to their Arabic numeral equivalents.
 *
 * This function replaces all occurrences of English digits in the input string with their corresponding Arabic numerals.
 * It is useful for localization or formatting tasks where Arabic numerals are required.
 *
 * @param {string|number} str - The input string or number containing English digits to be converted.
 * @returns {string} A new string with English digits replaced by their Arabic numeral equivalents.
 *
 * @example
 * // Convert English digits to Arabic numerals
 * const result = ar("1234567890");
 * console.log(result); // Output: "١٢٣٤٥٦٧٨٩٠"
 *
 * @example
 * // Convert a mixed string
 * const result = ar("Order 123: $45.67");
 * console.log(result); // Output: "Order ١٢٣: $٤٥.٦٧"
 */
export function ar(str) {
    return String(str).replace(/[0-9]/g, digit => '٠١٢٣٤٥٦٧٨٩'.substr(digit, 1))
}

/**
 * Converts Arabic numerals (٠-٩) in a string to their English digit equivalents (0-9).
 *
 * This function replaces all occurrences of Arabic numerals in the input string with their corresponding English digits.
 * It is useful for tasks that require normalization or conversion of Arabic numerals to standard English digits.
 *
 * @param {string|number} str - The input string or number containing Arabic numerals to be converted.
 * @returns {string} A new string with Arabic numerals replaced by their English digit equivalents.
 *
 * @example
 * // Convert Arabic numerals to English digits
 * const result = en("١٢٣٤٥٦٧٨٩٠");
 * console.log(result); // Output: "1234567890"
 *
 * @example
 * // Convert a mixed string
 * const result = en("السعر ١٢٣: $٤٥.٦٧");
 * console.log(result); // Output: "السعر 123: $45.67"
 */
export function en(str) {
    return String(str).replace(/[٠-٩]/g, digit => '٠١٢٣٤٥٦٧٨٩'.indexOf(digit))
}