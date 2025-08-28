import React from "react";
import { usePolling } from "../../src/lib/hooks/usePolling";

function TestComponent() {
    const result = usePolling({ callback: () => { console.log("Hello World"); }, interval: 1000, stopped: false });
    return (<>
        <div data-testid="test-component">
            Component using usePolling hook
            <Button>Start polling</Button>
            <Button Stopp polling/>
            <p>is polling? { result.isPolling}</p>
        </div>;
    </>)
}

describe("usePolling Hook - Cypress Component Tests", () => {
    it('component mounts', () => {
        cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
        });

        cy.mount(<TestComponent />)

        // Verify the component rendered
        cy.get('[data-testid="test-component"]').should("be.visible");
        cy.get('[data-testid="test-component"]').should("contain.text", "Component using usePolling hook");

        // Assert that console.log was called with "Hello World"
        cy.get("@consoleLog").should("have.been.calledWith", "Hello World");
        cy.get("@consoleLog").should("have.been.calledOnce");

    });
    it('Start polling works', () => {
        cy.clock();
    })
});