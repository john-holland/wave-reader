import React, { FunctionComponent, useEffect, useState, useCallback, useMemo } from 'react'
import { SelectorHierarchyServiceInterface } from "../services/selector-hierarchy";
import { SelectorHierarchy } from "../services/selector-hierarchy";
import { ColorGeneratorServiceInterface, ColorSelection, HtmlElement, HtmlSelection } from "../services/selector-hierarchy";
import { ForThoustPanel } from "../services/selector-hierarchy";
import { SelectorsDefaultFactory } from "../models/defaults";
import ReactDOM from "react-dom/client";
import getSelector from "../util/generate-selector";
import { isVisible } from "../util/util";

type SelectorHierarchyMountProps = {
    doc: Document,
    visible: boolean,
    children?: React.ReactNode
}

// Replace styled-components with regular CSS-in-JS for Shadow DOM compatibility
const SelectorHierarchyMount: React.FC<SelectorHierarchyMountProps> = ({ doc, visible, children }) => {
    const style = {
        display: visible ? "block" : "none",
        position: "absolute" as const,
        margin: 0,
        padding: 0,
        left: 0,
        top: 0,
        width: "100%",
        height: `${doc.documentElement.scrollHeight}px`,
    };

    return (
        <div style={style}>
            <div className="selector-hierarchy-mount-container" style={{ 
                display: "inline-block", 
                margin: 0, 
                padding: 0, 
                width: "100%", 
                height: "100%" 
            }}>
                {children}
            </div>
        </div>
    );
};

// Replace styled Button with regular button for Shadow DOM compatibility
const SelectorButton: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = ({ children, ...props }) => {
    return (
        <button
            {...props}
            style={{
                border: "none",
                background: "none",
                ...props.style
            }}
        >
            {children}
        </button>
    );
};

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
    doc: Document,
    uiRoot: ShadowRoot
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
    const [error, setError] = useState<string | null>(null);

    // Memoize the main elements to avoid expensive re-computation
    const mainElements = useMemo(() => {
        try {
            const allElements = Array.from(doc.querySelectorAll("body *"));
            return allElements.filter(el => isMainElement(el as HTMLElement));
        } catch (error) {
            console.warn("Error getting main elements:", error);
            return [];
        }
    }, [doc, refreshKey]);

    // Memoize the selection to avoid unnecessary recalculations
    const selection = useMemo(() => {
        try {
            return ForThoustPanel(htmlHierarchy, selector || SelectorsDefaultFactory()[0], selectorHierarchyService);
        } catch (error) {
            console.warn("Error creating selection:", error);
            return undefined;
        }
    }, [htmlHierarchy, selector, selectorHierarchyService]);

    // Optimized panel update function
    const updateThoustPanels = useCallback(() => {
        try {
            if (!selection) return;
            
            setLatestSelector(selection);
            
            // Only use panels for main elements
            const activePanels = [...selection.htmlSelectors.values()].flatMap(s =>
                s.selector.elem.filter(e => mainElements.includes(e)).map(e => new ColorSelectorPanel(e, s.color.toHexString()))
            );
            
            // Sort active panels by z-index (ascending) - memoized
            const sortedActivePanels = activePanels.sort((a, b) => {
                try {
                    const zIndexA = parseInt(window.getComputedStyle(a.element).zIndex) || 0;
                    const zIndexB = parseInt(window.getComputedStyle(b.element).zIndex) || 0;
                    return zIndexA - zIndexB;
                } catch (error) {
                    console.warn("Error sorting panels:", error);
                    return 0;
                }
            });
            
            setActiveSelectorColorPanels(sortedActivePanels);
            
            // Get dimmed panels and sort them by z-index too
            try {
                const dimmedPanelSelectors = selectorHierarchyService.getDimmedPanelSelectors(htmlHierarchy, activePanels.map(s => s.element));
                const dimmedPanelsArray = [...dimmedPanelSelectors.htmlSelectors.values()];
                
                const sortedDimmedPanels = dimmedPanelsArray.sort((a, b) => {
                    try {
                        const zIndexA = parseInt(window.getComputedStyle(a.selector.elem[0]).zIndex) || 0;
                        const zIndexB = parseInt(window.getComputedStyle(b.selector.elem[0]).zIndex) || 0;
                        return zIndexA - zIndexB;
                    } catch (error) {
                        console.warn("Error sorting dimmed panels:", error);
                        return 0;
                    }
                });
                
                setDimmedPanels(sortedDimmedPanels);
            } catch (error) {
                console.warn("Error getting dimmed panels:", error);
                setDimmedPanels([]);
            }
        } catch (error) {
            console.error("Error in updateThoustPanels:", error);
            setError("Failed to update panels");
        }
    }, [selection, mainElements, selectorHierarchyService, htmlHierarchy]);

    useEffect(() => {
        passSetSelector(setSelector);
    }, [passSetSelector]);

    useEffect(() => {
        updateThoustPanels();
    }, [updateThoustPanels]);

    const refreshPanels = useCallback(() => {
        setRefreshKey(k => k + 1);
        setError(null);
    }, []);

    const addPanelIslandClicked = useCallback((element: HtmlElement) => {
        try {
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
        } catch (error) {
            console.error("Error in addPanelIslandClicked:", error);
            setError("Failed to add element to selector");
        }
    }, [latestSelector, selector, onConfirmSelector]);

    const removePanelIslandClicked = useCallback((element: HtmlElement) => {
        try {
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
        } catch (error) {
            console.error("Error in removePanelIslandClicked:", error);
            setError("Failed to remove element from selector");
        }
    }, [selector, onConfirmSelector]);

    const confirmSelector = useCallback((selector: string) => {
        try {
            console.log("🌊 Selector confirmed:", selector);
            setConfirmed(true);
            onConfirmSelector(selector);
        } catch (error) {
            console.error("Error in confirmSelector:", error);
            setError("Failed to confirm selector");
        }
    }, [onConfirmSelector]);

    // Memoize the panel rendering to improve performance
    const dimmedPanelsRendered = useMemo(() => 
        dimmedPanels.map((panel: ColorSelection, i: number) =>
            panel.selector.elem.map((element: HtmlElement) => {
                try {
                    const rect = element.getBoundingClientRect();
                    return (
                        <div
                            key={`dimmed-${i}-${element}`}
                            style={{
                                position: 'absolute',
                                left: rect.left + window.scrollX,
                                top: rect.top + window.scrollY,
                                width: rect.width,
                                height: rect.height,
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
                    );
                } catch (error) {
                    console.warn("Error rendering dimmed panel:", error);
                    return null;
                }
            })
        ).flat().filter(Boolean), [dimmedPanels, addPanelIslandClicked]);

    const activePanelsRendered = useMemo(() => 
        activeSelectorColorPanels.map((panel: ColorSelectorPanel, i: number) => {
            try {
                const rect = panel.element.getBoundingClientRect();
                return (
                    <div
                        key={`active-${i}-${panel.element}`}
                        style={{
                            position: 'absolute',
                            left: rect.left + window.scrollX,
                            top: rect.top + window.scrollY,
                            width: rect.width,
                            height: rect.height,
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
                );
            } catch (error) {
                console.warn("Error rendering active panel:", error);
                return null;
            }
        }).filter(Boolean), [activeSelectorColorPanels, removePanelIslandClicked]);

    if (confirmed) {
        return null;
    }

    // Show error state if there's an error
    if (error) {
        return (
            <div style={{ 
                position: 'fixed', 
                top: '50%', 
                left: '50%', 
                transform: 'translate(-50%, -50%)', 
                background: '#fff', 
                border: '1px solid #ff6b6b', 
                borderRadius: 8, 
                padding: 16, 
                zIndex: 10000,
                maxWidth: '300px'
            }}>
                <h3 style={{ margin: '0 0 10px 0', color: '#ff6b6b' }}>Selector Error</h3>
                <p style={{ margin: '0 0 10px 0' }}>{error}</p>
                <button onClick={refreshPanels} style={{ marginRight: 8 }}>Retry</button>
                <button onClick={() => setConfirmed(true)}>Close</button>
            </div>
        );
    }

    return (
        <SelectorHierarchyMount doc={doc} visible={!confirmed}>
            {/* Refresh buttons at corners */}
            {REFRESH_CORNERS.map(corner => (
                <button
                    key={corner.key}
                    style={{ position: 'fixed', zIndex: 10000, ...corner.style, pointerEvents: 'auto', background: '#fff8', border: '1px solid #ccc', borderRadius: 8, padding: 4, margin: 4 }}
                    onClick={refreshPanels}
                >⟳</button>
            ))}
            
            {/* Overlay panes for selectable elements */}
            {dimmedPanelsRendered}
            {activePanelsRendered}
            
            {/* Docked control panel */}
            <div style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 10000, background: '#fff', border: '1px solid #ccc', borderRadius: 8, padding: 16, pointerEvents: 'auto', minWidth: 240 }}>
                <div style={{ fontWeight: 'bold', marginBottom: 8 }}>Selector Mode</div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#333' }}>Click + to add, - to remove. Click ⟳ to refresh.</div>
                <div style={{ marginBottom: 8, fontSize: 12, color: '#005AE9', wordBreak: 'break-all' }}>{selector}</div>
                <input type={"button"} value={"Confirm"} onClick={() => confirmSelector(selector)} style={{ marginRight: 8 }} />
                <input type={"button"} value={"Deactivate Selector Mode"} onClick={() => setConfirmed(true)} />
            </div>
        </SelectorHierarchyMount>
    );
};

type MountOrFindSelectorHierarchyComponentProps = {
    service: SelectorHierarchyServiceInterface,
    selector: string,
    passSetSelector: { (modifier: (selector: string) => void): void },
    onConfirmSelector: { (selector: string): void },
    doc: Document,
    uiRoot: ShadowRoot,
    renderFunction: { (mount: Element, component: React.ReactNode): void }
}
type MountFunction = { (props: MountOrFindSelectorHierarchyComponentProps): Element }
export const MountOrFindSelectorHierarchyComponent: MountFunction = ({
    service,
    selector,
    passSetSelector,
    onConfirmSelector,
    doc = document,
    uiRoot,
    renderFunction = (mount: Element, component: React.ReactNode) => {
        try {
            // Use React 18's createRoot
            const root = ReactDOM.createRoot(mount as HTMLElement);
            root.render(component as React.ReactElement);
            return root;
        } catch (error) {
            console.error("Error creating React root:", error);
            // Fallback to legacy render if createRoot fails
            try {
                // @ts-ignore
                ReactDOM.render(component as React.ReactElement, mount);
            } catch (fallbackError) {
                console.error("Fallback render also failed:", fallbackError);
            }
        }
    }
}): Element => {
    let mount = uiRoot.querySelector("#wave-reader-component-mount") as HTMLElement;

    // Clean up existing mount if it exists
    if (mount) {
        console.log("reinitializing selector-hierarchy mount");
        try {
            // Try to unmount React root if it exists
            const existingRoot = (mount as any)._reactRootContainer;
            if (existingRoot) {
                existingRoot.unmount();
            }
            mount.remove();
        } catch (error) {
            console.warn("Error cleaning up existing mount:", error);
            mount.remove();
        }
    }

    // Create new mount element
    mount = doc.createElement("div");

    mount.style.display = "block";
    mount.style.position = "absolute";
    mount.style.margin = "0";
    mount.style.padding = "0";
    mount.style.left = "0";
    mount.style.top = "0";
    mount.style.width = "100%";
    mount.style.height = doc.documentElement.scrollHeight + "px";

    mount.setAttribute("id", "wave-reader-component-mount");
    uiRoot.appendChild(mount);

    // Create the component
    const component = (
        <HierarchySelectorComponent
            selectorHierarchyService={service}
            currentSelector={selector}
            passSetSelector={passSetSelector}
            onConfirmSelector={onConfirmSelector}
            doc={doc}
            uiRoot={uiRoot}
        />
    );

    // Render the component
    try {
        renderFunction(mount, component);
    } catch (error) {
        console.error("Error rendering selector hierarchy component:", error);
        // Create a simple fallback UI
        mount.innerHTML = `
            <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                        background: white; border: 1px solid #ccc; padding: 20px; z-index: 10000;">
                <h3>Selector Mode</h3>
                <p>Error loading selector interface. Please try refreshing the page.</p>
                <button onclick="this.parentElement.remove()">Close</button>
            </div>
        `;
    }

    return mount;
};

export default HierarchySelectorComponent;
