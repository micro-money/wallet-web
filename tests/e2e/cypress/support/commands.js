Cypress.Commands.add('openSignInModal', () => {
  cy.get('[data-test=login]').click()
  cy.get('.dialog.auth .dialog-footer button').click()
})
Cypress.Commands.add('loginByEmail', (email, password) => {
  cy.visit('/')
  cy.get('[data-test=login]').click()
  cy.get('.dialog.auth .dialog-footer button').click()
  cy.get('[data-test=signin-email]').type(email)
  cy.get('[data-test=signin-password]').type(password)
  cy.get('[data-test=signin-button]').click()
})
