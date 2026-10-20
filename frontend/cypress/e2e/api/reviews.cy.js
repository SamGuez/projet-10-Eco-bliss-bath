describe('API - Avis', () => {
  const review = { title: 'Test Cypress', comment: 'Avis de test', rating: 4 };

  it('ajoute un avis', () => {
    cy.authRequest({ method: 'POST', url: '/reviews', body: review }).then(
      (response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.include(review);
      }
    );
  });

  it('ne divulgue pas le mot de passe de l\'auteur', () => {
    cy.authRequest({ method: 'POST', url: '/reviews', body: review }).then(
      (response) => {
        expect(response.body.author).to.not.have.property('password'); // échouera : bug connu
      }
    );
  });
});