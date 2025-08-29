import React from "react";
import { usePolling } from "../../src/lib/hooks/usePolling";

interface TestComponentProps{
    callbackFunction: () => void | Promise<void>
    intervalValue: number
    isStopped: boolean
}

function TestComponent({ callbackFunction, intervalValue, isStopped }: TestComponentProps) {
    const result = usePolling({ callback: callbackFunction, interval: intervalValue, stopped: isStopped });
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
        
    it('Component mounts', () => {
        const callbackSpy = cy.spy(() => {
            console.log('Hello World!');
        }).as('componentMountSpy');

        cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} isStopped={false} />)
        
        cy.get('[data-testid="test-component"]').should("be.visible");
        cy.get('[data-testid="test-component"]').should("contain.text", "Component using usePolling hook");
    });

    it('should not start to poll when isStopped is set on true', () => {
        const callbackSpy = cy.spy(() => {
            console.log('Does not start the polling automaticly');
        }).as('callbackSpy');

        cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} isStopped={true} />)

        cy.get('@callbackSpy').should('not.have.been.called');
    });

    it('should remain stopped until start is called when isStopped is true', () => {
        const callbackSpy = cy.spy(() => {
            console.log('Does not start the polling automaticly');
        }).as('callbackSpy');

        cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} isStopped={true} />)

        cy.get('@callbackSpy').should('not.have.been.called');
        cy.contains('button', 'Start polling').click();
        cy.wait(1000);
        cy.contains('button', 'Stop polling').click();
        cy.get('@callbackSpy').should('have.been.calledOnce');
    });

    it('should start to poll automatically when stopped is false', () => {
        const callbackSpy = cy.spy(() => {
            console.log('The polling runs automatically when stopped is false.');
        }).as('callbackSpy');

        cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} isStopped={false} />)

        cy.get('@callbackSpy').should('have.been.called');
    });

    it('should poll continuously until stopped when initially running', () => {
        const callbackSpy = cy.spy(() => {
            console.log('The polling runs automatically until it gets stopped.');
        }).as('callbackSpy');

        cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} isStopped={false} />)

        cy.get('@callbackSpy').should('have.been.called');
        cy.wait(1000);
        cy.contains('button', 'Stop polling').click();
        cy.get('@callbackSpy').should('have.been.calledTwice');
    });

});