import React, { FunctionComponent, useEffect, useState } from 'react'
import styled from "styled-components";
import { SelectorHierarchyServiceInterface } from "../services/selector-hierarchy";
import { SelectorHierarchy } from "../services/selector-hierarchy";
import { ColorGeneratorServiceInterface, ColorSelection, HtmlElement, HtmlSelection, SizeFunctions, SizeProperties } from "../services/selector-hierarchy";
import { ForThoustPanel } from "../services/selector-hierarchy";
import { SelectorsDefaultFactory } from "../models/defaults";
import { Button } from "@mui/material";
import ReactDOM from "react-dom";
import getSelector from "../util/generate-selector";
import { isVisible } from "../util/util";

type SelectorHierarchyMountProps = {
    doc: Document,
    visible: boolean
}

const SelectorHierarchyMount = styled.div`
  display: ${(props: SelectorHierarchyMountProps) => props.visible ? "block" : "none"};
  position: absolute;
  margin: 0;
  padding: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: ${(props: SelectorHierarchyMountProps) => props.doc.documentElement.scrollHeight} px;
  
  .selector-hierarchy-mount-container {
    display: inline-block; 
    margin: 0;
    padding: 0; 
    width: 100%; 
    height: 100%;
  }
`

const SelectorButton = styled(Button)`
    border: none;
    background: none;
`;

/**
 * we may need to use 4 enclosing panels, reused
 * alternatively, we can cover with largest common denominator for given selector in the current panel
 * so only the current selection of textual elements will show up
 * [g ][g ][g ][- ]
 * [- ][g ][- ][- ]
 * =============
 * |[(-)][g ][b ]|[b ]
 * |[g ][g ][g ]|[c ]
 * |[x ][g ][c ]|[c ]
 * |[- ][g ][c ]|[c ]
 * =============
 * [g ][g ][g ][c ]
 * [- ][g ][c ][c ]
 * [- ][g ][c ][c ]
 * [g ][g ][g ][- ]
 * [- ][g ][- ][- ]
 * [- ][g ][- ][- ]
 *
 * start at the top level, hierarchy root[]
 * LCD selector above 20 px square
 * triads / quads base on divisible by 3 or 4, offset by split complement, or some such, choose defaults from palleton
 * once the user clicks one of the color swatches, we use that as the primary selector and dim (lower contrast) the other ones,
 * inside the selected, we display any for negation or addition
 * hovering over a dim swatch should show the color full contrast
 * bin packing problem for sizes of split
 * [s,t,a] = different textual elements
 * order = z-index from neighbor count
 * .     .      .     .      .     .
 *  s8t9a4    s8t9a4    s8t9     s8t9    a1    |
a:  s2t1a3    s2t1a3    s2t1
#   .6,1,.2  .6,1,.2    .6,1    .6,1     1
 * .    .       .     .     .      .
 *   s8t9    s8t9a4   s8t9a4     s8t9    t9   |
 * .     .     .     .     .      .
 *                                 |
 * .    .     .     .      .      .
 *                                 |
 * .    .     .     .      .      .
 *
 * not including an element in the current selection shoud lower the alpha by .2 or something
 * a listing of the selector with currently included elements should appear in a popover at the top right with a button
 *   to complete
 */

// const Mask = styled.svg`
//   mouse-events: none;
//
// `
// const Cover = styled.svg`
//   mouse-events: none;
// `

export type HierarchySelectorComponentProps = {
    selectorHierarchyService: SelectorHierarchyServiceInterface,
    currentSelector: string,
    onConfirmSelector: { (selector: string): void }
    passSetSelector: { (modifier: { (selector: string): void }): void },
    doc: Document
}

interface ColorSelectorPanelInterface {
    element: HtmlElement;
    color: Hex; //color.toHexString() from tinycolor.Instance;
}

type Hex = string;
class ColorSelectorPanel implements ColorSelectorPanelInterface {
    element: HtmlElement;
    color: Hex; //color.toHexString() from tinycolor.Instance;

    constructor(element: HtmlElement, color: Hex) {
        this.element = element;
        this.color = color;
    }
}

// find selectable text, and copy structural elements entirely pruning branches
//   use provided selector and default text selectors to select each available branch
//   it may be easier to just replicate each feature allowing for duplicates

const REFRESH_CORNERS = [
  { style: { top: 10, left: 10 }, key: 'tl' },
  { style: { top: 10, right: 10 }, key: 'tr' },
  { style: { bottom: 10, left: 10 }, key: 'bl' },
  { style: { bottom: 10, right: 10 }, key: 'br' },
];

const isMainElement = (el: HTMLElement) => {
  if (!el.offsetParent || !isVisible(el)) return false;
  const rect = el.getBoundingClientRect();
  const docWidth = window.innerWidth;
  const docHeight = document.documentElement.scrollHeight;

  // Exclude elements that are nearly the full page
  const isNearlyFullWidth = rect.width > 0.98 * docWidth;
  const isNearlyFullHeight = rect.height > 0.95 * docHeight;
  if (isNearlyFullWidth && isNearlyFullHeight) return false;

  // Exclude <body>, <html>, and elements with no content
  if (["BODY", "HTML"].includes(el.tagName)) return false;
  if (rect.width < 20 || rect.height < 10) return false;

  // Much less restrictive - allow most elements
  // Only exclude obvious non-content elements
  const excludedTags = ["SCRIPT", "STYLE", "NOSCRIPT", "META", "LINK", "TITLE"];
  if (excludedTags.includes(el.tagName)) return false;

  // Allow small, full-width elements (e.g., headers, navigation)
  const isSmall = rect.height < 150;
  if (isNearlyFullWidth && isSmall) return true;

  // Allow most elements, just exclude very deeply nested ones
  const parent = el.parentElement;
  if (parent && parent !== document.body && parent.offsetParent) {
    const parentRect = parent.getBoundingClientRect();
    // Only exclude if this element is almost the same size as its parent
    if (parentRect.width - rect.width < 5 && parentRect.height - rect.height < 5) {
      return false;
    }
  }

  return true;
};

const HierarchySelectorComponent: FunctionComponent<HierarchySelectorComponentProps> = ({
    selectorHierarchyService = new SelectorHierarchy({ } as unknown as ColorGeneratorServiceInterface),
    currentSelector,
    onConfirmSelector,
    passSetSelector,
    doc = document
}) => {
    const [selector, setSelector] = useState(currentSelector);
    const [latestSelector, setLatestSelector] = useState<HtmlSelection | undefined>(undefined);
    const [activeSelectorColorPanels, setActiveSelectorColorPanels] = useState<ColorSelectorPanel[]>([])
    const [htmlHierarchy] = useState(doc);
    const [dimmedPanels, setDimmedPanels] = useState<ColorSelection[]>([])
    const [confirmed, setConfirmed] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0);

    // ;const [brambles] = useWilliamTate();
    // 'const [someDafadilTypeShiz] = ['#eea']

    const updateThoustPanels = () => {
        // Find main elements for overlays
        const allElements = Array.from(doc.querySelectorAll("body *"));
        const mainElements = allElements.filter(el => isMainElement(el as HTMLElement));
        // Use ForThoustPanel for color logic, but override the elements
        const selection = ForThoustPanel(htmlHierarchy, selector || SelectorsDefaultFactory()[0], selectorHierarchyService);
        setLatestSelector(selection)
        // Only use panels for main elements
        const activePanels = [...selection.htmlSelectors.values()].flatMap(s =>
            s.selector.elem.filter(e => mainElements.includes(e)).map(e => new ColorSelectorPanel(e, s.color.toHexString()))
        );
        
        // Sort active panels by z-index (ascending)
        const sortedActivePanels = activePanels.sort((a, b) => {
            const zIndexA = parseInt(window.getComputedStyle(a.element).zIndex) || 0;
            const zIndexB = parseInt(window.getComputedStyle(b.element).zIndex) || 0;
            console.log(`🌊 Sorting active panels: ${a.element.tagName} (z-index: ${zIndexA}) vs ${b.element.tagName} (z-index: ${zIndexB})`);
            return zIndexA - zIndexB;
        });
        
        setActiveSelectorColorPanels(sortedActivePanels)
        
        // Get dimmed panels and sort them by z-index too
        const dimmedPanelSelectors = selectorHierarchyService.getDimmedPanelSelectors(htmlHierarchy, activePanels.map(s => s.element));
        const dimmedPanelsArray = [...dimmedPanelSelectors.htmlSelectors.values()];
        
        // Sort dimmed panels by z-index (ascending)
        const sortedDimmedPanels = dimmedPanelsArray.sort((a, b) => {
            const zIndexA = parseInt(window.getComputedStyle(a.selector.elem[0]).zIndex) || 0;
            const zIndexB = parseInt(window.getComputedStyle(b.selector.elem[0]).zIndex) || 0;
            console.log(`🌊 Sorting dimmed panels: ${a.selector.elem[0].tagName} (z-index: ${zIndexA}) vs ${b.selector.elem[0].tagName} (z-index: ${zIndexB})`);
            return zIndexA - zIndexB;
        });
        
        setDimmedPanels(sortedDimmedPanels);
    }

    useEffect(() => {
        passSetSelector(setSelector)
        updateThoustPanels()
    }, [refreshKey])

    useEffect(() => {
        updateThoustPanels()
    }, [selector])

    const refreshPanels = () => setRefreshKey(k => k + 1);

    const addPanelIslandClicked = (element: HtmlElement) => {
        // Find the panel selector that contains this element
        const panelSelector = [...(latestSelector?.htmlSelectors?.keys() || [])].find(selector => 
            selector.elem.find(e => e === element)
        );

        if (panelSelector) {
            // Get the CSS selector for this element
            const elementSelector = getSelector(element);
            const currentSelector = selector || "";
            let newSelector = "";
            
            if (currentSelector && elementSelector) {
                newSelector = currentSelector + ", " + elementSelector;
            } else if (elementSelector) {
                newSelector = elementSelector;
            }
            
            // Update the selector string
            setSelector(newSelector);
            
            // Automatically apply the selector to start animation
            if (newSelector) {
                onConfirmSelector(newSelector);
            }
        }
    }

    const removePanelIslandClicked = (element: HtmlElement) => {
        // Remove the panel from active panels
        setActiveSelectorColorPanels(prev => prev.filter(panel => panel.element !== element));
        
        // Update the selector by removing the specific element's selector
        if (selector) {
            const elementSelector = getSelector(element);
            const selectorParts = selector.split(",").map(s => s.trim());
            const filteredParts = selectorParts.filter(part => 
                part !== elementSelector && part !== ""
            );
            const newSelector = filteredParts.join(", ");
            setSelector(newSelector);
            
            // Automatically apply the updated selector
            if (newSelector) {
                onConfirmSelector(newSelector);
            }
        }
    }

    const confirmSelector = (selector: string) => {
        console.log("🌊 Selector confirmed:", selector);
        setConfirmed(true);
        onConfirmSelector(selector);
    }

    return (
        <SelectorHierarchyMount doc={doc} visible={!confirmed} style={{ pointerEvents: 'none' }}>
            <div className={"selector-hierarchy-mount-container"} style={{ pointerEvents: 'none' }}>
                {/* Refresh buttons at corners */}
                {REFRESH_CORNERS.map(corner => (
                  <button
                    key={corner.key}
                    style={{ position: 'fixed', zIndex: 10000, ...corner.style, pointerEvents: 'auto', background: '#fff8', border: '1px solid #ccc', borderRadius: 8, padding: 4, margin: 4 }}
                    onClick={refreshPanels}
                  >⟳</button>
                ))}
                {/* Overlay panes for selectable elements */}
                {dimmedPanels.map((panel: ColorSelection, i: number) =>
                  panel.selector.elem.map((element: HtmlElement) => (
                    <div
                      key={`dimmed-${i}-${element}`}
                      style={{
                        position: 'absolute',
                        left: element.getBoundingClientRect().left + window.scrollX,
                        top: element.getBoundingClientRect().top + window.scrollY,
                        width: element.getBoundingClientRect().width,
                        height: element.getBoundingClientRect().height,
                        background: panel.color.setAlpha(0.25).toRgbString(),
                        border: '2px dashed #888',
                        zIndex: 9998,
                        pointerEvents: 'auto',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'box-shadow 0.2s',
                      }}
                    >
                      <SelectorButton
                        style={{ pointerEvents: 'auto', background: '#333', color: '#eee', borderRadius: 4, fontSize: 18 }}
                        onClick={() => addPanelIslandClicked(element)}
                      >+</SelectorButton>
                    </div>
                  ))
                )}
                {activeSelectorColorPanels.map((panel: ColorSelectorPanel, i: number) => (
                  <div
                    key={`active-${i}-${panel.element}`}
                    style={{
                      position: 'absolute',
                      left: panel.element.getBoundingClientRect().left + window.scrollX,
                      top: panel.element.getBoundingClientRect().top + window.scrollY,
                      width: panel.element.getBoundingClientRect().width,
                      height: panel.element.getBoundingClientRect().height,
                      background: panel.color,
                      border: '3px solid #005AE9',
                      zIndex: 9999,
                      pointerEvents: 'auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      boxShadow: '0 0 8px #005AE9',
                      transition: 'box-shadow 0.2s',
                    }}
                  >
                    <SelectorButton
                      style={{ pointerEvents: 'auto', background: '#005AE9', color: '#fff', borderRadius: 4, fontSize: 18 }}
                      onClick={() => removePanelIslandClicked(panel.element)}
                    >-</SelectorButton>
                  </div>
                ))}
                {/* Docked control panel */}
                <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 16, pointerEvents: 'auto', minWidth: 240 }}>
                  <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Selector Mode</div>
                  <div style={{ marginBottom: 8, fontSize: 12, color: '#333' }}>Click + to add, - to remove. Click ⟳ to refresh.</div>
                  <div style={{ marginBottom: 8, fontSize: 12, color: '#005AE9', wordBreak: 'break-all' }}>{selector}</div>
                  <input type={"button"} value={"Confirm"} onClick={() => confirmSelector(selector)} style={{ marginRight: 8 }} />
                  <input type={"button"} value={"Deactivate Selector Mode"} onClick={() => setConfirmed(true)} />
                </div>
            </div>
        </SelectorHierarchyMount>
    )
}

type MountOrFindSelectorHierarchyComponentProps = {
    service: SelectorHierarchyServiceInterface,
    selector: string,
    passSetSelector: { (modifier: (selector: string) => void): void },
    onConfirmSelector: { (selector: string): void },
    doc: Document,
    renderFunction: { (mount: Element, component: React.ReactNode): void }
}
type MountFunction = { (props: MountOrFindSelectorHierarchyComponentProps): Element }
export const MountOrFindSelectorHierarchyComponent: MountFunction = ({
    service,
    selector,
    passSetSelector,
    onConfirmSelector,
    doc = document,
    renderFunction = (mount: Element, component: React.ReactNode) => {
        // todo: :( @types/react-dom should allow React.ReactNode to interpret as all sorts of types like Element, but nope
        // @ts-ignore
        ReactDOM.createRoot(mount).render(component)
    }
}): Element => {
    let mount = doc.querySelector("#wave-reader-component-mount") as HTMLElement;

    // todo: we seem to be calling this for each frame, which is super, but we'll probably want some sort of iframe id registry


    if (mount) {
        console.log("reinitializing selector-hierarchy mount")
        mount.remove();
    }

    mount = doc.createElement("div");

    mount.style.display = "block";
    mount.style.position = "absolute";
    mount.style.margin = "0";
    mount.style.padding = "0";
    mount.style.left = "0";
    mount.style.top = "0";
    mount.style.width = "100%";
    mount.style.height = doc.documentElement.scrollHeight + "px";

    mount.setAttribute("id", "wave-reader-component-mount")
    doc.querySelector("body")?.appendChild(mount)

    renderFunction(mount, <HierarchySelectorComponent
        selectorHierarchyService={service}
        currentSelector={selector}
        passSetSelector={passSetSelector}
        onConfirmSelector={onConfirmSelector}
        doc={doc}
    />)

    return mount;
}

export default HierarchySelectorComponent;
