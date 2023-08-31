import * as React from "react"


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
import {render} from "@testing-library/react";

import styled from 'styled-components';

const Container = styled.div``;

const withDocument = (actionFn: { (doc: Document): void }, htmlFontSize = "font-size: 10px") => {
    const Component = () => {
        return (<Container id={"mount"} />);
    }
    const div = render(<Component />)
    const doc = document; //new Document()
    doc.append(`<html style="${htmlFontSize}"><body><div id='mount'></div></body></html>`)

    actionFn(doc);

    return doc;
}

describe("selector quad service", () => {
   test("selector triad generator", () => {
       withDocument(doc => {
           const elem = doc.createElement("div");
           const colorGeneratorService = new ColorGeneratorService()
           const selectorHierarchyService = new SelectorHierarchyService(colorGeneratorService)
           const aside = doc.createElement("div")
           doc.querySelector("#mount")?.appendChild(elem)
           elem.appendChild(aside)

           elem.classList.add("test")
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
           withDocument(doc => {
               const elem = doc.createElement("div");
               elem.style.left = "2000000000000px";
               expect(SizeFunctions.calcSize(elem, elem.style.left)).toBe(2000000000000)
           })
       })
       test("calc size px width with clientWidth", () => {
           withDocument(doc => {
               const elem = doc.createElement("div");
               elem.style.width = "2000000000000px"
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.WIDTH)).toBe(2000000000000)
           })
       })
       test("calc size px height with clientWidth", () => {
           withDocument(doc => {
               const elem = doc.createElement("div");
               elem.style.height = "2000000000000px"
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.WIDTH)).toBe(2000000000000)
           })
       })

       test("calc size rem", () => {
           withDocument(doc => {
               const elem = doc.createElement("div");
               elem.style.left = "2rem"
               doc.appendChild(elem)
               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
                   .toBe(20)
           })
       })

       test("calc size em, parent font size", () => {
           withDocument(doc => {
               const elem = doc.createElement("div");
               const parent = doc.createElement("div");
               parent.style.fontSize = "20px"
               elem.style.left = "2em"
               parent.appendChild(elem)

               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
               .toBe(40)
           })
       })

       test("calc size em, parent no font size", () => {
            // todo: also test this in a browser, if i had some QE folks at my request and reject, i'd ask them to automate this ~~
           withDocument(doc => {
               const elem = doc.createElement("div");
               const parent = doc.createElement("div");
               parent.style.fontSize = "20px"
               elem.style.left = "2em"
               parent.appendChild(elem)

               expect(SizeFunctions.calcSize(elem, elem.style.left, SizeProperties.OTHER, () => getDefaultFontSizeREM(doc)))
                   .toBe(30)
           })
       })
   })
});