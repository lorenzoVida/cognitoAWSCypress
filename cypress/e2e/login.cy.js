
describe('Cognito, programmatic login', function () {
  beforeEach(function () {
    // Seed database with test data
    cy.task('db:seed')

    // Programmatically login via Amazon Cognito API
    cy.loginByCognitoApi(
      Cypress.env('73268445'),
      Cypress.env('915392250')
    )
  })

  it('shows onboarding', function () {
    cy.contains('Get Started').should('be.visible')
  })
})