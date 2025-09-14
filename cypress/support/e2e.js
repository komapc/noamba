// Import commands.js
import './commands'

// Wait for fonts to load before tests
Cypress.Commands.add('waitForFontLoad', () => {
  cy.window().then((win) => {
    return new Promise((resolve) => {
      if (win.document.fonts && win.document.fonts.ready) {
        win.document.fonts.ready.then(resolve)
      } else {
        // Fallback for browsers without Font Loading API
        setTimeout(resolve, 1000)
      }
    })
  })
})
