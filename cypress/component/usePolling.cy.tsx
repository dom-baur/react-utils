import { usePolling } from "../../src/lib/hooks/usePolling";

function TestComponent() {
    const result = usePolling({callback: () => {}, interval: 1000, stopped: false });
    return <div data-testid="test-component">Component using usePolling hook</div>;
}

describe("usePolling Hook - Cypress Component Tests", () => {
    it('component mounts', () => {
        cy.mount(<TestComponent />)
    });
});