const AWS = require("aws-sdk");

// Setup credentials
Cypress.Commands.add("aws_getCognitoService", () => {
    return cy.fixture("aws/awsCredentials").then(({ aws }) => {
        const { region, accessKeyId, secretAccessKey, UserPoolId } = aws;
        return new AWS.CognitoIdentityServiceProvider({
            region,
            accessKeyId,
            secretAccessKey,
            UserPoolId,
        });
    });
});

// AWS params require a Username, so this maps an Email to a Username.
Cypress.Commands.add("aws_findUserByEmail", (email) => {
    return cy.aws_getCognitoService().then((cognito) => {
        const params = {
            UserPoolId: cognito.config.UserPoolId,
            Filter: `email = "${email}"`,
            Limit: 1,
        };

        return cognito
            .listUsers(params)
            .promise()
            .then((response) => {
                const users = response.Users;
                if (users && users.length > 0) {
                    const user = users[0];
                    return user;
                } else {
                    throw new Error(
                        `No se encontró ningún usuario con el correo electrónico: ${email}`
                    );
                }
            });
    });
});

Cypress.Commands.add("aws_getUserAttribute", (email) => {
    return cy.aws_findUserByEmail().then((email) => {
        cy.log(email);
    });
});

// Change onboarding_stage
Cypress.Commands.add("aws_changeOnboardingStageByEmail", (email, stage) => {
        return cy.aws_findUserByEmail(email).then((user) => {
            return cy.aws_getCognitoService().then((cognito) => {
                const params = {
                    UserPoolId: cognito.config.UserPoolId,
                    Username: user.Username,
                    UserAttributes: [
                        {
                            Name: "custom:onboarding_stage",
                            Value: stage.toString(),
                        },
                    ],
                };
                return cognito.adminUpdateUserAttributes(params).promise();
            });
        });
    }
);

Cypress.Commands.add("aws_changeFieldByEmail", (email, value, field) => {
    return cy.aws_findUserByEmail(email).then((user) => {
        return cy.aws_getCognitoService().then((cognito) => {
            const params = {
                UserPoolId: cognito.config.UserPoolId,
                Username: user.Username,
                UserAttributes: [
                    {
                        Name: field,
                        Value: value,
                    },
                ],
            };
            return cognito.adminUpdateUserAttributes(params).promise();
        });
    });
}
);
// Delete a Username by its email
Cypress.Commands.add("aws_deleteUserByEmail", (email) => {
    return cy.aws_findUserByEmail(email).then((user) => {
        return cy.aws_getCognitoService().then((cognito) => {
            const params = {
                UserPoolId: cognito.config.UserPoolId,
                Username: user.Username,
            };
            return cognito.adminDeleteUser(params).promise();
        });
    });
});

Cypress.Commands.add(
    "aws_verifyAttribute",
    (userData, attributeName, attributeValue) => {
        const isAttributePresent = userData.Attributes.some(
            (attr) =>
                attr.Name === attributeName && attr.Value === attributeValue
        );
        return isAttributePresent;
    }
);
