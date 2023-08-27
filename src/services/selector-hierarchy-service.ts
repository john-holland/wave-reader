import {FunctionComponent, useState} from "react";
import * as console from "console";
import tinycolor, { ColorInput } from "tinycolor2";
import {SelectorsDefaultFactory} from "../models/defaults";

// probably use the chrome types version
export type HtmlElement = {
    background_color: string;
    margin_right: number;
    padding_top: number;
    padding_left: number;
    margin_left: number;
    margin_top: number;
    type: string
    innerHTML: string
    outerHTML: string
    parent?: HtmlElement
    children: HtmlElement[]
    width: number
    height: number
    left: number
    top: number
    id: string
    name: string
    attributes: Map<string, string>
    classList: string[]
    style: Map<string, string>
    addElement: { (element: HtmlElement): void }
}

export type Selector = {
    elem: HtmlElement[]
    classList: string[]
    // consider adding xpath
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
type Color = tinycolor.Constructor

// todo: use tiny color to generate color triads, quads, split complements
export interface ColorGeneratorServiceInterface {
    getTriad(color: Color, seed: any): Color[]
    getSplitComponent(color: Color, seed: any): Color[]
    getQuad(color: Color, seed: any): Color[]
}

export type ColorSelection = {
    selector: Selector
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

// TODO: test!
const ArrayReferenceEquals = <T> (array1: T[], array2: T[]) => {
    return !array1.find(el => !array2.includes(el))
}

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

    function getNeighborIslands(elements: HtmlElement[], initialSelector: string[] = SelectorsDefaultFactory()): Map<Selector, HtmlElement[]> {
        initialSelector = initialSelector.flatMap(selector => selector.split(`,`))

        // for each element, add an entry to the class map
        const classMap = elements.reduce<Map<string, HtmlElement[]>>((map: Map<string, HtmlElement[]>, el: HtmlElement) => {
                            el.classList.filter(className => initialSelector.includes(className))
                                        .forEach(className => map.set(className, map.get(className) || []))
                            return map;
                        }, new Map<string, HtmlElement[]>())

        const getPathSelector = (el: HtmlElement | undefined): string => {
            if (el === undefined) return ""
            const parentNode: HtmlElement | undefined = el.parent
            return (parentNode ? getPathSelector(parentNode) + " > " : "") + el.classList.join(",") // ternary for tail recursion
        }


        // for each class find neighbors, and make islands
        const isNeighbor = (el: HtmlElement, possibleNeighbor: HtmlElement) => {
            const elParent = getPathSelector(el.parent)
            const neighborParent = getPathSelector(possibleNeighbor.parent)
            return (
                el.parent === possibleNeighbor || // sibling
                neighborParent === elParent || // parent
                getPathSelector(possibleNeighbor).includes(getPathSelector(el)) // descendant
            )
        }
        const neighborIslands = [...classMap.values()].flatMap<HtmlElement[]>(c => c)
            .reduce<Map<string, HtmlElement[][]>>((map, elements) => {
                for (const element of elements) {
                    for (const className of element.classList) {
                        const htmlElementCollections = map.get(className) || [];
                        // search each collection, and if they're a neighbor then push and stop
                        // if not, add a new collection with the element
                        let foundNeighbor = false;

                        const neighborCollection = htmlElementCollections?.find(collection =>
                            collection.find(possibleNeighbor => isNeighbor(element, possibleNeighbor)))
                        if (neighborCollection) {
                            neighborCollection.push(element);
                        } else {
                            htmlElementCollections.push([element])
                        }

                        map.set(className, htmlElementCollections)
                    }
                }
                return map;
            }, new Map<string, HtmlElement[][]>());


        // min size question for neighbor island
        //
        // there is no absolute position, so each element is dependent on parent left, and siblings + wrap
        // this being said, most text is contained in article like columns, so it may be a non issue
        //  additionally the sibling position on
        const calcLeft = (n: HtmlElement): number => n.left + n.margin_left + (n.parent?.padding_left || 0) + (n.parent ? calcLeft(n.parent) : 0);
        const calcRight = (n: HtmlElement): number => n.left + n.margin_left + (n.parent?.padding_left || 0) + (n.parent ? calcLeft(n.parent) : 0) + n.width + n.margin_right;
        const calcTop = (n: HtmlElement): number => n.top + n.margin_top + (n.parent?.padding_top || 0) + (n.parent ? calcTop(n.parent) : 0);
        const calcBottom = (n: HtmlElement): number => n.top + n.margin_top + (n.parent?.padding_top || 0) + (n.parent ? calcTop(n.parent) : 0) + n.height;

        const MIN_ISLAND_AREA = (20 * 20);
        // then merge islands with shared HtmlElement[] collections into Selectors
        // filter out islands smaller than 20px x 20px
        const neighborMap = [...neighborIslands.keys()].reduce((map, key) => {
            const selectors = [...map.keys()]
            const uncheckedSelectors = selectors.filter(selector => !selector.classList.includes(key))
            // given any selector we haven't already added a class collection
            //  (we'll have to test to assert for the assumption that islands have no overlap)
            neighborIslands.get(key)?.filter(island => {
                const islandArray = [...island.values()];
                const left =  Math.min(...islandArray.map(e => calcLeft(e)));
                const right = Math.max(...islandArray.map(e => calcRight(e)));
                const top = Math.min(...islandArray.map(e => calcTop(e)));
                const bottom = Math.max(...islandArray.map(e => calcBottom(e)));
                const area = right - left * bottom - top;
                return area > (MIN_ISLAND_AREA);
            }).forEach(island => {
                const selector = uncheckedSelectors.find(selector =>
                    selector.elem.length === island.length && ArrayReferenceEquals(selector.elem, island))
                    || { elem: [island], classList: [] } as unknown as Selector;

                selector.classList.push(key)
                map.set(selector, selector.elem)
            })

            return map;
        }, new Map<Selector, HtmlElement[]>())

        return neighborMap;
    }

    const neighborIslands = getNeighborIslands([...nonSelectedHtmlElements, ...selectedHtmlElements]);

    const someDafadilTypeShiz = "#eea"

    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const easterIslandsStatues = [...neighborIslands.values()].map(island => island[0]) // extremely important
    /* eslint-enable  @typescript-eslint/no-unused-vars */

    // maybe redesign with a color selector
    const selection = selectorHierarchyService.assignColorSelectionsForSelector(
            [...neighborIslands.keys()], (selector, i): ColorSelection => {
                // todo: ring buffer of cool starting colors
                const colors = selector.length / 3 ?
                    tinycolor(someDafadilTypeShiz).triad() : tinycolor(someDafadilTypeShiz).tetrad();

                return {
                    selector,
                    color: colors[i % colors.length]
                };
            });

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
    assignColorSelectionsForSelector(selectors: Selector[], selectorColorGenerator: { (selector: Selector): ColorSelection }): HtmlSelection
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

    assignColorSelectionsForSelector(selector: Selector[], selectorsGenerator: { (selector: Selector): ColorSelection }): HtmlSelection {
        const selectorsMap = new Map<Selector, ColorSelection>();

        selector.forEach(selector => {
            return selectorsMap.set(selector, selectorsGenerator(selector))
        })

        return {
            htmlSelectors: selectorsMap
        }
    }

}
