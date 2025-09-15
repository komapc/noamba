describe('Textarea sizing and behavior', () => {
  const sel = '#textDiv';

  const getHeight = () => {
    return cy.get(sel).then(($el) => $el[0].getBoundingClientRect().height);
  };

  beforeEach(() => {
    cy.visit('/');
  });

  it('empty state is exactly 200px after 500ms', () => {
    cy.get(sel).invoke('text', '');
    cy.wait(500);
    getHeight().should('be.within', 198, 202);
  });

  it('mobile: empty state is 200px after 500ms too', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    cy.get(sel).invoke('text', '');
    cy.wait(500);
    getHeight().should('be.within', 198, 202);
  });

  it('grows in height as text increases, up to 1600px', () => {
    const longText = 'a '.repeat(5000);
    cy.get(sel).click().type(longText, { delay: 0 });
    getHeight().should('be.greaterThan', 200);
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

  it('shows Copy on desktop and Share on mobile', () => {
    // Desktop
    cy.viewport(1280, 800);
    cy.visit('/');
    cy.get('#shareButton').invoke('text').should('contain', 'העתיקו');

    // Mobile
    cy.viewport(375, 667);
    cy.visit('/');
    cy.get('#shareButton').invoke('text').should('contain', 'שתפו');
  });
});
