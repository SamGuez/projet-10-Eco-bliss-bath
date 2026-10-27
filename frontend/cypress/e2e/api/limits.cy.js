describe('API - Limites de quantité au panier', () => {
  [0, -1, 21].forEach((quantity) => {
    it(`refuse l'ajout d'une quantité de ${quantity}`, () => {
      cy.fixture('products').then(({ limits }) => {
        cy.authRequest({
          method: 'PUT',
          url: '/orders/add',
          body: { product: limits.id, quantity },
        }).then((response) => {
          expect(response.status).to.not.eq(200);
        });
      });
    });
  });
});