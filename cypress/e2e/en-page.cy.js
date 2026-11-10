describe('English page', () => {
  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/en/');
  });

  it('is English, with Hebrew as x-default', () => {
    cy.get('html').should('have.attr', 'lang', 'en').and('have.attr', 'dir', 'ltr');
    cy.get('link[rel="canonical"]').should('have.attr', 'href', 'https://noamba.lipu.dev/en/');
    cy.get('link[hreflang="he"]').should('have.attr', 'href', 'https://noamba.lipu.dev/');
    cy.get('link[hreflang="en"]').should('have.attr', 'href', 'https://noamba.lipu.dev/en/');
    cy.get('link[hreflang="x-default"]').should('have.attr', 'href', 'https://noamba.lipu.dev/');
    cy.get('#shareButton').should('contain.text', 'Copy');
  });

  it('keeps the editor right-to-left Hebrew and inserts the letters', () => {
    cy.get('#textDiv').should('have.attr', 'dir', 'rtl').and('have.css', 'direction', 'rtl');
    cy.get('#textDiv').click().type('לומד');
    cy.get('.char-button[data-char="׍"]').click();
    cy.get('#textDiv').should('contain.text', 'לומד׍');
  });

  it('links back to the Hebrew page, which links here', () => {
    cy.get('.footer-info a[hreflang="he"]').should('have.attr', 'href', '/');
    cy.visit('/');
    cy.get('link[hreflang="en"]').should('have.attr', 'href', 'https://noamba.lipu.dev/en/');
    cy.get('.footer-info a[hreflang="en"]').should('have.attr', 'href', '/en/');
    cy.get('#shareButton').should('contain.text', 'העתיקו');
  });
});
