import {
    ColorGeneratorServiceInterface,
    SelectorHierarchyService,
    Color,
    HtmlElement,
    ForThoustPanel,
    ColorGeneratorService,
    DefaultTetrad,
    DefaultSplitComplement,
    DefaultTriad,
    SizeFunctions,
    SizeProperties
} from "../../src/services/selector-hierarchy-service";

import tinycolor from "tinycolor2"
import {SelectorsDefaultFactory} from "../../src/models/defaults";
import {getDefaultFontSizeREM} from "../../src/util/util";

describe("selector quad service", () => {
   test("selector triad generator", () => {
       const colorGeneratorService = new ColorGeneratorService()
       const selectorHierarchyService = new SelectorHierarchyService(colorGeneratorService)
       const element = new HTMLElement()
       const aside = new HTMLElement()

       element.appendChild(aside)

       element.classList.add("test")
       aside.classList.add("test-child")

       const quads = [
           ...DefaultSplitComplement,
           ...DefaultTetrad,
           ...DefaultSplitComplement
       ]

       expect(quads.includes([...ForThoustPanel(
           document, SelectorsDefaultFactory().join(", "), selectorHierarchyService).htmlSelectors.values()][0].color)).toBeTruthy()
       // critic acid yum

       // expect uhhh the colors duke, the colors
   })

    describe('ColorGeneratorService', function () {
        const colorService = new ColorGeneratorService();
        test("color generator service provides expected defaults for tetrads", () => {
            // test defaults and randomization, but leave the color picking testing to tinycolor
            expect(colorService.getDefaultTetrad(0)).toBe(DefaultTetrad[0])
            expect(colorService.getDefaultTetrad(1)).toBe(DefaultTetrad[1])
            expect(colorService.getDefaultTetrad(2)).toBe(DefaultTetrad[2])
            expect(colorService.getDefaultTetrad(3)).toBe(DefaultTetrad[3])

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultTetrad()[0] !== DefaultTetrad[0]
            }
            expect(randomized).toBeTruthy()
        })
        test("color generator service provides expected defaults for triads", () => {
            expect(colorService.getDefaultTriad(0)).toBe(DefaultTriad[0])
            expect(colorService.getDefaultTriad(1)).toBe(DefaultTriad[1])
            expect(colorService.getDefaultTriad(2)).toBe(DefaultTriad[2])

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultTriad()[0] !== DefaultTriad[0]
            }
            expect(randomized).toBeTruthy()
        })
        test("color generator service provides expected defaults for split complements", () => {
            expect(colorService.getDefaultSplitComponent(0)).toBe(DefaultSplitComplement[0])
            expect(colorService.getDefaultSplitComponent(1)).toBe(DefaultSplitComplement[1])

            let randomized = false;
            while (!randomized) {
                randomized = randomized || colorService.getDefaultSplitComponent()[0] !== DefaultSplitComplement[0]
            }
            expect(randomized).toBeTruthy()
        })
    });

   describe("size calculation", () => {
       const getDocumentWithElement = (element: HtmlElement, htmlFontSize = "font-size: 10px") => {
           const doc = new Document()
           doc.append(`<html style="${htmlFontSize}"><body><div id='mount'></div></body></html>`)
           doc.querySelector('#mount')?.appendChild(element)
           return doc;
       }
       test("calc size px", () => {
           const elem = new HTMLElement()
           elem.style.left = "2000000000000px"
           const doc = getDocumentWithElement(elem)
           expect(SizeFunctions.calcSize(elem, elem.style.left)).toBe(2000000000000)
       })
       test("calc size px width with clientWidth", () => {
           const elem = new HTMLElement()
           elem.style.width = "2000000000000px"
           const doc = getDocumentWithElement(elem)
           expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.WIDTH)).toBe(2000000000000)
       })
       test("calc size px height with clientWidth", () => {
           const elem = new HTMLElement()
           elem.style.height = "2000000000000px"
           const doc = getDocumentWithElement(elem)
           expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.WIDTH)).toBe(2000000000000)
       })

       test("calc size rem", () => {
           const elem = new HTMLElement()
           elem.style.left = "2rem"
           const doc = getDocumentWithElement(elem)
           expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
               .toBe(20)
       })

       test("calc size em, parent font size", () => {
           const elem = new HTMLElement()
           const parent = new HTMLElement()
           parent.style.fontSize = "20px"
           elem.style.left = "2em"
           parent.appendChild(elem)

           const doc = getDocumentWithElement(elem)
           expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
               .toBe(40)
       })

       test("calc size em, parent no font size", () => {
            // todo: also test this in a browser, if i had some QE folks at my request and reject, i'd ask them to automate this ~~
           const elem = new HTMLElement()
           const parent = new HTMLElement()
           parent.style.fontSize = "20px"
           elem.style.left = "2em"
           parent.appendChild(elem)

           const doc = getDocumentWithElement(elem, "font-size: 15px")
           expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
               .toBe(30)
       })
   })
});