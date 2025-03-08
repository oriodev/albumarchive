beforeEach(() => {
  cy.login('rayabby@email.com', 'rayabby')
})

describe('lists', () => {
  // FIND LIST PAGE.
  it('find list page', () => {
    cy.visit('/central/discover')
    cy.contains('Discover New Lists.').should('be.visible');
  })

  // GO TO A LIST.
  it('should go to a list', () => {
    cy.visit('/central/discover')
    
    cy.get('[data-cy="card"]')
      .first()
      .click();
    
    cy.get('[data-cy="pageHeader"')
      .should('be.visible');
  })

  // CREATE A NEW LIST.
  it('should create a new list', () => {
    cy.visit('/central/discover')
      .wait(2000)


    cy.get('[data-cy="sidebar"]')
      .get('[data-cy="newListBtn"]')
      .click();
    
    cy.get('[data-cy="listItem"]')
      .last()
      .contains('New List')
      .should('be.visible');
  })

  // DELETE A LIST.
  it('should delete a list', () => {
    cy.visit('/central/discover')
      .wait(2000)

    cy.get('[data-cy="sidebar"]')
      .get('[data-cy="listItem"]')
      .last()
      .get('[data-cy="listDropdownBtn"]')
      .last()
      .click()
      .get('[data-cy="deleteListBtn"]')
      .click();
  
      cy.get('[data-cy="listItem"]')
      .should('not.contain', 'New List')
  })

})