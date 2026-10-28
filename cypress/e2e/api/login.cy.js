describe('API - Login', () => {
  it('connecte un utilisateur connu (200 + token)', () => {
    cy.fixture('user').then(({ valid }) => {
      cy.apiLogin(valid).then((response) => {
        expect(response.status).to.eq(200);
        expect(response.body).to.have.property('token');
      });
    });
  });

  it('refuse un utilisateur inconnu (401)', () => {
    cy.fixture('user').then(({ unknown }) => {
      cy.apiLogin(unknown).then((response) => {
        expect(response.status).to.eq(401);
      });
    });
  });
});