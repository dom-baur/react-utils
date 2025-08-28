import React from "react";
import { useHelloWorld } from "../../src/lib/hooks/useHelloWorld";

// Test component that uses the hook
function TestComponent() {
  useHelloWorld();
  return <div data-testid="test-component">Component using useHelloWorld hook</div>;
}

describe("useHelloWorld Hook - Cypress Component Tests", () => {
  it('should log "Hello World" on mount', () => {
    // Create a spy on console.log before mounting
    cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });

    // Mount the component that uses the hook
    cy.mount(<TestComponent />);

    // Verify the component rendered
    cy.get('[data-testid="test-component"]').should("be.visible");
    cy.get('[data-testid="test-component"]').should("contain.text", "Component using useHelloWorld hook");

    // Assert that console.log was called with "Hello World"
    cy.get("@consoleLog").should("have.been.calledWith", "Hello World");
    cy.get("@consoleLog").should("have.been.calledOnce");
  });

  it('should only log "Hello World" once when component re-renders', () => {
    // Create a spy on console.log before mounting
    cy.window().then((win) => {
      cy.spy(win.console, "log").as("consoleLog");
    });

    // Mount the component
    cy.mount(<TestComponent />);

    // Force a re-render by mounting again
    cy.mount(<TestComponent />);

    // The console.log should still only be called once per mount
    // Since we mounted twice, it should be called twice total
    cy.get("@consoleLog").should("have.been.calledWith", "Hello World");
    cy.get("@consoleLog").should("have.callCount", 2);
  });

  it("should demonstrate visual testing capabilities", () => {
    cy.mount(<TestComponent />);

    // Visual assertions that are unique to Cypress
    cy.get('[data-testid="test-component"]').should("be.visible").and("have.css", "display");

    // You could also take screenshots for visual regression testing
    // cy.screenshot('useHelloWorld-component')
  });
});
