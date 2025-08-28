import React from "react";
import { usePolling } from "../../src/lib/hooks/usePolling";

interface TestComponentProps{
    callback: () => void | Promise<void>
}

function TestComponent({ callback }: TestComponentProps) {
    const result = usePolling({ callback: callback, interval: 1000, stopped: false });
    return (
        <>
        <div data-testid="test-component">
            Component using usePolling hook
            <p data-cy="isrunning">is polling? { result.isPolling}</p>
            <button onClick={result.startPolling}>Start polling</button>
            <button onClick={result.stopPolling}>Stopp polling</button>
        </div>
    </>)
}

describe("usePolling Hook - Cypress Component Tests", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
        });

        const callback = () => {
            console.log("Hello World!");
        }

        cy.spy(callback).as("callback");

        cy.mount(<TestComponent callback={callback} />)
    });
        
    it('component mounts', () => {
        
        // Verify the component rendered
        cy.get('[data-testid="test-component"]').should("be.visible");
        cy.get('[data-testid="test-component"]').should("contain.text", "Component using usePolling hook");

        // Assert that console.log was called with "Hello World"
        cy.get("@consoleLog").should("have.been.calledWith", "Hello World!");
        cy.get("@consoleLog").should("have.been.calledOnce");

    });

    it('Polling is stopped by default', () => {
        cy.get("@callback").should("have.callCount", 0);
    });

    it('Start and stopp polling works', () => {
        cy.contains('button', 'Start polling').click();
        cy.wait(3000);
        cy.get("@callback").should("have.callCount", 3);
    });

});