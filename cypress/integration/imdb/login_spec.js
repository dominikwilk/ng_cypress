const faker = require('faker');

let userData;
let url = "https://www.imdb.com/registration/signin"

before(() => {
    userData = {
        randomEmail: faker.internet.email(),
        randomPassword: faker.internet.password()
    }
})

describe('login', () => {
    it('load imdb page', () => {
        cy.intercept({
            method: "GET",
             url: "/registration/",
         }).as("dataLoaded");

        cy.visit(url)
        cy.wait("@dataLoaded");
        cy.contains('Sign in with IMDb')
        cy.url().should('include', '/registration/signin')
        cy.get('[class="list-group"]').should('be.visible')
    })
    it('load login page and type login without providing password', () => {
        cy.contains('Sign in with IMDb').click()
        cy.get('[id="ap_email"]').should('be.visible')
        cy.url().should('include', '/ap/signin')
        cy.get('#ap_email')
            .type(userData.randomEmail)
            .should('have.value', userData.randomEmail)
        cy.get('#ap_password')
            .type(userData.randomPassword)
            .should('have.value', userData.randomPassword).clear()
        cy.get('[type="checkbox"]').check()
    })
    it('"forgot password" message should be visible after submitting', () => {
        cy.get('#signInSubmit').click()
        cy.get('.a-box-inner.a-padding-extra-large')
            .should('contain', 'Enter your password')
            .and('be.visible')
        cy.get('#ap_password').should('be.empty').end()
    })

})