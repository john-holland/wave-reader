import * as React from "react"


import {
    ColorGeneratorService,
    DefaultSplitComplement,
    DefaultTetrad,
    DefaultTriad,
    ForThoustPanel,
    SelectorHierarchyService,
    SizeFunctions,
    SizeProperties
} from "../../src/services/selector-hierarchy-service";
import {SelectorsDefaultFactory} from "../../src/models/defaults";
import {getDefaultFontSizeREM} from "../../src/util/util";

import styled from 'styled-components';
import "@testing-library/jest-dom"

const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const Container = styled.div``;

type JSDOMLike = {
    window: any
}
const withDocument = (actionFn: { (doc: Document, window: Window): void }, htmlFontSize = "font-size: 10px"): JSDOMLike => {
    // const Component = () => {
    //     return (<Container id={"mount"} />);
    // }
    // const div = render(<Component />)
    const dom = new JSDOM(`<html style="${htmlFontSize}"><body><div id='mount'></div></body></html>`, {}); //new Document()
    Object.defineProperty(dom.window.HTMLHtmlElement.prototype, 'clientHeight', { value: 768 });
    Object.defineProperty(dom.window.HTMLHtmlElement.prototype, 'clientWidth', { value: 1024 });

    actionFn(dom.window.document, dom.window);

    return dom;
}

describe("selector quad service", () => {
   test("selector triad generator", () => {
       withDocument((doc, window) => {
           const elem = doc.createElement("p");
           const colorGeneratorService = new ColorGeneratorService()
           const selectorHierarchyService = new SelectorHierarchyService(colorGeneratorService)
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
   })
});