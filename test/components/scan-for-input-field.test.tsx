/**
 * @jest-environment jsdom
 */

import 'jest';
import React from 'react';
import "@testing-library/react";
import {FindByText, render, screen, waitFor} from "@testing-library/react";

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });
// import user from "@testing-library/user-event";
// import {act} from "react-test-renderer";
import ScanForInputField, {
    ActionType,
    assignKeyChord,
    ScanForInputStates
} from "../../src/components/scan-for-input-field";
import {KeyChord} from "../../src/components/util/user-input";
import {Named, State} from "../../src/util/state";
import StateMachine from "../../src/util/state-machine";
import {Observable, Subscriber} from "rxjs";
import "@testing-library/jest-dom"
import {ScanForInputFieldMachine, ScanForInputProps} from "../../src/components/scan-for-input-reactmachine";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const MockWindowKeyObserver = (eventListener: {(event: KeyboardEvent): void} = () => {},
                               listenerReturn: {(eventListener: {(event: KeyboardEvent): void}): void},
                               subscriberAccess: {(subscriber: Subscriber<string>): void}) => {
    return (listenerReturn: {(eventListener: {(event: KeyboardEvent): void}): void}, preventDefault: boolean = true): Observable<string> => {
        listenerReturn(eventListener);
        // todo: document why ignored
        preventDefault = (preventDefault) || true
        return new Observable((subscriber) => {
            subscriberAccess(subscriber);
        })
    }
}

describe('Scan for input', () => {
    describe('assignKeyChord', () => {
        test('adds shift', () => {
            expect(assignKeyChord([], "Shift", 4).keyChord).toStrictEqual(["Shift"])
        })

        test('unshifts P, harharharhar', () => {
            expect(assignKeyChord(["Shift"], "P", 4).keyChord).toStrictEqual(["P", "Shift"])
        })

        test("concats 1,2,3,4 in filo order", () => {
            let keyChord: KeyChord = []
            keyChord = assignKeyChord(keyChord, "1", 4).keyChord || []
            keyChord = assignKeyChord(keyChord, "2", 4).keyChord || []
            keyChord = assignKeyChord(keyChord, "3", 4).keyChord || []

            expect(assignKeyChord(keyChord, "4", 4).keyChord).toStrictEqual(["4", "3", "2", "1"])
        })

        test('keylimit exceeded, clear and replace - after you P, you sometimes Shift', () => {
            expect(assignKeyChord(["P", "P", "P", "P"], "Shift", 4).keyChord).toStrictEqual(["Shift"])
        })

        test('clears when given "Escape" key', () => {
            const assignment = assignKeyChord(["Shift", "Shift", "Shift", "Shift"], "Escape", 4)
            expect(assignment.keyChord).toStrictEqual([])
            expect(assignment.escapeCalled).toStrictEqual(true)
        })
    })

    describe("ScanForInputField component", () => {
        test("state machine clears listener and scanning maps and asserts base state", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();


            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let cancelledChord: KeyChord | undefined = undefined;
            let setScan: boolean;
            let el: { (event: KeyboardEvent): void } | undefined = undefined;

            listenerMap.set("test", (e) => {
                throw new Error("should not call event")
            })
            scanningMap.set("test", ["1", "2", "3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map,
                stateMachineMap,
                listenerMap,
                scanningMap,
                actionType: "test",
                keyLimit: 4,
                shortcut: ["W", "Shift"],
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    cancelledChord = chord
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => {
                    }
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);
            expect((await machine.handleState({name: "base"} as Named))?.name).toBe("base");
            expect(listenerMap.size).toBe(0);
            expect(scanningMap.size).toBe(0);
            return Promise.resolve();
        });
        test("state machine calls onScan when save state", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();

            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let cancelledChord: KeyChord | undefined = undefined;
            let setScan: boolean;
            let el: {(event: KeyboardEvent): void} | undefined = undefined;
            let subscriber: Subscriber<string> | undefined = undefined;

            listenerMap.set("test", (e) => { throw new Error("should not call event") })
            scanningMap.set("test", ["1","2","3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map, stateMachineMap, listenerMap, scanningMap, actionType: "test",keyLimit: 4, shortcut: ["W", "Shift"],
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    cancelledChord = chord
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => subscriber = s
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);

            expect((await machine.handleState({ name: "start scanning" } as Named))?.name).toBe("scanning");
            const sub = subscriber as unknown as Subscriber<string>;
            sub.next("t")
            sub.next("e")
            sub.next("s")
            sub.next("t")

            expect((await machine.handleState({name: "save"} as Named))?.name).toBe("base");

            expect(setChord).toStrictEqual(["t", "e", "s", "t"].reverse())
            expect(savedChord).toStrictEqual(["t", "e", "s", "t"].reverse())

            expect(listenerMap.size).toBe(0);
            expect(scanningMap.size).toBe(0);
            return Promise.resolve();
        });

        test("calls escape when user presses escape when scanning is active", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();

            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let cancelledChord: KeyChord | undefined = undefined;
            let setScan: boolean;
            let el: { (event: KeyboardEvent): void } | undefined = undefined;
            let subscriber: Subscriber<string> | undefined = undefined;

            listenerMap.set("test", (e) => {
                throw new Error("should not call event")
            })
            scanningMap.set("test", ["1", "2", "3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map,
                stateMachineMap,
                listenerMap,
                scanningMap,
                actionType: "test",
                keyLimit: 4,
                shortcut: cancelledChord as unknown as KeyChord,
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    cancelledChord = chord
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => subscriber = s
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);

            expect((await machine.handleState({name: "start scanning"} as Named))?.name).toBe("scanning");

            (subscriber as unknown as Subscriber<string>).next("Escape")

            return new Promise((resolve, reject) => {
                waitFor(() => {
                    expect(machine.currentState?.name).toBe("base");
                    expect(cancelledChord).toBe(cancelledChord)

                    expect(listenerMap.size).toBe(0);
                    expect(scanningMap.size).toBe(0);
                    resolve(undefined);
                }, { timeout: 3000 })
            })

        })

        test("reverts to shortcut when state transition is \"stop scanning\" and scanning is active", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();

            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let cancelledChord: KeyChord | undefined = undefined;
            let setScan: boolean;
            let el: { (event: KeyboardEvent): void } | undefined = undefined;
            let subscriber: Subscriber<string> | undefined = undefined;

            listenerMap.set("test", (e) => {
                throw new Error("should not call event")
            })
            scanningMap.set("test", ["1", "2", "3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map,
                stateMachineMap,
                listenerMap,
                scanningMap,
                actionType: "test",
                keyLimit: 4,
                shortcut: cancelledChord as unknown as KeyChord,
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    cancelledChord = chord
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => subscriber = s
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);

            expect((await machine.handleState({name: "start scanning"} as Named))?.name).toBe("scanning");

            const sub = subscriber as unknown as Subscriber<string>
            sub.next("l")
            sub.next("o")
            sub.next("m")
            sub.next("e")

            expect((await machine.handleState({name: "revert"} as Named))?.name).toBe("scanning");
            expect((await machine.handleState({name: "stop scanning"} as Named))?.name).toBe("base");
            expect(cancelledChord).toBe(cancelledChord)

            expect(listenerMap.size).toBe(0);
            expect(scanningMap.size).toBe(0);
            return Promise.resolve()
        })


        test("reverts to shortcut when state transition is \"stop scanning\" and scanning is active", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();

            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let shortcut: KeyChord | undefined = ["1", "2", "3"];
            let setScan: boolean;
            let el: { (event: KeyboardEvent): void } | undefined = undefined;
            let subscriber: Subscriber<string> | undefined = undefined;

            listenerMap.set("test", (e) => {
                throw new Error("should not call event")
            })
            scanningMap.set("test", ["1", "2", "3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map,
                stateMachineMap,
                listenerMap,
                scanningMap,
                actionType: "test",
                keyLimit: 4,
                shortcut: shortcut as unknown as KeyChord,
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    throw new Error("not to be called in this test")
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => subscriber = s
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);

            expect((await machine.handleState({name: "start scanning"} as Named))?.name).toBe("scanning");

            const sub = subscriber as unknown as Subscriber<string>
            sub.next("l")
            sub.next("o")
            sub.next("m")
            sub.next("e")

            expect((await machine.handleState({name: "revert"} as Named))?.name).toBe("scanning");

            sub.next("3")
            sub.next("2")
            sub.next("1")

            expect((await machine.handleState({name: "save"} as Named))?.name).toBe("base");
            expect(savedChord).toStrictEqual(shortcut)

            expect(listenerMap.size).toBe(0);
            expect(scanningMap.size).toBe(0);

            return Promise.resolve()
        })

        test("clears when clear state entered", async () => {
            const map = new Map<string, State>();
            const listenerMap = new Map<ActionType, EventListener>();
            const scanningMap = new Map<ActionType, KeyChord>();
            const stateMachineMap = new Map<ActionType, StateMachine>();

            let setChord: KeyChord | undefined = undefined;
            let savedChord: KeyChord | undefined = undefined;
            let cancelledChord: KeyChord | undefined = undefined;
            let setScan: boolean;
            let el: { (event: KeyboardEvent): void } | undefined = undefined;
            let subscriber: Subscriber<string> | undefined = undefined;

            listenerMap.set("test", (e) => {
                throw new Error("should not call event")
            })
            scanningMap.set("test", ["1", "2", "3"])
            const machine = new StateMachine();
            stateMachineMap.set("test", machine)

            let nameAccessMap = ScanForInputStates({
                map, stateMachineMap, listenerMap, scanningMap, actionType: "test", keyLimit: 4, shortcut: ["1", "2"],
                setScanning: (scanning: boolean): void => {
                    setScan = scanning
                },
                setKeyChord: (chord: KeyChord): void => {
                    setChord = chord
                },
                onScan: (chord: KeyChord): void => {
                    savedChord = chord
                },
                onCancelScan: (chord: KeyChord): void => {
                    cancelledChord = chord
                },
                windowKeyDownObserver: MockWindowKeyObserver(
                    (e) => console.log(e),
                    eventListener => el = eventListener,
                    s => subscriber = s
                ),
                shouldPreventDefault: true,
                window: new JSDOM().window
            });

            machine.initialize(nameAccessMap, nameAccessMap.getState("base") as State);

            expect((await machine.handleState(machine.getState("start scanning")!))?.name).toBe("scanning");

            expect((await machine.handleState(machine.getState("clear")!))?.name).toBe("scanning");

            (subscriber as unknown as Subscriber<string>).next("o")

            expect((await machine.handleState(machine.getState("save")!))?.name).toBe("base");

            expect(savedChord).toStrictEqual(["o"]);

            expect(listenerMap.size).toBe(0);
            expect(scanningMap.size).toBe(0);

            return Promise.resolve()
        })

        test("test react machine", () => {
            let scanned = false;
            let cancelScan = false;
            const instance = ScanForInputFieldMachine({
              actionType: "Toggle",
              shortcut: ["shift", "k"],
              keyLimit: 4,
              onScan: () => {scanned = true},
              onCancelScan: () => {cancelScan = true}
            } as ScanForInputProps)
            const InputScanner = instance.getRenderTarget()

            expect(instance.getLogView().views.length > 0).toBe(true);
            //<InputScanner />
        })
    })
})