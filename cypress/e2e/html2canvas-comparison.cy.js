describe('HTML2Canvas Text Wrapping Validation', () => {
  beforeEach(() => {
    // Set viewport to match the image conditions
    cy.viewport(1280, 720)
    
    cy.visit('/test-html2canvas-simple.html')
    cy.waitForFontLoad()
    
    // Wait for page to fully load
    cy.wait(500)
  })

  it('should FAIL when canvas does not grow vertically for multi-line text', () => {
    // This test should FAIL because HTML2Canvas is not preserving text wrapping
    // When textarea has multiple lines, canvas should also grow vertically
    
    // Set small font size to force wrapping
    cy.get('[onclick="setFontSize(16)"]').click()
    cy.wait(200)
    
    // Use text that will definitely wrap to multiple lines
    const multiLineText = 'ברוכם הבא! זהו טקסט ארוך מאוד שיצטרך להיכתב במספר שורות כדי להתאים לגודל הטקסט'
    
    // Type the multi-line text
    cy.typeHebrewText('#testTextarea', multiLineText)
    cy.get('#testTextarea').should('have.value', multiLineText)
    
    // Wait for text to be processed and wrapped
    cy.wait(500)
    
    // Get textarea dimensions BEFORE capture
    cy.get('#testTextarea').then(($textarea) => {
      const textarea = $textarea[0]
      const textareaHeight = textarea.offsetHeight
      const textareaScrollHeight = textarea.scrollHeight
      const textareaClientHeight = textarea.clientHeight
      
      cy.log(`BEFORE capture - Textarea height: ${textareaHeight}px`)
      cy.log(`BEFORE capture - Scroll height: ${textareaScrollHeight}px`)
      cy.log(`BEFORE capture - Client height: ${textareaClientHeight}px`)
      
      // Check if text is wrapped (scroll height > client height)
      const textIsWrapped = textareaScrollHeight > textareaClientHeight
      cy.log(`Text is wrapped in textarea: ${textIsWrapped}`)
      cy.log(`Scroll height: ${textareaScrollHeight}px, Client height: ${textareaClientHeight}px`)
      
      // If text is not wrapped, try to force it by making textarea narrower and enabling wrapping
      if (!textIsWrapped) {
        cy.log('⚠️ Text is not wrapped - trying to force wrapping by resizing textarea and enabling wrapping')
        
        // Resize textarea to be narrower and enable text wrapping
        cy.get('#testTextarea').then(($textarea) => {
          $textarea[0].style.width = '300px'
          $textarea[0].style.height = 'auto'
          $textarea[0].style.whiteSpace = 'normal'
          $textarea[0].style.wordWrap = 'break-word'
          $textarea[0].style.overflowWrap = 'break-word'
        })
        
        cy.wait(500)
        
        // Check again if text is now wrapped
        cy.get('#testTextarea').then(($textarea) => {
          const newScrollHeight = $textarea[0].scrollHeight
          const newClientHeight = $textarea[0].clientHeight
          const newTextIsWrapped = newScrollHeight > newClientHeight
          
          cy.log(`After resize - Text wrapped: ${newTextIsWrapped}`)
          cy.log(`After resize - Scroll height: ${newScrollHeight}px, Client height: ${newClientHeight}px`)
          
          if (!newTextIsWrapped) {
            cy.log('❌ Text is still not wrapped even after resizing and enabling wrapping - cannot test wrapping preservation')
            throw new Error('Text is not wrapped even after resizing and enabling wrapping - test cannot validate wrapping preservation')
          }
        })
      }
      
      // Capture the textarea with HTML2Canvas
      cy.get('.capture-button').click()
      cy.wait(500)
      
      // Take screenshot to see what's happening
      cy.screenshot('multi-line-text-wrapping-test')
      
      // Get canvas dimensions AFTER capture
      cy.get('#capturedCanvas').then(($canvas) => {
        const canvas = $canvas[0]
        const canvasHeight = canvas.height
        const canvasWidth = canvas.width
        
        cy.log(`AFTER capture - Canvas height: ${canvasHeight}px`)
        cy.log(`AFTER capture - Canvas width: ${canvasWidth}px`)
        
        // Get updated textarea dimensions after potential resize
        cy.get('#testTextarea').then(($textarea) => {
          const currentScrollHeight = $textarea[0].scrollHeight
          const currentClientHeight = $textarea[0].clientHeight
          
          cy.log(`Current textarea scroll height: ${currentScrollHeight}px`)
          cy.log(`Current textarea client height: ${currentClientHeight}px`)
          
          // Calculate expected canvas height based on wrapped text
          const expectedCanvasHeight = currentScrollHeight
          const heightRatio = canvasHeight / expectedCanvasHeight
          
          cy.log(`Expected canvas height (scroll height): ${expectedCanvasHeight}px`)
          cy.log(`Height ratio: ${heightRatio.toFixed(2)}`)
          
          // This should FAIL if HTML2Canvas is not preserving text wrapping
          if (heightRatio < 0.8) {
            cy.log('❌ Canvas height is too short - text wrapping not preserved')
            throw new Error(`Canvas height (${canvasHeight}px) is too short for wrapped text (${expectedCanvasHeight}px). Text wrapping is not preserved.`)
          } else if (heightRatio > 1.2) {
            cy.log('⚠️ Canvas height is too tall - unexpected behavior')
            throw new Error(`Canvas height (${canvasHeight}px) is too tall for wrapped text (${expectedCanvasHeight}px).`)
          } else {
            cy.log('✅ Canvas height matches expected wrapped text height')
            expect(heightRatio).to.be.closeTo(1.0, 0.2)
          }
        })
      })
    })
  })

  it('should validate canvas grows vertically for different text lengths', () => {
    // Test with different text lengths to ensure canvas grows vertically
    const testCases = [
      {
        name: 'Short text (single line)',
        text: 'טקסט קצר',
        shouldWrap: false
      },
      {
        name: 'Medium text (should wrap)',
        text: 'זהו טקסט בינוני שיצטרך להיכתב במספר שורות',
        shouldWrap: true
      },
      {
        name: 'Long text (definitely wraps)',
        text: 'זהו טקסט ארוך מאוד שיצטרך להיכתב במספר שורות כדי להתאים לגודל הטקסט ולהיראות טוב בממשק המשתמש',
        shouldWrap: true
      }
    ]
    
    testCases.forEach((testCase, index) => {
      cy.log(`\n--- Test Case ${index + 1}: ${testCase.name} ---`)
      
      // Type the text
      cy.typeHebrewText('#testTextarea', testCase.text)
      cy.wait(300)
      
      // Get textarea dimensions
      cy.get('#testTextarea').then(($textarea) => {
        const textarea = $textarea[0]
        const textareaHeight = textarea.offsetHeight
        const textareaScrollHeight = textarea.scrollHeight
        const textareaClientHeight = textarea.clientHeight
        
        cy.log(`${testCase.name} - Textarea height: ${textareaHeight}px`)
        cy.log(`${testCase.name} - Scroll height: ${textareaScrollHeight}px`)
        cy.log(`${testCase.name} - Client height: ${textareaClientHeight}px`)
        
        // Check if text is wrapped
        const textIsWrapped = textareaScrollHeight > textareaClientHeight
        cy.log(`${testCase.name} - Text wrapped: ${textIsWrapped}`)
        
        // Capture with HTML2Canvas
        cy.get('.capture-button').click()
        cy.wait(500)
        
        // Get canvas dimensions
        cy.get('#capturedCanvas').then(($canvas) => {
          const canvas = $canvas[0]
          const canvasHeight = canvas.height
          const canvasWidth = canvas.width
          
          cy.log(`${testCase.name} - Canvas height: ${canvasHeight}px`)
          cy.log(`${testCase.name} - Canvas width: ${canvasWidth}px`)
          
          if (textIsWrapped) {
            // If text is wrapped, canvas should grow vertically
            const expectedCanvasHeight = textareaScrollHeight
            const heightRatio = canvasHeight / expectedCanvasHeight
            
            cy.log(`${testCase.name} - Expected height: ${expectedCanvasHeight}px`)
            cy.log(`${testCase.name} - Height ratio: ${heightRatio.toFixed(2)}`)
            
            if (heightRatio < 0.8) {
              cy.log(`❌ ${testCase.name}: Canvas height too short for wrapped text`)
              throw new Error(`${testCase.name}: Canvas height (${canvasHeight}px) too short for wrapped text (${expectedCanvasHeight}px)`)
            } else if (heightRatio > 1.2) {
              cy.log(`⚠️ ${testCase.name}: Canvas height too tall`)
              throw new Error(`${testCase.name}: Canvas height (${canvasHeight}px) too tall for wrapped text (${expectedCanvasHeight}px)`)
            } else {
              cy.log(`✅ ${testCase.name}: Canvas height matches expected wrapped text height`)
              expect(heightRatio).to.be.closeTo(1.0, 0.2)
            }
          } else {
            // If text is not wrapped, canvas should match textarea height
            const heightRatio = canvasHeight / textareaHeight
            cy.log(`${testCase.name} - Height ratio: ${heightRatio.toFixed(2)}`)
            
            if (heightRatio < 0.9 || heightRatio > 1.1) {
              cy.log(`❌ ${testCase.name}: Canvas height does not match textarea height`)
              throw new Error(`${testCase.name}: Canvas height (${canvasHeight}px) does not match textarea height (${textareaHeight}px)`)
            } else {
              cy.log(`✅ ${testCase.name}: Canvas height matches textarea height`)
              expect(heightRatio).to.be.closeTo(1.0, 0.1)
            }
          }
        })
      })
    })
  })

  it('should force text wrapping with small font size', () => {
    // Force text wrapping by using small font size and narrow width
    const longText = 'זהו טקסט ארוך מאוד שיצטרך להיכתב במספר שורות כדי להתאים לגודל הטקסט'
    
    // Set small font size to force wrapping
    cy.get('[onclick="setFontSize(16)"]').click()
    cy.wait(200)
    
    // Make textarea narrower and enable text wrapping
    cy.get('#testTextarea').then(($textarea) => {
      $textarea[0].style.width = '250px'
      $textarea[0].style.height = 'auto'
      $textarea[0].style.whiteSpace = 'normal'
      $textarea[0].style.wordWrap = 'break-word'
      $textarea[0].style.overflowWrap = 'break-word'
    })
    cy.wait(300)
    
    // Type long text
    cy.typeHebrewText('#testTextarea', longText)
    cy.wait(500)
    
    // Capture with HTML2Canvas
    cy.get('.capture-button').click()
    cy.wait(500)
    
    // Take screenshot
    cy.screenshot('small-font-forced-wrapping-test')
    
    // Check if text is wrapped and canvas preserves it
    cy.get('#testTextarea').then(($textarea) => {
      const textarea = $textarea[0]
      const textareaScrollHeight = textarea.scrollHeight
      const textareaClientHeight = textarea.clientHeight
      const textIsWrapped = textareaScrollHeight > textareaClientHeight
      
      cy.log(`Small font - Text wrapped: ${textIsWrapped}`)
      cy.log(`Small font - Scroll height: ${textareaScrollHeight}px, Client height: ${textareaClientHeight}px`)
      
      if (!textIsWrapped) {
        cy.log('❌ Text is not wrapped even with small font and narrow width - cannot test wrapping preservation')
        throw new Error('Text is not wrapped even with small font and narrow width - test cannot validate wrapping preservation')
      }
      
      cy.get('#capturedCanvas').then(($canvas) => {
        const canvas = $canvas[0]
        const canvasHeight = canvas.height
        
        const expectedCanvasHeight = textareaScrollHeight
        const heightRatio = canvasHeight / expectedCanvasHeight
        
        cy.log(`Small font - Expected height: ${expectedCanvasHeight}px`)
        cy.log(`Small font - Canvas height: ${canvasHeight}px`)
        cy.log(`Small font - Height ratio: ${heightRatio.toFixed(2)}`)
        
        if (heightRatio < 0.8) {
          cy.log('❌ Small font: Canvas height too short for wrapped text')
          throw new Error(`Small font: Canvas height (${canvasHeight}px) too short for wrapped text (${expectedCanvasHeight}px)`)
        } else if (heightRatio > 1.2) {
          cy.log('⚠️ Small font: Canvas height too tall')
          throw new Error(`Small font: Canvas height (${canvasHeight}px) too tall for wrapped text (${expectedCanvasHeight}px)`)
        } else {
          cy.log('✅ Small font: Canvas height matches expected wrapped text height')
          expect(heightRatio).to.be.closeTo(1.0, 0.2)
        }
      })
    })
  })
})