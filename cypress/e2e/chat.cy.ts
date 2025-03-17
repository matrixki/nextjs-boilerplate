describe("Authentication Redirects", () => {
  it("should redirect to /signin when accessing /chat without authentication", () => {
    cy.visit("/chat"); // 🔍 Attempt to visit the chat page
    cy.url().should("include", "/signin"); // ✅ Verify redirection to signin
  });
});
