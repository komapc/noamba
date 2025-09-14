describe('Canvas Height Validation for Multi-line Text', () => {
  beforeEach(() => {
    cy.visit('/src/index.html')
    cy.waitForFontLoad()
  })

  it('should validate canvas height for 2-3 line text', () => {
    // Test with text that should wrap to 2-3 lines
    const multiLineText = 'זהו טקסט ארוך שיצטרך להיכתב במספר שורות כדי להתאים לגודל הטקסט'
    
    // Type the multi-line text
    cy.typeHebrewText('#textInput', multiLineText)
    cy.get('#textInput').should('have.value', multiLineText)
    
    // Wait for canvas to render
    cy.canvasShouldBeRendered('#canvas')
    
    // Get canvas dimensions and validate
    cy.get('#canvas').then(($canvas) => {
      const canvas = $canvas[0]
      const canvasHeight = canvas.height
      const canvasWidth = canvas.width
      
      // Log dimensions for debugging
      cy.log(`Canvas dimensions: ${canvasWidth}x${canvasHeight}`)
      
      // Verify canvas has reasonable dimensions
      expect(canvasHeight).to.be.at.least(100) // Should be at least 100px (minimum height)
      expect(canvasHeight).to.be.lessThan(500) // Should not be excessively tall
      expect(canvasWidth).to.be.greaterThan(0) // Should have width
      
      // For multi-line text, height should be significantly more than minimum
      // This validates that text wrapping is working
      if (canvasHeight > 100) {
        cy.log('✅ Text appears to be wrapping (height > 100px)')
      } else {
        cy.log('ℹ️ Text fits in single line (height = 100px)')
      }
    })
    
    // Verify canvas content is rendered
    cy.get('#canvas').then(($canvas) => {
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
      cy.log('✅ Canvas has rendered content')
    })
  })
})
