beforeEach(() => {
  cy.login('rayabby@email.com', 'rayabby')
})

describe('ROOMS', () => {
  // SEE ROOMS.
  it('join a room', () => {
    cy.visit('/central/rooms');

    cy.contains('Join a Chat Room.')
      .should('be.visible');

    cy.get('[data-cy="roomCard"]')
      .first()
      .contains('All Time Low');
    
      cy.get('[data-cy="enterRoomBtn"]')
        .first()
        .click();
      
      cy.url().should('include', 'central/rooms/all-time-low', {timeout: 5000});

      cy.get('[data-cy="userCard"]')
        .contains('rayabby')
  })

  // SEND A MESSAGE.
  it('send a message', () => {
    cy.visit('/central/rooms/all-time-low');

    cy.get('[data-cy="textInput"]')
      .type('hello world')
      .get('[data-cy="submitBtn"]')
      .click();
    
    cy.get('[data-cy="message"]')
      .last()
      .contains('hello world', {timeout: 5000});
  })

  // DELETE A MESSAGE.
  it('delete a message', () => {
    cy.visit('/central/rooms/all-time-low');

    cy.get('[data-cy="message"]')
    .last()
    .get('[data-cy="deleteMessageBtn"]')
    .click()
  })

})