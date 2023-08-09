import 'jest';
import React from 'react';
import {FindByText, render, screen} from "@testing-library/react";
// import user from "@testing-library/user-event";
// import {act} from "react-test-renderer";
import ScanForInputField, {assignKeyChord} from "../../src/components/scan-for-input-field";
import {KeyChord} from "../../src/components/util/user-input";

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

        describe("ScanForInputField component", () => {
        // TODO: why. why. why. the world wide why? why doesn't this work?
            // TODO: why: the property type is coming up with:
            /**
             *       Property 'actionType' does not exist on type 'IntrinsicAttributes & { key?: Key | null | undefined; slot?: string | undefined; style?: CSSProperties | undefined; title?: string | undefined; ... 251 more ...; onTransitionEndCapture?: TransitionEventHandler<...> | undefined; } & { ...; } & { ...; }'.
             *
             *     42                 <ScanForInput actionType={"Test"} shortcut={shortcut} onScan={onScan} onCancelScan={onCancelScan}  />
             *                                      ~~~~
             */
            // TODO: why: which apparently means i haven't defined the property, or the typing is wrong on the property access which is interesting
            // TODO: why: actionType isn't reserved
            // TODO: HUH? I'm going to try implementing the field and see if any of the same issues pop in the UI proper

            // TODO 2: electric boo gotta add a click or two because now it properly cancels the scan
        // test('test typing keychord assertions', async () => {
        //     let newShortcut: string[] = ["w", "Shift"]
        //     let shortcut: string[] = ["p", "Shift"]
        //
        //     let scanned: string[] = [];
        //     let scanCanceled: string[] = [];
        //
        //     const onScan = (scan: KeyChord) => {
        //         scanned = scan;
        //     }
        //
        //     const onCancelScan = (previous: KeyChord) => {
        //         scanCanceled = previous;
        //     }
        //
        //     render(
        //         <ScanForInputField
        //             actionType={"Test"}
        //             keyLimit={4}
        //             shortcut={shortcut}
        //             onScan={onScan}
        //             onCancelScan={onCancelScan}
        //         />
        //     );
        //
        //     const joinedshortcutfield: any = await screen.findByText(shortcut.join(", "));
        //     expect(joinedshortcutfield).toBeDefined();
        //
        //     //expect(screen.findByText((content: string, element) => content.includes(shortcut.join(", ")))).toBeDefined()
        //
        //     (screen.findByTestId("clickable-text-container")).click();
        //     // scan-text-input
        //     // "}
        //     // revert-button"}
        //
        //     const scanSetSave = (action: {(): void}) => {
        //         // maybe
        //         //              await act(async () => {
        //         //                 await user.click(goButtonUnClicked);
        //         //             });
        //         (await screen.findByTestId("clickable-text-container")).click();
        //         action();
        //         (await screen.findByTestId("save-button")).click()
        //     }
        //
        //     const escape = new KeyboardEvent('keydown', { key: 'Escape' })
        //     const shift = new KeyboardEvent('keydown', { key: 'Shift' })
        //     const x = new KeyboardEvent('keydown', { key: 'x' })
        //     const l = new KeyboardEvent('keydown', { key: 'l' })
        //     const c = new KeyboardEvent('keydown', { key: 'c' })
        //     const r = new KeyboardEvent('keydown', { key: 'r' })
        //
        //     scanSetSave(() => document.dispatchEvent(escape))
        //
        //     expect(scanned).toBe([])
        //
        //     scanSetSave(() => document.dispatchEvent(shift))
        //
        //     expect(scanned).toBe(['Shift'])
        //
        //     scanSetSave(() => document.dispatchEvent(escape))
        //
        //     expect(scanned).toBe([])
        //
        //     scanSetSave(() => document.dispatchEvent(x))
        //
        //     expect(scanned).toBe(['x'])
        //
        //     scanSetSave(() => document.dispatchEvent(l))
        //
        //     expect(scanned).toBe(['l', 'x'])
        //
        //     scanSetSave(() => document.dispatchEvent(c))
        //
        //     expect(scanned).toBe(['c', 'l', 'x'])
        //
        //     scanSetSave(() => document.dispatchEvent(r))
        //
        //     expect(scanned).toBe(['r', 'c', 'l', 'x'])
        //
        //     // exceed character limit
        //     scanSetSave(() => document.dispatchEvent(shift))
        //
        //     expect(scanned).toBe(['Shift'])
        //
        //     scanSetSave(() => document.dispatchEvent(escape))
        //     expect(scanned).toBe([])
        //
        //     scanSetSave(() => {
        //         document.dispatchEvent(x)
        //         document.dispatchEvent(l)
        //         document.dispatchEvent(c)
        //         document.dispatchEvent(r)
        //     })
        //     expect(scanned).toBe(['r', 'c', 'l', 'x'])
        //
        //     // const goButtonUnClicked = screen.getByText('go!')
        //     // expect(goButtonUnClicked).toBeTruthy();
        //     //
        //     //
        //     // expect(onGoCalled).toBeTruthy();
        //     //
        //     // await act(async () => {
        //     //     await user.click(goButtonUnClicked);
        //     // });
        //     //
        //     // expect(onStopCalled).toBe(true);
        //     // // can't get the testing-library to revalidate the value of the button, but neither could i get the json component
        //     // //  to render with the updated information, so idk.
        //     //
        //     // // in the meantime...
        //      expect(screen.findByTestId("scan-for-input-field")).toMatchSnapshot();
        // });
        })
    })
})