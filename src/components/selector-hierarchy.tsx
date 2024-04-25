import React, {FunctionComponent, useEffect, useState} from "react";
import {
    ColorGeneratorServiceInterface,
    ColorSelection,
    ForThoustPanel,
    HtmlElement, HtmlSelection, Selector,
    SelectorHierarchy,
    SelectorHierarchyServiceInterface,
    SizeFunctions,
    SizeProperties
} from "../services/selector-hierarchy";
import styled, {StyledComponent} from "styled-components";
import ReactDOM from "react-dom";
import {SelectorsDefaultFactory} from "../models/defaults";
import {Button} from "@mui/material";
import {_ClearViews_, _View_, ComponentLog, log, MachineComponentProps, ReactMachine} from "../util/react-machine";
import Robotcopy, {ClientDiscoveryConfig} from "../config/robotcopy";
import {ClientDiscovery} from "../util/state-machine";

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

const Panel = styled.div`
  .panel-decorator {
    background-color: ${({color}) => color};
    position: relative;
    min-width: 20px;
    min-height: 20px;
    left: ${(props: ColorSelectorPanel) => SizeFunctions.calcLeft(props.element)}px !important;
    top: ${(props: ColorSelectorPanel) => SizeFunctions.calcTop(props.element)}px !important;
    width: ${(props: ColorSelectorPanel) => SizeFunctions.calcSize(props.element, props.element?.style?.width, SizeProperties.WIDTH)}px !important;
    height: ${(props: ColorSelectorPanel) => SizeFunctions.calcSize(props.element, props.element?.style?.height, SizeProperties.HEIGHT)}px !important;
  }
` as StyledComponent<"div", any, ColorSelectorPanel, never>

// find selectable text, and copy structural elements entirely pruning branches
//   use provided selector and default text selectors to select each available branch
//   it may be easier to just replicate each feature allowing for duplicates

type ColorSelectorV2 = {
    root: HtmlElement, // from body element or the overlay div element
    tree: HtmlElement[], // a duplicate of the [HtmlElement]'s tree
    color: Hex,
    element: HtmlElement
}

const HierarchySelectorReactMachine = ReactMachine<HierarchySelectorComponentProps>({
    client: (Robotcopy.clients.popup as ClientDiscoveryConfig).up(),
    initialState: "bootstrap",
    states: {
        "bootstrap": ({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            const [selections, setSelections] = state?.useState<ColorSelectorV2[]>("selections", []) || [undefined, undefined]
            const [dimmed, setDimmed] = state?.useState<ColorSelectorV2[]>("dimmed", []) || [undefined, undefined]

            // fill selections from props
            // store trees pruned to the current element
            // present with base

            return Promise.resolve(log("base", _ClearViews_))
        },
        "base":({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            const selections = state?.getState<ColorSelectorV2[]>("selections");
            const dimmed = state?.getState<ColorSelectorV2[]>("dimmed");
            const confirmed = state?.getState<ColorSelectorV2[]>("confirmed");

            return Promise.resolve(log("base",
                <SelectorHierarchyMount doc={state?.props?.doc} visible={!confirmed}>
            </SelectorHierarchyMount>);
        },
        "add":({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {

            return Promise.resolve(log("base", _View_);
        },
        "remove":({state, machine}: Partial<MachineComponentProps>): Promise<ComponentLog> => {
            return Promise.resolve(log("base", _View_);
        }
    }
})

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
    const [htmlHierarchy, setHtmlHierarchy] = useState(doc);
    const [dimmedPanels, setDimmedPanels] = useState<ColorSelection[]>([])
    const [confirmed, setConfirmed] = useState(false);

    // ;const [brambles] = useWilliamTate();
    // 'const [someDafadilTypeShiz] = ['#eea']

    const updateThoustPanels = () => {
        const selection = ForThoustPanel(htmlHierarchy, selector || SelectorsDefaultFactory()[0], selectorHierarchyService);
        console.log(JSON.stringify(selection));
        setLatestSelector(selection)
        const activePanels = [...selection.htmlSelectors.values()].flatMap(s => {
            return s.selector.elem.map(e => new ColorSelectorPanel( e, s.color.toHexString() ));
        })
        // todo: change to, select from selectors for "*" minus active selection
        setDimmedPanels([...selectorHierarchyService.getDimmedPanelSelectors(htmlHierarchy, activePanels.map(s => s.element)).htmlSelectors.values()]);
        setActiveSelectorColorPanels(activePanels)
    }

    useEffect(() => {
        passSetSelector(setSelector)
        updateThoustPanels()
    }, [])

    useEffect(() => {
        console.log(selector + " changed!")
        updateThoustPanels()
    }, [selector])

    const addPanelIslandClicked = (element: HtmlElement) => {
        const colorPanel = activeSelectorColorPanels.find(p => p.element === element);

        const panelSelector = [...(latestSelector?.htmlSelectors?.keys() || [])].filter(selector => selector.elem.find(e => e === colorPanel?.element))

        setSelector((selector ? selector + ", " : "") + [...new Set(panelSelector.flatMap(s => s.classList))].join(", "))
    }

    const removePanelIslandClicked = (element: HtmlElement) => {
        const colorPanel = activeSelectorColorPanels.find(p => p.element === element);

        // using the current selector, remove get a classList from the colorPanel and remove any then setSelector
        // also filter the latestSelector for mentions of the colorPanel element islands

        const entries = [...(latestSelector?.htmlSelectors?.entries() || [])].filter(([key]) => {
            return !key.elem.find(e => e === colorPanel?.element);
        });

        setLatestSelector(new HtmlSelection(new Map<Selector, ColorSelection>(entries)))
        setSelector(selector.split(",").map(s => s.trim()).filter(s => colorPanel?.element !== element &&
            !colorPanel?.element.classList.contains(s)).join(", "))
    }

    const confirmSelector = (selector: string) => {
        setConfirmed(true)
        onConfirmSelector(selector)
    }

    return (
        <SelectorHierarchyMount doc={doc} visible={!confirmed}>
            {activeSelectorColorPanels.length}<span className={"floating-shelf"}>{selector}</span>
            <input type={"button"} value={"confirm"} onClick={() => confirmSelector(selector)} />
            {dimmedPanels.map((panel: ColorSelection, i: number) => {
                return panel.selector.elem.forEach((element: HtmlElement) => {
                    return <Panel className={"panel-decorator"} color={panel.color.toHexString()} element={element} key={i}>
                        <SelectorButton key={'+'+i} style={{
                            backgroundColor: "#333",
                            color: "#eee"
                        }} onClick={(e) => {
                            addPanelIslandClicked.call(this, element)
                        }}>+</SelectorButton>
                    </Panel>
                })
            })}

            {activeSelectorColorPanels.flatMap((panel: ColorSelectorPanel, i: number) => {
                return <Panel className={"panel-decorator"} color={panel.color} element={panel.element}  key={i}
                    style={{
                        left: `${SizeFunctions.calcLeft(panel.element)}px !important`,
                        top: `${SizeFunctions.calcTop(panel.element)}px !important`,
                        width: `${SizeFunctions.calcSize(panel.element, panel.element?.style?.width, SizeProperties.WIDTH)}px !important`,
                        height: `${SizeFunctions.calcSize(panel.element, panel.element?.style?.height, SizeProperties.HEIGHT)}px !important`
                    }}
                >
                    {/* maybe hypertext or something? */}
                    <SelectorButton key={'-'+i} onClick={(e) => {
                        removePanelIslandClicked.call(this, panel.element)
                    }}>-</SelectorButton>
                </Panel>
            })}
            {/* maybe maybe maybe
            maaaaaayyyyybee some day we'll
            seeee essss veee gheee
            gheee'
            gheee
            ghee-e-e ...,,,---~~~````~~~~----````____`````---
            pixels, pixels sometimes changes
            full screen scrolling device independent pixels threw
            many software engineers for a loop,
            em and rem providing a bastion,
            but for too many deviceRatio is a weird concept
            and we struggle randomly scoping hard coded values
            or disappearing into vaults to learn the secrets of the HTML/svg specification and how to use the viewport.

            You are a lone self educator, in a loan filled wasteland of dread and pixel conversions,
            will you embrace your change of basis? Will you end the suffering of the pixelated wastes in your mind?
            Or will you simply set everything to pixels like i did, and hope rem works well enough?

            // todo: hookup svg panels and make sure to validate deviceRatio and viewport usage for perfect screen fit,
            // todo:   if possible

            // todo: start, stop, choose, add panel, remove panel
            */}
            {/*<svg>*/}
            {/*<Cover>*/}
            {/*    <Mask></Mask>*/}
            {/*</Cover>*/}
            {/*</svg>*/}
            {/* [...maybe, maybe, maybe] */}
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
