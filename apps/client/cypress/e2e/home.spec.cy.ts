describe('home', () => {
  it('finds home page', () => {
    cy.visit('/')
  })

  // find log in and sign up buttons.
  it('find login and signup buttons', () => {
    cy.visit('/')

    cy.get('[data-cy="login"]').should('be.visible');
    cy.get('[data-cy="signup"]').should('be.visible');
  })

})