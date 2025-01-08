/**
 * @global
 * app      OBJECT
 *
 * @properties
 * 
 * app = { ...lib }     IMPORTS
 * 
 * app.mode     STRING  // 'diacritics' | 'normal'
 *
 * app.dom
 *      content     SECTION
 *      pages       SECTION
 *      menu        SPAN
 *      stats       SPAN
 *      close       SPAN
 *      arrow       SPAN
 *      slider      INPUT type=range
 *      search      INPUT type=text
 *      modal       DIALOG
 *      loading     DIALOG
 *      inner       DETAILS
 * 
 * app.scripture
 *      db          OBJECT  // { set, get }
 *      response    PROMISE // fetch response
 *      normal      JSON    // Quran's Uthmani version
 *      diacritics  JSON    // Quran's Simple varsion
 *
 * app.filter
 *      results     ARRAY
 *      marking     REGEX
 *      verses      NUMBER
 *      total       NUMBER
 *
 * app.input
 *      value       STRING
 *      lastvalue   STRING
 *      firstletter STRING
 *      keyword     STRING | NUMBER
 *      keynum      STRING | NUMBER
 *
 * app.pages
 *      currentPage NUMBER
 *      totalItems  NUMBER
 *      start       FUNCTION    // getter
 *      end         FUNCTION    // getter
 *      paginate    FUNCTION
 * 
 * app.diacritics
 *      validate        FUNCTION    // business logic + presentation layer
 *      filter          FUNCTION    // business logic
 *      highlighting    FUNCTION    // business logic
 * 
 * app.normal
 *      validate        FUNCTION    // business logic + presentation layer
 *      filter          FUNCTION    // business logic
 *      highlighting    FUNCTION    // business logic
 *
 * app.searchInAyah     FUNCTION    // business logic
 * app.searchInTitle    FUNCTION    // business logic
 * app.setHTML          FUNCTION    // presentation layer
 * app.resetHTML        FUNCTION    // presentation layer
 * 
 * @events
 * app.dom.search.oninput
 * app.dom.slider.oninput
 * app.dom.pages.onclick
 * app.dom.menu.onclick
 * app.dom.close.onclick
 * app.dom.inner.ontoggle
 * 
 */