import {FunctionComponent, useState} from "react";
import * as console from "console";

// probably use the chrome types version
export type HtmlElement = {
    type: string
    innerHTML: string
    outerHTML: string
    children: HtmlElement[]
    neighbors: HtmlElement[]
    width: number
    height: number
    left: number
    top: number
    id: string
    name: string
    attributes: Map<string, string>
    classList: string[]
    style: Map<string, string>
    addElement: { (element: HtmlElement) }
}

export const enum SelectorType {
    css,
    xpath
}
export type SelectorToken = {
    type: SelectorType
    selector: Selector
}

export type Selector = {
    elem: HtmlElement[]
    classList: string[] // maybe yagni
    /**
     * root selector, xpath like if possible
     * arbitrary selector pieces
     */
    selectorList: SelectorToken[]
}

const enum SelectorEvent {
    SelectEvent,
    Select,
    CommonTextSelector, // "p,h2,h3,h4,h5,h6,h7,h8,article,section,aside,figcaption,pre,div"
    FindHighestLevelTextSelector, // LCG or something, top of tree
    DecreaseSelection,
    // [+] and [-] buttons
}

/**
 * 4 value color representation of the same color + hex with alpha
 * todo: back with tiny color
 */
export type Color = {
    hsv: string[]
    rbg: string[]
    hsl: string[]
    hex: string

    validate: () => ("meow >..<")
    // there should be an hsv to rbg to hsl conversion that equals the same value available in tiny color
    // but using a convert -> convert -> convert
}

// todo: use tiny color to generate color triads, quads, split complements
export interface ColorGeneratorServiceInterface {
    getTriad(color: Color, seed: any = 0): Color[]
    getSplitComponent(color: Color, seed: any = 0): Color[]
    getQuad(color: Color, seed: any = 0): Color[]
}

export type ColorSelection = {
    element: HtmlElement[]
    color: Color
}

export type HtmlSelection = {
    htmlSelectors: Map<Selector, ColorSelection>
}

// transparency is supported universally but there's a speed difference between adjusting
// alpha on an overlay or setting
const DimmPanelColor = "#eee"
const DimmAlphaAmount = "0.30"

type TC = {
    triad: { (color: Color): Color[] }
    quad: { (color: Color): Color[] }
}

type HtmlDocument = {
    heyDoc: string
    addElement(element: HtmlElement): void
    querySelectorAll(query: string): HtmlElement[]
}

class SvgElement {
    addElement(element: HtmlElement) {

    }
}

const tinycolor: TC = {}

export const ForThoustPanel = (document: HtmlDocument, panel: HtmlElement, selectorHierarchyService: SelectorHierarchyServiceInterface): HtmlSelection => {
    // figure out change of basis for screen pixels if necessary etc
    const mask = new SvgElement({ style: { pointerEvents: 'none' }, height: panel.height, width: panel.width, x: panel.left, y: panel.top })
    const cover = new SvgElement({ style: { pointerEvents: 'none' }, height: '100%', width: '100%', x: '0', y: '0' })

    // todo: insert mask svg css here

    cover.addElement(mask);
    document.addElement(cover);

    const colors = [...panel.children];

    const selectedHtmlElements = [...selection.keys()].flatMap(selector => selector.elem);
    const nonSelectedHtmlElements = [...document.querySelectorAll("*")].filter(el => selectedHtmlElements.includes(el));

    function getNeighborIslands(param: any[]): HtmlElement[][] {
        // todo: insert algorithm for neighbor discovery
    }

    const neighborIslands = getNeighborIslands([...nonSelectedHtmlElements, ...selectedHtmlElements]);

    neighborIslands.sort((a, b) => a.length > b.length ? 0 : 1)
    const someDafadilTypeShiz = "#eea"
    const easterIslandsStatues = neighborIslands.map(island => island[0])
    const selection = neighborIslands.reduce((map, island) => selectorHierarchyService.getTriadForSelector({ elem: island }, (htmlElements, i) => { const colors = htmlElements.length / 3 ?
        tinycolor.triad(someDafadilTypeShiz) : tinycolor.quad(someDafadilTypeShiz);
        return htmlElements.map(e => colors[i % colors.length])
    }), new Map<Selector, ColorSelection>());
    return {
        htmlSelectors: selection
    }
}

export interface SelectorHierarchyServiceInterface {
    /**
     * You need 3 selection (3!!) and this will return a HtmlSelection with a triad selected for the colors and a generator for extras
     * @param selector
     */
    getTriadForSelector(selector: Selector[], selectorsGenerator: { (selector: Selector): ColorSelection }): HtmlSelection
    getDimmedPanelSelectors(htmlHierarchy: HtmlElement[], selectedElements: HtmlElement[]): HtmlSelection
}

export class SelectorHierarchyService implements SelectorHierarchyServiceInterface {
    colorService: ColorGeneratorServiceInterface;

    constructor(colorService: ColorGeneratorServiceInterface) {
        this.colorService = colorService;
    }

    getDimmedPanelSelectors(htmlHierarchy: HtmlElement[], selectedElements: HtmlElement[]): HtmlSelection {
        return {
            htmlSelectors: new Map<Selector, ColorSelection>()
        }
    }

    getTriadForSelector(selector: Selector[], selectorsGenerator: { (selector: Selector): ColorSelection }): HtmlSelection {
        const selectorsMap = new Map<SelectorEvent, ColorSelection>();
        return {
            htmlSelectors: selectorsMap
        }
    }

}
