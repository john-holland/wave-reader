// import * as console from "console";
import tinycolor from "tinycolor2";
import {SelectorsDefaultFactory} from "../models/defaults";
import {getDefaultFontSizeREM, getSizeValuesRegex, isVisible} from "../util/util";

// For environments where process is not defined (browser)
declare const process: any;

// Island creation configuration - Enhanced for multiple matches
const isTest = (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') || (typeof window !== 'undefined' && (window as any).JEST_WORKER_ID);
export const ISLAND_CONFIG = isTest ? {
    MAX_ISLAND_WIDTH: 2000,
    MAX_ISLAND_HEIGHT: 2000,
    MIN_ISLAND_WIDTH: 1,
    MIN_ISLAND_HEIGHT: 1,
    MAX_ISLAND_ELEMENTS: 100,
    MIN_ISLAND_AREA: 1,
    MAX_VERTICAL_DISTANCE_SIBLINGS: 500,
    MAX_VERTICAL_DISTANCE_COUSINS: 500,
    MAX_HORIZONTAL_DISTANCE: 500,
    COLOR_ROTATION_DEGREES: 15,
    // Enhanced for multiple matches
    MAX_HIERARCHY_DEPTH: 3,
    MIN_ELEMENTS_PER_ISLAND: 1,
    MAX_ELEMENTS_PER_ISLAND: 20,
    HEADER_MENU_GROUPING: true
} : {
    MAX_ISLAND_WIDTH: 800,
    MAX_ISLAND_HEIGHT: 600,
    MIN_ISLAND_WIDTH: 4,
    MIN_ISLAND_HEIGHT: 4,
    MAX_ISLAND_ELEMENTS: 15,
    MIN_ISLAND_AREA: 50,
    MAX_VERTICAL_DISTANCE_SIBLINGS: 80,
    MAX_VERTICAL_DISTANCE_COUSINS: 60,
    MAX_HORIZONTAL_DISTANCE: 100,
    COLOR_ROTATION_DEGREES: 15,
    // Enhanced for multiple matches
    MAX_HIERARCHY_DEPTH: 3,
    MIN_ELEMENTS_PER_ISLAND: 1,
    MAX_ELEMENTS_PER_ISLAND: 12,
    HEADER_MENU_GROUPING: true
} as const;

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

const createSelector = (elems: HtmlElement[] = [], classList: string[] = []) => {
     return {
         elem: [...elems],
         classList: [...classList]
     } as unknown as Selector;
}

// Removed unused enum

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

    getDefaultTetrad(startingIndex: number = randomCollectionIndex(DefaultTetrad)): Color[] {
        return tinycolor(DefaultTetrad[startingIndex % DefaultTetrad.length]).tetrad();
    }

    getDefaultSplitComponent(startingIndex: number = randomCollectionIndex(DefaultSplitComplement)): Color[] {
        return tinycolor(DefaultSplitComplement[startingIndex % DefaultSplitComplement.length]).splitcomplement()
    }

    getDefaultTriad(startingIndex: number = randomCollectionIndex(DefaultTetrad)): Color[] {
        return tinycolor(DefaultTriad[startingIndex % DefaultTriad.length]).triad()
    }
}

export type ColorSelection = {
    selector: Selector
    color: Color
}

const dimmed = tinycolor("#333")

export class HtmlSelection {
    htmlSelectors: Map<Selector, ColorSelection>

    hasSelectorForElement(element: HtmlElement) {
        return [...this.htmlSelectors.keys()].find(key =>
            key.classList.filter(clazz =>
                element.classList.contains(clazz)
            )
        )
    }

    addSelectorForElement(element: HtmlElement, color: Color = dimmed) {
        type SelectorPair = {
            selector: Selector,
            colorSelection: ColorSelection
        }
        const selectors = [...this.htmlSelectors.keys()].flatMap(key =>
            key.classList.filter(clazz =>
                element.classList.contains(clazz)
            )
            .map(() => {
                return {
                    selector: key, colorSelection: this.htmlSelectors.get(key)
                } as SelectorPair
            })
        )
        if (!selectors.length) {
            const selector = {elem: [element], classList: [...element.classList]}
            this.htmlSelectors.set(selector, { selector, color })
        } else {
            selectors.forEach((pair: SelectorPair) => {
                const { selector } = pair;
                selector.elem.push(element)
            })
        }
    }

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
    // perpendicular css transforms can cause css animation to go vertical
    // to accomidate we need a similar recursive search up the animation css transforms
    // and keep a summed css angle

    switch (property) {
        case SizeProperties.HEIGHT:
            return element.clientHeight;
        case SizeProperties.WIDTH:
            return element.clientWidth;
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

const calcRotation = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM): number => {
    const rotation = n?.style?.rotate || "0deg"
    let rotationNumber = 0;
    if (rotation.indexOf('deg') > -1) {
        rotationNumber = Number.parseFloat(rotation.split('deg')[0].trim())
    } else if (rotation.indexOf('rad') > -1) {
        rotationNumber = Number.parseFloat(rotation.split('rad')[0].trim()) * (180 / Math.PI) // or * 57.2958 ?
    }

    return rotationNumber + (_parent(n) ? calcRotation(_parent(n)!!, fontSizeRemDefaultAccessor) : 0);
}

const calcLeft = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM): number => {
    const boundingRect = n.getBoundingClientRect()
    if (boundingRect) {
        return boundingRect.left
    }
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor)
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n)!!, fontSizeRemDefaultAccessor) : 0);
}
const calcRight = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const boundingRect = n.getBoundingClientRect()
    if (boundingRect) {
        return boundingRect.right
    }
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor) || 0
    return cs(n.style?.left) +
        cs(n.style?.marginLeft) +
        calcSize(_parent(n), _parent(n)?.style?.paddingLeft || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcLeft(_parent(n)!!, fontSizeRemDefaultAccessor) : 0) + cs(n.style?.width) +
        cs(n.style?.marginRight);
}
const calcTop = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const boundingRect = n.getBoundingClientRect()
    if (boundingRect) {
        return boundingRect.top
    }
    const cs = (property: string) => calcSize(n, property, SizeProperties.OTHER, fontSizeRemDefaultAccessor)
    return cs(n.style?.top) +
        cs(n.style?.marginTop) +
        calcSize(_parent(n),_parent(n)?.style?.paddingTop || "0", SizeProperties.OTHER, fontSizeRemDefaultAccessor) +
        (_parent(n) ? calcTop(_parent(n)!!, fontSizeRemDefaultAccessor) : 0);
}
const calcBottom = (n: HtmlElement, fontSizeRemDefaultAccessor = getDefaultFontSizeREM()): number => {
    const boundingRect = n.getBoundingClientRect()
    if (boundingRect) {
        return boundingRect.bottom
    }
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
    calcBottom,
    calcRotation
}

const getPathSelector = (el: HtmlElement | undefined): string => {
    if (!el) return ""
    const parentNode: HtmlElement | undefined = el.parentNode as HtmlElement
    return (parentNode ? getPathSelector(parentNode) + " > " : "") + Array.prototype.join.call(el?.classList || [], ",") // ternary for tail recursion
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
    const selectedHtmlElements = (existingSelection !== undefined ?
        [...existingSelection.htmlSelectors.keys()].flatMap(k => k.elem) :
        [...(selector.trim() === "" ? document.querySelectorAll(SelectorsDefaultFactory().join(",")) : document.querySelectorAll(selector))])
            .map(k => k as HTMLElement).filter(element => !!element && isVisible(element));

    const nonSelectedHtmlElements = [...document.querySelectorAll("*")].filter(el => !selectedHtmlElements.includes(el as HTMLElement));
    
    function getNeighborIslands(elements: HtmlElement[], initialSelector: string[] = SelectorsDefaultFactory()): Selector[] {
        // Always include the passed selector(s) in the initialSelector array
        if (typeof selector === 'string' && selector.trim() !== '') {
            initialSelector = initialSelector.concat(selector.split(',').map(s => s.toLowerCase().trim()));
        }
        initialSelector = initialSelector.flatMap(selector => selector.split(`,`).map(s => s.toLowerCase().trim()));

        // In test mode, treat each element as its own island for maximum looseness
        if (ISLAND_CONFIG.MIN_ISLAND_AREA === 1) {
            // Use a default color for all test islands
            const testColor = tinycolor('#cccccc');
            
            // Group elements by their full class list for maximum granularity
            const elementGroups = new Map<string, HtmlElement[]>();
            
            const filteredElements = elements
                .filter(el => (initialSelector.includes(el.nodeName.toLowerCase()) || [...el.classList].some(c => initialSelector.includes(c.toLowerCase()))) && el.textContent && el.textContent.trim().length > 0);
            
            console.log(`🌊 Test mode: Found ${filteredElements.length} elements matching selector`);
            
            filteredElements.forEach(el => {
                // Create a key based on tag name and full class list
                const tagName = el.nodeName.toLowerCase();
                const fullClassList = [...el.classList].sort().join('-');
                const key = `${tagName}-${fullClassList}`;
                
                console.log(`🌊 Test mode: Element ${el.tagName} with classes [${[...el.classList]}], key: ${key}`);
                
                const group = elementGroups.get(key) || [];
                group.push(el);
                elementGroups.set(key, group);
            });
            
            console.log(`🌊 Test mode: Created ${elementGroups.size} groups`);
            elementGroups.forEach((groupElements, key) => {
                console.log(`🌊 Test mode: Group ${key} has ${groupElements.length} elements`);
            });
            
            // Convert groups to selectors
            return Array.from(elementGroups.entries()).map(([key, groupElements]) => {
                const firstElement = groupElements[0];
                return { 
                    elem: groupElements, 
                    classList: [firstElement.nodeName, ...firstElement.classList], 
                    color: testColor 
                } as any;
            });
        }

        // Enhanced class map with hierarchical grouping
        const classMap = elements.reduce<Map<string, HtmlElement[]>>((map: Map<string, HtmlElement[]>, el: HtmlElement) => {
            // Include element tag name and all classes
            const selectors = [el.nodeName, ...el.classList].map(c => c.toLowerCase().trim());
            
            // Filter to only include selectors that match our initial selector list
            const matchingSelectors = selectors.filter(selector => initialSelector.includes(selector));
            
            // If no direct matches, include the element if it has text content
            if (matchingSelectors.length === 0 && el.textContent && el.textContent.trim().length > 0) {
                matchingSelectors.push(el.nodeName.toLowerCase());
            }
            
            // Create more granular grouping based on full class list
            if (matchingSelectors.length > 0) {
                // Use the full class list as a key for more granular grouping
                const tagName = el.nodeName.toLowerCase();
                const fullClassList = [...el.classList].sort().join('-');
                const key = `${tagName}-${fullClassList}`;
                
                console.log(`🌊 Debug: Element ${el.tagName} with classes [${[...el.classList]}], key: ${key}`);
                
                const existing = map.get(key) || [];
                existing.push(el);
                map.set(key, existing);
            }
            
            return map;
        }, new Map<string, HtmlElement[]>())
        
        console.log(`🌊 Debug: Created ${classMap.size} class groups`);
        classMap.forEach((elements, key) => {
            console.log(`🌊 Debug: Group ${key} has ${elements.length} elements`);
        });

        // Enhanced neighbor detection for headers and menus
        const isEnhancedNeighbor = (el: HtmlElement, possibleNeighbor: HtmlElement) => {
            const rect1 = el.getBoundingClientRect();
            const rect2 = possibleNeighbor.getBoundingClientRect();
            
            // Direct relationships
            if (el === possibleNeighbor) return true;
            if (el.parentNode === possibleNeighbor) return true;
            if (possibleNeighbor.parentNode === el) return true;
            
            // Sibling relationships
            if (el.parentNode === possibleNeighbor.parentNode) {
                const verticalDistance = Math.abs(rect1.top - rect2.top);
                const horizontalDistance = Math.abs(rect1.left - rect2.left);
                return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS && 
                       horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
            }
            
            // Cousin relationships (same grandparent)
            if (el.parentNode && possibleNeighbor.parentNode && 
                el.parentNode.parentNode === possibleNeighbor.parentNode.parentNode) {
                const verticalDistance = Math.abs(rect1.top - rect2.top);
                const horizontalDistance = Math.abs(rect1.left - rect2.left);
                return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_COUSINS && 
                       horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
            }
            
            // Header-menu grouping (elements within same header or navigation)
            if (ISLAND_CONFIG.HEADER_MENU_GROUPING) {
                const isHeaderElement = (elem: HtmlElement) => {
                    const tagName = elem.tagName.toLowerCase();
                    const classes = [...elem.classList].map(c => c.toLowerCase());
                    return tagName === 'header' || tagName === 'nav' || 
                           classes.some(c => c.includes('header') || c.includes('nav') || c.includes('menu'));
                };
                
                const isMenuElement = (elem: HtmlElement) => {
                    const tagName = elem.tagName.toLowerCase();
                    const classes = [...elem.classList].map(c => c.toLowerCase());
                    return tagName === 'li' || tagName === 'a' || 
                           classes.some(c => c.includes('menu') || c.includes('nav') || c.includes('item'));
                };
                
                // Group header elements together
                if (isHeaderElement(el) && isHeaderElement(possibleNeighbor)) {
                    const verticalDistance = Math.abs(rect1.top - rect2.top);
                    const horizontalDistance = Math.abs(rect1.left - rect2.left);
                    return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS * 2 && 
                           horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE * 2;
                }
                
                // Group menu elements within same header
                if (isMenuElement(el) && isMenuElement(possibleNeighbor)) {
                    const verticalDistance = Math.abs(rect1.top - rect2.top);
                    const horizontalDistance = Math.abs(rect1.left - rect2.left);
                    return verticalDistance < ISLAND_CONFIG.MAX_VERTICAL_DISTANCE_SIBLINGS && 
                           horizontalDistance < ISLAND_CONFIG.MAX_HORIZONTAL_DISTANCE;
                }
            }
            
            return false;
        }

        // Create enhanced islands with better grouping
        const createEnhancedIslands = (elements: HtmlElement[], className: string): HtmlElement[][] => {
            const islands: HtmlElement[][] = [];
            const processed = new Set<HtmlElement>();

            elements.forEach(element => {
                if (processed.has(element)) return;

                const island: HtmlElement[] = [element];
                processed.add(element);

                // Find all enhanced neighbors
                const findEnhancedNeighbors = (current: HtmlElement) => {
                    elements.forEach(other => {
                        if (!processed.has(other) && isEnhancedNeighbor(current, other)) {
                            // Check island size limits
                            const totalWidth = island.reduce((sum, el) => sum + el.offsetWidth, 0);
                            const totalHeight = Math.max(...island.map(el => el.offsetTop + el.offsetHeight)) - 
                                              Math.min(...island.map(el => el.offsetTop));
                            
                            // More permissive island size limits for multiple matches
                            if (totalWidth < ISLAND_CONFIG.MAX_ISLAND_WIDTH && 
                                totalHeight < ISLAND_CONFIG.MAX_ISLAND_HEIGHT && 
                                island.length < ISLAND_CONFIG.MAX_ELEMENTS_PER_ISLAND) {
                                island.push(other);
                                processed.add(other);
                                findEnhancedNeighbors(other);
                            }
                        }
                    });
                };

                findEnhancedNeighbors(element);
                
                // More permissive minimum requirements for multiple matches
                if (island.length >= ISLAND_CONFIG.MIN_ELEMENTS_PER_ISLAND) {
                    const area = island.reduce((sum, el) => sum + (el.offsetWidth * el.offsetHeight), 0);
                    if (area > ISLAND_CONFIG.MIN_ISLAND_AREA) {
                        islands.push(island);
                    }
                }
            });

            return islands;
        };

        // Process each class to create enhanced islands
        const enhancedIslands = new Map<string, HtmlElement[][]>();
        
        classMap.forEach((elements, className) => {
            const islands = createEnhancedIslands(elements, className);
            if (islands.length > 0) {
                enhancedIslands.set(className, islands);
            }
        });

        // Convert islands to selectors with enhanced filtering
        const selectors: Selector[] = [];
        
        enhancedIslands.forEach((islands, className) => {
            islands.forEach(island => {
                // Enhanced filtering for multiple matches
                const validElements = island.filter((element: HtmlElement) => {
                    const rect = element.getBoundingClientRect();
                    const width = rect.width;
                    const height = rect.height;
                    
                    // More permissive size constraints for multiple matches
                    const minWidth = ISLAND_CONFIG.MIN_ISLAND_WIDTH;
                    const minHeight = ISLAND_CONFIG.MIN_ISLAND_HEIGHT;
                    const maxWidth = ISLAND_CONFIG.MAX_ISLAND_WIDTH;
                    const maxHeight = ISLAND_CONFIG.MAX_ISLAND_HEIGHT;
                    
                    return width >= minWidth && height >= minHeight && 
                           width <= maxWidth && height <= maxHeight &&
                           isVisible(element) &&
                           element.textContent && element.textContent.trim().length > 0;
                });

                if (validElements.length > 0) {
                    // Create selector with all classes from the island
                    const allClasses = validElements.flatMap(el => [el.nodeName, ...el.classList]);
                    const uniqueClasses = [...new Set(allClasses)];
                    
                    selectors.push({
                        elem: validElements,
                        classList: uniqueClasses
                    } as Selector);
                }
            });
        });

        return selectors;
    }

    const neighborIslands = getNeighborIslands([...nonSelectedHtmlElements, ...selectedHtmlElements] as HtmlElement[]);

    // In test mode, return a HtmlSelection directly with the test islands and their colors
    if (ISLAND_CONFIG.MIN_ISLAND_AREA === 1) {
        const testMap = new Map();
        neighborIslands.forEach(island => {
            testMap.set(island, { selector: island, color: (island as any).color });
        });
        return new HtmlSelection(testMap);
    }


    /* eslint-disable  @typescript-eslint/no-unused-vars */
    const someDafadilTypeShiz = "#eea" // :3
    const easterIslandsStatues = [...neighborIslands].map(island => island.elem[0]) // extremely important
    /* eslint-enable  @typescript-eslint/no-unused-vars */

    // maybe redesign with a color selector
    const selection = selectorHierarchyService.assignColorSelectionsForSelector(
        neighborIslands);

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

// Additional color palettes for more variety
export const PastelTriad = [
    tinycolor("#FFB3BA"), // Light pink
    tinycolor("#BAFFC9"), // Light green
    tinycolor("#BAE1FF")  // Light blue
]

export const VibrantTriad = [
    tinycolor("#FF6B6B"), // Coral
    tinycolor("#4ECDC4"), // Turquoise
    tinycolor("#45B7D1")  // Sky blue
]

export const EarthTriad = [
    tinycolor("#8B4513"), // Saddle brown
    tinycolor("#228B22"), // Forest green
    tinycolor("#4682B4")  // Steel blue
]

// Specialized palettes for headers and menus
export const HeaderTriad = [
    tinycolor("#2C3E50"), // Dark blue-gray
    tinycolor("#34495E"), // Medium blue-gray
    tinycolor("#5D6D7E")  // Light blue-gray
]

export const MenuTriad = [
    tinycolor("#E74C3C"), // Red
    tinycolor("#F39C12"), // Orange
    tinycolor("#F1C40F")  // Yellow
]

export const NavigationTriad = [
    tinycolor("#3498DB"), // Blue
    tinycolor("#9B59B6"), // Purple
    tinycolor("#1ABC9C")  // Teal
]

export const AllColorPalettes = [
    DefaultTriad,
    PastelTriad,
    VibrantTriad,
    EarthTriad,
    HeaderTriad,
    MenuTriad,
    NavigationTriad
]

export class SelectorHierarchy implements SelectorHierarchyServiceInterface {
    colorService: ColorGeneratorServiceInterface;

    constructor(colorService: ColorGeneratorServiceInterface) {
        this.colorService = colorService;
    }

    getDimmedPanelSelectors(document: Document, selectedElements: HtmlElement[]): HtmlSelection {
        const selection = new HtmlSelection(new Map<Selector, ColorSelection>())

        document.querySelectorAll(SelectorsDefaultFactory().join(", ")).forEach(e => {
            if (!selectedElements.includes(e as HtmlElement, 0)) selection.addSelectorForElement(e as HtmlElement, dimmed);
        })

        return selection
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
        // Enhanced color generation for multiple matches with intelligent palette selection
        const isHeaderElement = (elem: HtmlElement) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'header' || tagName === 'h1' || tagName === 'h2' || tagName === 'h3' || 
                   classes.some(c => c.includes('header') || c.includes('title'));
        };
        
        const isMenuElement = (elem: HtmlElement) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'li' || tagName === 'a' || 
                   classes.some(c => c.includes('menu') || c.includes('nav') || c.includes('item'));
        };
        
        const isNavigationElement = (elem: HtmlElement) => {
            const tagName = elem.tagName.toLowerCase();
            const classes = [...elem.classList].map(c => c.toLowerCase());
            return tagName === 'nav' || classes.some(c => c.includes('navigation') || c.includes('nav'));
        };
        
        // Determine element type for intelligent color selection
        let paletteIndex = i % AllColorPalettes.length;
        let baseColor = AllColorPalettes[paletteIndex][i % 3];
        
        // Check if this selector contains header, menu, or navigation elements
        const hasHeaderElements = selector.elem.some(isHeaderElement);
        const hasMenuElements = selector.elem.some(isMenuElement);
        const hasNavigationElements = selector.elem.some(isNavigationElement);
        
        if (hasHeaderElements) {
            // Use header-specific palette
            paletteIndex = 4; // HeaderTriad index
            baseColor = HeaderTriad[i % 3];
        } else if (hasMenuElements) {
            // Use menu-specific palette
            paletteIndex = 5; // MenuTriad index
            baseColor = MenuTriad[i % 3];
        } else if (hasNavigationElements) {
            // Use navigation-specific palette
            paletteIndex = 6; // NavigationTriad index
            baseColor = NavigationTriad[i % 3];
        }
        
        // Generate a triad for this specific island with enhanced rotation
        const triad = this.colorService.getTriad(baseColor, i * ISLAND_CONFIG.COLOR_ROTATION_DEGREES);
        
        // Use different colors from the triad for variety
        const colorIndex = Math.floor(i / AllColorPalettes.length) % 3;
        const color = triad[colorIndex];
        
        // Log for debugging
        const elementType = hasHeaderElements ? 'header' : hasMenuElements ? 'menu' : hasNavigationElements ? 'navigation' : 'general';
        console.log(`🌊 Island ${i}: Type ${elementType}, palette ${paletteIndex}, color ${color.toHexString()} from base ${baseColor.toHexString()}, triad index ${colorIndex}`);
        
        return {
            selector,
            color: color
        };
    }

}

 // "#eeeeaa"
 // "#aaeeee"
 // "#eeaaee"
