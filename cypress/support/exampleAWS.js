describe("Cognito", () => {
    // Ejemplo de uso en una prueba
    it("Obtener usuario de Cognito", () => {
        const userName =
            "81a1e155-4aae-4e5f-b305-1213e01a43ef@email.webhook.site";

        cy.aws_findUserByEmail(userName).then((userData) => {
            cy.log(userData);
        });

        cy.wait(7000);
    });

    it("Cambiar stage onboarding cognito", () => {
        const userName =
            "81a1e155-4aae-4e5f-b305-1213e01a43ef@email.webhook.site";
        const stageNumber = 2;

        cy.aws_changeOnboardingStageByEmail(userName, stageNumber).then(
            (userData) => {
                cy.log(userData);
            }
        );

        cy.wait(7000);
    });

    it("Eliminar user", () => {
        const userName =
            "81a1e155-4aae-4e5f-b305-1213e01a43ef@email.webhook.site";

        cy.aws_deleteUserByEmail(userName).then((userData) => {
            cy.log(userData);
        });

        cy.wait(7000);
    });
});
