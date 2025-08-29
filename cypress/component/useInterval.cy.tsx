import React from "react";
import { useInterval } from "../../src/lib/hooks/useInterval";

interface TestComponentProps {
  callbackFunction: () => void | Promise<void>;
  intervalValue: number;
  autoStart: boolean;
}

function TestComponent({ callbackFunction, intervalValue, autoStart }: TestComponentProps) {
  const result = useInterval({ callback: callbackFunction, interval: intervalValue, autoStart: autoStart });
  return (
    <>
      <div data-testid="test-component">
        Component using useInterval hook
        <button onClick={result.startInterval}>Start interval</button>
        <button onClick={result.stopInterval}>Stop interval</button>
      </div>
    </>
  );
}

describe("useInterval Hook - Cypress Component Tests", () => {
  it("Component mounts", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("Hello World!");
      })
      .as("componentMountSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={false} />);

    cy.get('[data-testid="test-component"]').should("be.visible");
    cy.get('[data-testid="test-component"]').should("contain.text", "Component using useInterval hook");
  });

  it("should not start the interval when autostart is set on false", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("Does not start the interval automaticly");
      })
      .as("callbackSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={false} />);
    cy.wait(3000);
    cy.get("@callbackSpy").should("not.have.been.called");
  });

  it("should remain stopped until start is called when autostart is false", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("Does not start the interval automaticly");
      })
      .as("callbackSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={false} />);
    cy.wait(3000);
    cy.get("@callbackSpy").should("not.have.been.called");
    cy.contains("button", "Start interval").click();
    cy.wait(1000);
    cy.contains("button", "Stop interval").click();
    cy.wait(3000);
    cy.get("@callbackSpy").should("have.been.calledOnce");
  });

  it("should start the interval automatically when autostart is true", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("The interval runs automatically when autostart is true.");
      })
      .as("callbackSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={true} />);
    cy.wait(3000);
    cy.get("@callbackSpy").should("have.been.calledThrice");
  });

  it("should be running continuously until stopped when autostart is true", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("The interval runs automatically until it gets stopped.");
      })
      .as("callbackSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={true} />);
    cy.wait(1000);
    cy.get("@callbackSpy").should("have.been.calledOnce");
    cy.contains("button", "Stop interval").click();
    cy.get("@callbackSpy").should("have.been.calledOnce");
  });

  it("should only be possible to start the interval once", () => {
    const callbackSpy = cy
      .spy(() => {
        console.log("The interval can only be started once.");
      })
      .as("callbackSpy");

    cy.mount(<TestComponent callbackFunction={callbackSpy} intervalValue={1000} autoStart={false} />);

    cy.contains("button", "Start interval").click();
    cy.contains("button", "Start interval").click();

    cy.get("@callbackSpy").should("have.been.calledOnce");
    cy.wait(1000);
    cy.contains("button", "Stop interval").click();
    cy.get("@callbackSpy").should("have.been.calledTwice");
  });
});
