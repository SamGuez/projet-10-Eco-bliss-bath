describe('Sécurité - Faille XSS dans les avis', () => {
  const payloads = [
    `<img src=x onerror="alert('XSS')">`,
    `<script>alert('XSS')</script>`,
  ];

  beforeEach(() => {
    cy.fixture('user').then(({ valid }) => cy.uiLogin(valid));
    cy.get('[data-cy="nav-link-cart"]').should('be.visible');
  });

  payloads.forEach((payload, index) => {
    it(`n'exécute pas le code injecté dans un commentaire (cas ${index + 1})`, () => {
      // On surveille toute fenêtre d'alerte : si le code s'exécute, elle s'affichera
      const alertStub = cy.stub().as('alertStub');
      cy.on('window:alert', alertStub);

      cy.intercept('POST', '**/reviews').as('postReview');

      // On poste un avis contenant le code
      cy.get('[data-cy="nav-link-reviews"]').click();
      cy.get('[data-cy="review-input-rating-images"] img').eq(4).click();
      cy.get('[data-cy="review-input-title"]').type(`Test XSS ${index + 1}`);
      cy.get('[data-cy="review-input-comment"]').type(payload);
      cy.get('[data-cy="review-submit"]').click();
      cy.wait('@postReview');

      // On recharge la page des avis : c'est là que le code s'exécuterait chez un visiteur
      cy.reload();
      cy.get('[data-cy="review-comment"]').should('have.length.greaterThan', 0);
      cy.wait(1000); // laisse le temps à un éventuel script de se déclencher

      // 1) Aucune alerte ne doit s'être affichée
      cy.get('@alertStub').should('not.have.been.called');

      // 2) Aucun élément dangereux ne doit exister dans les avis affichés
      cy.get('[data-cy="review-comment"] script').should('not.exist');
      cy.get('[data-cy="review-comment"] [onerror]').should('not.exist');
    });
  });
});