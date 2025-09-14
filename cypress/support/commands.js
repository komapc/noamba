// Custom command for typing Hebrew text with proper RTL handling
Cypress.Commands.add('typeHebrewText', (selector, text) => {
  cy.get(selector).then(($el) => {
    $el[0].value = text
    $el.trigger('input')
  })
})

// Custom command to check if canvas has been rendered
Cypress.Commands.add('canvasShouldBeRendered', (selector) => {
  cy.get(selector).should(($canvas) => {
    const canvas = $canvas[0]
    const ctx = canvas.getContext('2d')
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
    
    // Check if canvas has non-transparent content
    let hasContent = false
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] > 0) {
        hasContent = true
        break
      }
    }
    
    expect(hasContent).to.be.true
  })
})
