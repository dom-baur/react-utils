import React from "react";
import { usePolling } from "../../src/lib/hooks/usePolling";

interface TestComponentProps{
    callbackFunction: () => void | Promise<void>
    intervalValue: number
}

function TestComponent({ callbackFunction, intervalValue }: TestComponentProps) {
    const result = usePolling({ callback: callbackFunction, interval: intervalValue, stopped: false });
    return (
        <>
        <div data-testid="test-component">
            Component using usePolling hook
            <button onClick={result.startPolling}>Start polling</button>
            <button onClick={result.stopPolling}>Stop polling</button>
        </div>
    </>)
}

describe("usePolling Hook - Cypress Component Tests", () => {
    beforeEach(() => {
        cy.window().then((win) => {
            cy.spy(win.console, "log").as("consoleLog");
        });

        const callbackSpy = cy.spy(() => {
            console.log('Hello World!');
        }).as('callbackSpy');

        cy.mount(<TestComponent  callbackFunction={callbackSpy} intervalValue={1000}/>)
    });
        
    it('Component mounts', () => {
        
        // Verify the component rendered
        cy.get('[data-testid="test-component"]').should("be.visible");
        cy.get('[data-testid="test-component"]').should("contain.text", "Component using usePolling hook");

        // Assert that console.log was called with "Hello World"
        cy.get("@consoleLog").should("have.been.calledWith", "Hello World!");
        cy.get("@consoleLog").should("have.been.calledOnce");

    });

    it('Callback is not called on mount', () => {
        cy.get('@callbackSpy').should('not.have.been.called');
    });

    it('Start and stop polling works', () => {
        cy.get('@callbackSpy').should('not.have.been.called');
        cy.contains('button', 'Start polling').click();
        cy.wait(1000);
        cy.get('@callbackSpy').should('have.been.called');
        cy.contains('button', 'Stop polling').click();
    });

    it('Setting an interval works', () => {

        const callbackSpy = cy.spy(() => {
            console.log('Setting an interval works!');
        }).as('callbackSpy');

        cy.mount(<TestComponent  callbackFunction={callbackSpy} intervalValue={3000}/>)

        cy.get('@callbackSpy').should('not.have.been.called');
        cy.contains('button', 'Start polling').click();
        cy.wait(3100);
        cy.get('@callbackSpy').should('have.been.called');
        cy.contains('button', 'Stop polling').click();
    });

});