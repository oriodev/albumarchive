/// <reference types="cypress" />


// cypress/support/commands.js
Cypress.Commands.add('login', (email, password) => {

  cy.session([email, password], () => {
    cy.visit(`/login`);
  
    cy.get('input[name="email"]').clear().type(email);
    cy.get('input[name="password"]').clear().type(password);
    
    cy.get('button[type="submit"]').click();
  
    cy.url().should('include', '/central');
  }, 
  {
    cacheAcrossSpecs: true
  })

})
