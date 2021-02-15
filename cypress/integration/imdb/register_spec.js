const faker = require('faker');

let userData;
let url = "https://www.imdb.com/registration/signin"

before(() => {
    userData = {
        randomEmail: faker.internet.email(),
        randomPassword: faker.random.number({min:1, max:100}),
        randomDifferentPassword: faker.random.number({min:1, max:10}),
        randomName: faker.name.firstName()
    }
    //changed behaviour of Cypress to preserve cookies to check register functionality
    Cypress.Cookies.defaults({
        preserve: "session-id"
    })
})

describe('register', () => {
    it('load imdb page', () => {
        cy.intercept({
            method: "GET",
            url: "/registration/",
        }).as("dataLoaded");
        cy.visit(url)
        cy.wait("@dataLoaded");
        cy.contains('Create a New Account')
        cy.url().should('include', '/registration/signin')
        cy.get('.list-group-item.create-account').should('be.visible').click()
    })

    it('load registration page and type invalid password', () => {
        cy.get('#ap_customer_name')
            .type(userData.randomName)
            .should('have.value', userData.randomName)
        cy.get('#ap_email')
            .type(userData.randomEmail)
            .should('have.value', userData.randomEmail)
        cy.get('#ap_password')
            .type(userData.randomPassword)
            .should('have.value', userData.randomPassword)
        cy.get('#ap_password_check')
            .type(userData.randomDifferentPassword)
            .should('have.value', userData.randomDifferentPassword)
        cy.get('#continue').click()
    })

    it('"passwords must much" message should be visible after submitting', () => {
        cy.contains('Passwords must match').should('be.visible').end()
    })

})