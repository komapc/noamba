describe('Textarea sizing and behavior (width-based)', () => {
  const sel = '#textDiv';

  const getRect = () => cy.get(sel).then(($el) => $el[0].getBoundingClientRect());
  const getWidth = () => getRect().then((r) => r.width);
  const getHeight = () => getRect().then((r) => r.height);

  beforeEach(() => {
    cy.viewport(1280, 800);
    cy.visit('/');
  });

  it('initial height clamps between width/6 and width*4/3', () => {
    cy.get(sel).invoke('text', '');
    cy.wait(300);
    cy.then(async () => {
      const r = await getRect();
      const minH = r.width / 6;
      const maxH = (4 / 3) * r.width;
      expect(r.height).to.be.gte(minH - 2);
      expect(r.height).to.be.lte(maxH + 2);
    });
  });

  it('respects width/6..width*4/3 on mobile too', () => {
    cy.viewport(375, 667);
    cy.visit('/');
    cy.get(sel).invoke('text', '');
    cy.wait(300);
    cy.then(async () => {
      const r = await getRect();
      const minH = r.width / 6;
      const maxH = (4 / 3) * r.width;
      expect(r.height).to.be.gte(minH - 2);
      expect(r.height).to.be.lte(maxH + 2);
    });
  });

  it('grows with text but never exceeds width*4/3', () => {
    const longText = 'x '.repeat(4000);
    cy.get(sel).click().type(longText, { delay: 0 });
    getHeight().then((h1) => {
      expect(h1).to.be.greaterThan(0);
    });
    getRect().then((r) => {
      const maxH = (4 / 3) * r.width;
      expect(r.height).to.be.lte(maxH + 20);
    });
  });

  it('prevents typing when beyond width*4/3 height', () => {
    const longText = 'y '.repeat(6000);
    cy.get(sel).click().type(longText, { delay: 0 });
    cy.get(sel).invoke('text').then((text1) => {
      cy.get(sel).type('more more more', { delay: 0 });
      cy.get(sel).invoke('text').should((text2) => {
        expect(text2.length).to.be.lte(text1.length + 5);
      });
    });
  });

  it('never shows a vertical scrollbar', () => {
    const longText = 'z '.repeat(4000);
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
