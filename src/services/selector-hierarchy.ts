import {FunctionComponent, useState} from "react";
// import * as console from "console";
import tinycolor, { ColorInput } from "tinycolor2";
import {SelectorsDefaultFactory} from "../models/defaults";
import SettingsService, {SettingsDAOInterface} from "./settings";
import {getDefaultFontSizeREM, getSizeValuesRegex} from "../util/util";

// probably use the chrome types version
 export type HtmlElement = HTMLElement
//     background_color: string;
//     margin_right: number;
//     padding_top: number;
//     padding_left: number;
//     margin_left: number;
//     margin_top: number;
//     type: string
//     innerHTML: string
//     outerHTML: string
//     parent?: HtmlElement
//     children: HtmlElement[]
//     width: number
//     height: number
//     left: number
//     top: number
//     id: string
//     name: string
//     attributes: Map<string, string>
//     classList: string[]
//     style: Map<string, string>
//     addElement: { (element: HtmlElement): void }
// }

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
export type Color = tinycolor.Instance

// todo: use tiny color to generate color triads, quads, split complements
export interface ColorGeneratorServiceInterface {
    getTriad(color: Color, spin: any): Color[]
    getSplitComponent(color: Color, spin: any): Color[]
    getTetrad(color: Color, spin: any): Color[]
    getDefaultTriad(startingIndex: number, seed: any): Color[]
    getDefaultSplitComponent(startingIndex: number, seed: any): Color[]
    getDefaultTetrad(startingIndex: number, seed: any): Color[]
}

const randomCollectionIndex = (collection: any[]) => (Math.floor(Math.random() * collection.length));

export class ColorGeneratorService implements ColorGeneratorServiceInterface {
    getTetrad(color: Color, spin: number = 0): Color[] {
        return tinycolor(color.spin(spin)).tetrad();
    }

    getSplitComponent(color: Color, spin: number = 0): Color[] {
        return tinycolor(color.spin(spin)).splitcomplement()
    }

    getTriad(color: Color, spin: number = 0): Color[] {
        return tinycolor(color.spin(spin)).triad()
    }

    getDefaultTetrad(startingIndex: number = randomCollectionIndex(DefaultTetrad), seed?: any): Color[] {
        return tinycolor(DefaultTetrad[startingIndex % DefaultTetrad.length]).tetrad();
    }

    getDefaultSplitComponent(startingIndex: number = randomCollectionIndex(DefaultSplitComplement), seed?: any): Color[] {
        return tinycolor(DefaultSplitComplement[startingIndex % DefaultSplitComplement.length]).splitcomplement()
    }

    getDefaultTriad(startingIndex: number = randomCollectionIndex(DefaultTetrad), seed?: any): Color[] {
        return tinycolor(DefaultTriad[startingIndex % DefaultTriad.length]).triad()
    }
}

export type ColorSelection = {
    selector: Selector
    color: Color
}

export class HtmlSelection {
    htmlSelectors: Map<Selector, ColorSelection>

    constructor(htmlSelectors: Map<Selector, ColorSelection>) {
        this.htmlSelectors = htmlSelectors
    }
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

export const enum SizeProperties {
    OTHER = 0,
    HEIGHT = 1,
    WIDTH = 2
}
const _parent = (n: HtmlElement): HtmlElement | undefined => (n.parentNode as unknown as HtmlElement);
const getDocumentWidth = (doc: Document) => (doc.querySelector("html")?.clientWidth || 0)
/**
 * returns all given sizes in [px], requires the html element to pop up the stack to figure out font sizes
 * @param element [HtmlElement]
 * @param size [string] "#px" | "#rem" | "#em"
 * @param property [SizeProperty]
 */
const calcSize = (element: HtmlElement | undefined, size: string, property: SizeProperties = SizeProperties.OTHER,
                  fontSizeRemDefaultAccessor = getDefaultFontSizeREM,
                  documentWidthAccessor = getDocumentWidth.bind(null, element?.ownerDocument!!)): number => {
    if (!element) return 0;

    switch (property) {
        case SizeProperties.HEIGHT:
            return element.clientHeight;
        case SizeProperties.WIDTH:
            return element.clientHeight;
        default:
            if (!size || size.trim() === "") {
                return 0;
            }
            const { size: sizeValue, sizeType } = getSizeValuesRegex(size)

            if (size === "0" || !sizeType || sizeType.trim() === "") return 0;

            // for rem, we reference document.querySelector("html").style.fontSize
            const remSize = Number(getSizeValuesRegex(fontSizeRemDefaultAccessor()).size)
            const emSize: number = sizeType.toLowerCase() === "px" ? 0 :
                calcSize(_parent(element), _parent(element)?.style?.fontSize || (remSize + "px"),
                SizeProperties.OTHER, fontSizeRemDefaultAccessor)

            if (isNaN(Number(sizeValue))) {
                console.log("foud NaN sizeValue for sizeType: " + sizeType + " with value, " + sizeValue)
            }
            switch (sizeType.toLowerCase()) {
                case "px":
                    return Number(sizeValue);
                case "rem":
                    return Number(sizeValue) * remSize
                case "em":
                    return Number(sizeValue) * emSize
                case "%":
                    const parent = _parent(element);
                    // todo: may have to factor html padding / body margin for realistic viewport width?
                    const parentWidth = !parent || parent?.nodeName.toLowerCase() === "body" || parent?.nodeName.toLowerCase() === "html"
                        ? documentWidthAccessor()
                        : parent.clientWidth || calcSize(parent, parent?.style.width, SizeProperties.OTHER, fontSizeRemDefaultAccessor)

                    return Math.floor(parentWidth / 100.0 * Number(sizeValue))
                default:
                    console.log(" unknown size type: " + sizeType + " returning bare, as pixels: " + sizeValue)
                    return Number(sizeValue)
            }
    }
}

const calcLeft = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM): number => {
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor)
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n)!!, fontSizeRemDefaultAccessor) : 0);
}
const calcRight = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor) || 0
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n)!!, fontSizeRemDefaultAccessor) : 0) + cs(n.style?.width) +
        cs(n.style?.marginRight);
}
const calcTop = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor)
    return cs(n.style?.top) +
        cs(n.style?.marginTop) +
        calcSize(_parent(n),_parent(n)?.style?.paddingTop || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcTop(_parent(n)!!, fontSizeRemDefaultAccessor) : 0);
}
const calcBottom = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor)
    return cs(n.style?.top) + cs(n.style?.marginTop) +
        calcSize(_parent(n), _parent(n)?.style?.paddingTop || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcTop(_parent(n)!!, fontSizeRemDefaultAccessor) : 0) +
        cs(n.style?.height);
}

export const SizeFunctions = {
    calcSize,
    calcLeft,
    calcRight,
    calcTop,
    calcBottom
}

export const ForThoustPanel = (
    document: Document,
    selector: string,
    selectorHierarchyService: SelectorHierarchyServiceInterface,
    existingSelection?: HtmlSelection,
    fontSizeRemDefaultAccessor = getDefaultFontSizeREM
): HtmlSelection => {
    // figure out change of basis for screen pixels if necessary etc

    // todo: figure out where we're going here, do we want one panel specified or each panel showing?
    const selectedHtmlElements = existingSelection !== undefined ?
        [...existingSelection.htmlSelectors.keys()].flatMap(k => k.elem) :
        [...(selector.trim() === "" ? document.querySelectorAll(SelectorsDefaultFactory().join(",")) : document.querySelectorAll(selector))];
    const nonSelectedHtmlElements = [...document.querySelectorAll("*")].filter(el => !selectedHtmlElements.includes(el));

    function getNeighborIslands(elements: HtmlElement[], initialSelector: string[] = SelectorsDefaultFactory()): Map<Selector, HtmlElement[]> {
        initialSelector = initialSelector.flatMap(selector => selector.split(`,`).map(s => s.toLowerCase()))

        // for each element, add an entry to the class map
        const classMap = elements.reduce<Map<string, HtmlElement[]>>((map: Map<string, HtmlElement[]>, el: HtmlElement) => {
                            // kind of cludgey but we'll just let the classMap include the nodeName,
                            // slightly flexible islands hopefully won't hurt
                            [el.nodeName, ...el.classList].map(c => c.toLowerCase().trim())
                                .filter(className => initialSelector.includes(className) || initialSelector.includes(el.nodeName))
                                    .forEach(className => map.set(className, map.get(className) || [el]))
                            return map;
                        }, new Map<string, HtmlElement[]>())

        const getPathSelector = (el: HtmlElement | undefined): string => {
            if (el === undefined) return ""
            const parentNode: HtmlElement | undefined = el.parentNode as HtmlElement
            return (parentNode ? getPathSelector(parentNode) + " > " : "") + Array.prototype.join.call(el.classList, ",") // ternary for tail recursion
        }

        // for each class find neighbors, and make islands
        const isNeighbor = (el: HtmlElement, possibleNeighbor: HtmlElement) => {
            const elParent = getPathSelector(el.parentNode as HtmlElement)
            const neighborParent = getPathSelector(possibleNeighbor.parentNode as HtmlElement)
            return (
                el.parentNode === possibleNeighbor || // sibling
                neighborParent === elParent || // parent
                getPathSelector(possibleNeighbor).includes(getPathSelector(el)) // descendant
            )
        }
        const neighborIslands = [...classMap.values()]//.flatMap<HtmlElement[]>(c => [...c])
            .reduce<Map<string, HtmlElement[][]>>((map, elements) => {
                [...elements].forEach((element) => {
                    [element.nodeName, ...element.classList].map(c => c.toLowerCase().trim()).forEach(className => {
                        // todo: review: lower className on list add?
                        const htmlElementCollections = map.get(className.toLowerCase()) || [];
                        // search each collection, and if they're a neighbor then push and stop
                        // if not, add a new collection with the element

                        const neighborCollection = htmlElementCollections?.find(collection =>
                            collection.find(possibleNeighbor => isNeighbor(element, possibleNeighbor)))
                        if (neighborCollection) {
                            neighborCollection.push(element);
                        } else {
                            htmlElementCollections.push([element])
                        }

                        map.set(className, htmlElementCollections)
                    })
                })
                return map;
            }, new Map<string, HtmlElement[][]>());


        // min size question for neighbor island
        //
        // there is no absolute position, so each element is dependent on parent left, and siblings + wrap
        // this being said, most text is contained in article like columns, so it may be a non issue
        //  additionally the sibling position on

        const MIN_ISLAND_AREA = (20 * 20);
        // then merge islands with shared HtmlElement[] collections into Selectors
        // filter out islands smaller than 20px x 20px
        const neighborMap = [...neighborIslands.keys()].reduce((map, key) => {
            const selectors = [...map.keys()]
            // todo: investigate, null selector.elem
            const uncheckedSelectors = selectors.filter(selector => selector.elem.find(e => e.nodeName?.toLowerCase() === key) || !selector.classList.includes(key))
            // given any selector we haven't already added a class collection
            //  (we'll have to test to assert for the assumption that islands have no overlap)
            neighborIslands.get(key)?.filter(island => {
                const islandArray = [...island.values()];
                const left =  Math.min(...islandArray.map(e => calcLeft(e, fontSizeRemDefaultAccessor)));
                const right = Math.max(...islandArray.map(e => calcRight(e, fontSizeRemDefaultAccessor)));
                const top = Math.min(...islandArray.map(e => calcTop(e, fontSizeRemDefaultAccessor)));
                const bottom = Math.max(...islandArray.map(e => calcBottom(e, fontSizeRemDefaultAccessor)));
                const area = (right - left) * (bottom - top);
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

    const neighborIslands = getNeighborIslands([...nonSelectedHtmlElements, ...selectedHtmlElements] as HtmlElement[]);


    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const someDafadilTypeShiz = "#eea" // :3
    const easterIslandsStatues = [...neighborIslands.values()].map(island => island[0]) // extremely important
    /* eslint-enable  @typescript-eslint/no-unused-vars */

    // maybe redesign with a color selector
    const selection = selectorHierarchyService.assignColorSelectionsForSelector(
        [...neighborIslands.keys()]);

    return selection;
}

export interface SelectorHierarchyServiceInterface {
    /**
     * You need 3 selection (3!!) and this will return a HtmlSelection with a triad selected for the colors and a generator for extras
     * @param selector
     */
    defaultSelectorGenerator(selector: Selector, startingIndex: number): ColorSelection
    getDimmedPanelSelectors(document: Document, selectedElements: HtmlElement[]): HtmlSelection
    assignColorSelectionsForSelector(selectors: Selector[], selectorColorGenerator?: { (selector: Selector, i: number): ColorSelection }): HtmlSelection
}

export const DefaultTetrad = [
    tinycolor("#09488F"),
    tinycolor("#410B95"),
    tinycolor("#DBC400"),
    tinycolor("#DB8500")
]

export const DefaultTriad = [
    tinycolor("#005AE9"),
    tinycolor("#FFCD00"),
    tinycolor("#FF6700")
]

export const DefaultSplitComplement = [
    tinycolor("#FFCD00"),
    tinycolor("#2700EB")
]

export class SelectorHierarchy implements SelectorHierarchyServiceInterface {
    colorService: ColorGeneratorServiceInterface;

    constructor(colorService: ColorGeneratorServiceInterface) {
        this.colorService = colorService;
    }

    getDimmedPanelSelectors(document: Document, selectedElements: HtmlElement[]): HtmlSelection {

        return {
            htmlSelectors: new Map<Selector, ColorSelection>()
        }
    }

    assignColorSelectionsForSelector(
        selector: Selector[],
        selectorsGenerator: { (selector: Selector, i: number): ColorSelection } = this.defaultSelectorGenerator
    ): HtmlSelection {
        const selectorsMap = new Map<Selector, ColorSelection>();

        selector.forEach((selector, i) => {
            return selectorsMap.set(selector, selectorsGenerator(selector, i))
        })

        return new HtmlSelection(selectorsMap)
    }

    defaultSelectorGenerator(selector: Selector, i: number):  ColorSelection {
        const colors = selector.elem.length % 3 == 0 ?
            tinycolor(DefaultTriad[i % DefaultTriad.length]).triad() :
            (selector.elem.length <= 2 ?
                tinycolor(DefaultSplitComplement[i % DefaultSplitComplement.length]).splitcomplement() :
                tinycolor(DefaultTetrad[i % DefaultTetrad.length]).tetrad());

        return {
            selector,
            color: colors[i % colors.length]
        };
    }

}

 // "#eeeeaa"
 // "#aaeeee"
 // "#eeaaee"
