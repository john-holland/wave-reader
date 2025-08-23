/**
 * @jest-environment jsdom
 */
import * as React from "react"
import "jest";

import { TextEncoder, TextDecoder } from 'util';

Object.assign(global, { TextDecoder, TextEncoder });

import {render, screen, waitFor} from "@testing-library/react";

import { screen as domScreen } from "@testing-library/dom";

import {
    ColorGeneratorService,
    DefaultSplitComplement,
    DefaultTetrad,
    DefaultTriad,
    ForThoustPanel, HtmlElement,
    SelectorHierarchy,
    SizeFunctions,
    SizeProperties
} from "../../src/services/selector-hierarchy";
import {SelectorsDefaultFactory} from "../../src/models/defaults";
import {getDefaultFontSizeREM} from "../../src/util/util";

import styled from 'styled-components';
//
import "@testing-library/jest-dom"
import {
    HierarchySelectorComponentProps,
    MountOrFindSelectorHierarchyComponent
} from "../../src/components/selector-hierarchy";
import {FunctionComponent, ReactElement} from "react";
import {withMockSettingsService} from "../components/util/mock-settings-service";
import {act} from "react-dom/test-utils";
import SelectorInput from "../../src/components/selector-input";
import {click} from "@testing-library/user-event/convenience/click";
import {userEvent} from "@testing-library/user-event/setup/index";

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const Container = styled.div``;

type JSDOMLike = {
    window: any
}
const withDocument = (actionFn: { (doc: Document, window: Window, dom: any): void }, htmlFontSize = "font-size: 10px"): JSDOMLike => {
    // const Component = () => {
    //     return (<Container id={"mount"} />);
    // }
    // const div = render(<Component />)
    const dom = new JSDOM(`<html style="${htmlFontSize}"><body><div id='mount'></div></body></html>`, {}); //new Document()
    Object.defineProperty(dom.window.HTMLHtmlElement.prototype, 'clientHeight', { value: 768 });
    Object.defineProperty(dom.window.HTMLHtmlElement.prototype, 'clientWidth', { value: 1024 });

    actionFn(dom.window.document, dom.window, dom);

    return dom;
}

describe("selector quad service", () => {
   test("selector triad generator", () => {
       withDocument((doc, window) => {
           const elem = doc.createElement("p");
           const colorGeneratorService = new ColorGeneratorService()
           const selectorHierarchyService = new SelectorHierarchy(colorGeneratorService)
           const aside = doc.createElement("p")
           doc.querySelector("#mount")?.appendChild(elem)
           elem.appendChild(aside)

           elem.classList.add("test")
           elem.style.width = "1000px"
           elem.style.marginLeft = "1000px"
           elem.style.height = "1000px"
           elem.style.marginTop = "1000px"
           aside.classList.add("test-child")

           const quads = [
               ...DefaultSplitComplement,
               ...DefaultTetrad,
               ...DefaultSplitComplement
           ]

           const thoustSelection = ForThoustPanel(
               doc, [".test", ".test-child", ...SelectorsDefaultFactory()].join(", "),
               selectorHierarchyService, undefined,
               getDefaultFontSizeREM.bind(null, window)
           );

           // there should be 3 islands, 2 with test and test-child, and a 3rd for p
           // @ts-ignore
           expect(quads.includes([...thoustSelection.htmlSelectors.values()][0].color)).toBeTruthy()
           // critic acid yum

           // expect uhhh the colors duke, the colors
       })
   })

    describe('ColorGeneratorService', function () {
        const colorService = new ColorGeneratorService();
        const uniqueSet = (set: any[]) => { return !set.find((s, i) => set.find((o, j) => o === s && i !== j ))}
        test("color generator service provides expected defaults for tetrads", () => {
            // test defaults and randomization, but leave the color picking testing to tinycolor
            const tetrad = colorService.getDefaultTetrad(0)
            expect(tetrad[0].toString("hex")).toBe(DefaultTetrad[0].toString("hex"))
            expect(uniqueSet(tetrad)).toBeTruthy();

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultTetrad()[0] !== DefaultTetrad[0]
            }
            expect(randomized).toBeTruthy()
        })
        test("color generator service provides expected defaults for triads", () => {
            const triad = colorService.getDefaultTriad(0)
            expect(triad[0].toString("hex")).toBe(DefaultTriad[0].toString("hex"))
            expect(uniqueSet(triad)).toBeTruthy();

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultTriad()[0] !== DefaultTriad[0]
            }
            expect(randomized).toBeTruthy()
        })
        test("color generator service provides expected defaults for split complements", () => {
            const complements = colorService.getDefaultSplitComponent(0)
            expect(complements[0].toString("hex")).toBe(DefaultSplitComplement[0].toString("hex"))
            expect(uniqueSet(complements)).toBeTruthy();

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultSplitComponent()[0] !== DefaultSplitComplement[0]
            }
            expect(randomized).toBeTruthy()
        })
    });

   describe("size calculation", () => {
       test("calc size px", () => {
           const window = withDocument((doc, window) => {
               const elem = doc.createElement("div");
               doc.querySelector('#mount')?.appendChild(elem)
               elem.style.left = "2000000000000px";
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER,
                   getDefaultFontSizeREM.bind(null, window))).toBe(2000000000000)
           })
       })

       test("calc rotation px", () => {
           const window = withDocument((doc, window) => {
               const elem = doc.createElement("div");
               doc.querySelector('#mount')?.appendChild(elem)
               const ela = doc.createElement("div");
               elem.style.rotate = "20deg";
               ela.style.rotate = "2rad";
               elem.appendChild(ela);
               const elemRotation = SizeFunctions.calcRotation(elem, getDefaultFontSizeREM.bind(null, window))
               const rotation = SizeFunctions.calcRotation(ela, getDefaultFontSizeREM.bind(null, window))
               expect(Math.floor(rotation)).toBe(Math.floor(134))
           })
       })

       test("calc size px width with clientWidth", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.width = "2000000000000px"

               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.WIDTH,
                   getDefaultFontSizeREM.bind(null, window))).toBe(0)
               // jsdom fails setting this with define property as recommended several places, but at least it differs significantly
               // todo: make sure these are useful, and if not, provide a clientWidth || calcSize(..., SizeProperties.OTHER, ...)
           })
       })
       test("calc size px height with clientHeight", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.height = "2000000000000px"
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.HEIGHT,
                   getDefaultFontSizeREM.bind(null, window))).toBe(0)
               // jsdom fails setting this with define property as recommended several places, but at least it differs significantly
               // todo: make sure these are useful, and if not, provide a clientHeight || calcSize(..., SizeProperties.OTHER, ...)
           })
       })

       test("calc size rem", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.left = "2rem"
               doc.querySelector("#mount")?.appendChild(elem)
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, getDefaultFontSizeREM.bind(null, window)))
                   .toBe(20)
           })
       })

       test("calc size em, parent font size", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               const parent = doc.createElement("div");
               parent.style.fontSize = "20px"
               elem.style.left = "2em"
               parent.appendChild(elem)

               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, getDefaultFontSizeREM.bind(null, window)))
               .toBe(40)
           })
       })

       test("calc size em, parent no font size", () => {
            // todo: also test this in a browser, if i had some QE folks at my request and reject, i'd ask them to automate this ~~
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               const parent = doc.createElement("div");
               parent.style.fontSize = ""
               elem.style.left = "2em"
               parent.appendChild(elem)

               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, getDefaultFontSizeREM.bind(null, window)))
                   .toBe(30)
           }, "font-size: 15px")
       })

       test("calc size %, parent has size", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.width = "50%"

               const mount = (doc.querySelector("#mount")!! as HtmlElement)
               mount.style.width = "800px"
               mount.appendChild(elem)

               expect(SizeFunctions.calcSize(elem, elem.style.width, SizeProperties.OTHER,
                   getDefaultFontSizeREM.bind(null, window), () => 800)).toBe(400)
               // jsdom fails setting this with define property as recommended several places, but at least it differs significantly
               // todo: make sure these are useful, and if not, provide a clientWidth || calcSize(..., SizeProperties.OTHER, ...)
           })
       })

       test("calc size %, parent has size", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.width = "50%" // 400
               const elem2 = doc.createElement("div");
               elem2.style.width = "50%" // 200
               const elem3 = doc.createElement("div");
               elem3.style.width = "50%" // 100

               const mount = (doc.querySelector("#mount")!! as HtmlElement)
               mount.style.width = "800px"

               mount.appendChild(elem)
               elem.appendChild(elem2)
               elem2.appendChild(elem3)

               expect(SizeFunctions.calcSize(elem3, elem.style.width, SizeProperties.OTHER,
                   getDefaultFontSizeREM.bind(null, window), () => 800)).toBe(100) // cube roots!
               // jsdom fails setting this with define property as recommended several places, but at least it differs significantly
               // todo: make sure these are useful, and if not, provide a clientWidth || calcSize(..., SizeProperties.OTHER, ...)
           })
       })

       test("calc size %, parent is document", () => {
           withDocument((doc, window) => {
               const elem = doc.createElement("div");
               elem.style.width = "50%"

               doc.querySelector("body")?.appendChild(elem);

               expect(SizeFunctions.calcSize(elem, elem.style.width, SizeProperties.OTHER,
                   getDefaultFontSizeREM.bind(null, window), () => 1024)).toBe(512)
               // jsdom fails setting this with define property as recommended several places, but at least it differs significantly
               // todo: make sure these are useful, and if not, provide a clientWidth || calcSize(..., SizeProperties.OTHER, ...)
           }, "font-size: 10px; width: 1024")
       })
   })

    describe("content.js mounting", () => {
        test("mount and verify element, selector modification", async () => {
            return new Promise(async (resolve, reject) => {
                const service = new SelectorHierarchy(new ColorGeneratorService());

                withDocument((doc, window, dom) => {
                    const host = doc.createElement("div");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    doc.body.appendChild(host);
                    let setSelector = (selector: string): void => {
                        throw new Error("didn't initialize modifier")
                    }
                    let confirmedSelector = "unconfirmed selector"
                    const mount = MountOrFindSelectorHierarchyComponent({
                        service,
                        selector: "",
                        passSetSelector: (modifier) => {
                            setSelector = modifier
                        },
                        onConfirmSelector: (selector) => {
                            confirmedSelector = selector
                        },
                        doc,
                        uiRoot: shadowRoot,
                        renderFunction: (mount, component) => {
                            expect(mount).toBeDefined();
                            render(component as ReactElement, { container: mount, baseElement: mount });
                        }
                    })

                    expect(mount).toBeDefined();
                    act(() => {
                        setSelector("test selector");
                    })

                    waitFor(async () => {
                        // todo: screen doesn't seem to register the provided jsdom,
                        //       so for any text verification, we'll just have to search the innerHTML etc
                        //       or use selector queries
                        expect(mount.innerHTML).toContain("test selector")
                    }, {timeout: 200, interval: 300}).then(resolve)
                });
            })
        });

        test("test for pre-existing mount", () => {
            return new Promise(async (resolve, reject) => {
                const service = new SelectorHierarchy(new ColorGeneratorService());

                withDocument((doc, window, dom) => {
                    const host = doc.createElement("div");
                    const shadowRoot = host.attachShadow({ mode: "open" });
                    doc.body.appendChild(host);
                    let setSelector = (selector: string): void => {
                        throw new Error("didn't initialize modifier")
                    }
                    const existingMount = MountOrFindSelectorHierarchyComponent({
                        service,
                        selector: "",
                        passSetSelector: (modifier) => {
                            setSelector = modifier
                        },
                        onConfirmSelector: (selector) => {
                            confirmedSelector = selector
                        },
                        doc,
                        uiRoot: shadowRoot,
                        renderFunction: (mount, component) => {
                            expect(mount).toBeDefined();
                            render(component as ReactElement, { container: mount, baseElement: mount });
                        }
                    })

                    expect(existingMount).toBeDefined();
                    act(() => {
                        setSelector("pre-existing selector");
                    })

                    let confirmedSelector = "unconfirmed selector"
                    const mount = MountOrFindSelectorHierarchyComponent({
                        service,
                        selector: "",
                        passSetSelector: (modifier) => {
                            setSelector = modifier
                        },
                        onConfirmSelector: (selector) => {
                            confirmedSelector = selector
                        },
                        doc,
                        uiRoot: shadowRoot,
                        renderFunction: (mount, component) => {
                            expect(mount).toBeDefined();
                            render(component as ReactElement, { container: mount, baseElement: mount });
                        }
                    })

                    expect(mount !== existingMount).toBeTruthy()

                    expect(mount).toBeDefined();
                    act(() => {
                        setSelector("test selector");
                    })

                    waitFor(async () => {
                        expect(mount.innerHTML).toContain("test selector")
                    }, {timeout: 200, interval: 300}).then(resolve)
                });
            });
        })

        // todo: get this working
        // todo: mock message broker for tests?
        // todo: light PACT testing for message interactions like the selection picker
        // test("selector change for selector-input, act probably wont work lol", () => {
        //     return new Promise(async (resolve, reject) => {
        //         await withMockSettingsService(async (settingsService, accessRegistry) => {
        //             //const service = new SelectorHierarchy(new ColorGeneratorService());
        //             const user = userEvent.setup()
        //             withDocument((doc, window, dom) => {
        //                 const mount = doc.querySelector("#mount")
        //                 render(
        //                     <SelectorInput
        //                         selector={"test"} selectors={["test", "1", "2", "3"]} saved={false}
        //                         selectorClicked={function (): void {
        //
        //                         }}
        //                         onSave={function (selector: string): void {
        //
        //                         }}
        //                         selectorModeClicked={function (selectorModeOn: boolean): void {
        //
        //                         }}
        //                         selectorModeOn={false} />,
        //                  {
        //                             container: mount,
        //                             baseElement: mount
        //                         }
        //                 );
        //
        //                 act(async () => {
        //                     const label = (await screen.findAllByTestId("clickable-selector-label"))[0] as Element
        //                     user.click(label)
        //                 })
        //             })
        //         })
        //     })
        // })
    })
});
