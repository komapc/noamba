describe('Textarea sizing and behavior', () => {
  const sel = '#textDiv';

  const getHeight = () => {
    return cy.get(sel).then(($el) => $el[0].getBoundingClientRect().height);
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('starts near 300px total height (incl. padding)', () => {
    // allow small variance due to fonts/rendering; 330px is expected with 15px padding top/bottom on 300px content box
    getHeight().should('be.within', 298, 332);
    cy.get(sel).should('have.css', 'overflow-y', 'hidden');
  });

  it('grows in height as text increases, up to 1600px', () => {
    const longText = 'a '.repeat(5000);
    cy.get(sel).click().type(longText, { delay: 0 });
    getHeight().should('be.greaterThan', 300);
    // the rendered height should never exceed 1600px (allow a small tolerance)
    getHeight().should('be.lte', 1620);
  });

  it('prevents typing beyond 1600px height', () => {
    const longText = 'b '.repeat(10000);
    cy.get(sel).click().type(longText, { delay: 0 });
    // Capture length after typing attempts
    cy.get(sel).invoke('text').then((text1) => {
      cy.get(sel).type('more more more', { delay: 0 });
      cy.get(sel).invoke('text').should((text2) => {
        expect(text2.length).to.be.lte(text1.length + 5);
      });
    });
  });

  it('never shows a vertical scrollbar', () => {
    const longText = 'c '.repeat(10000);
    cy.get(sel).click().type(longText, { delay: 0 });
    cy.get(sel).should('have.css', 'overflow-y', 'hidden');
  });
});
