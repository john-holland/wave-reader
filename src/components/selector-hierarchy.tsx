import React, {FunctionComponent, useEffect, useState} from "react";
import {
    ColorGeneratorServiceInterface,
    ColorSelection,
    ForThoustPanel,
    HtmlElement,
    SelectorHierarchy,
    SelectorHierarchyServiceInterface,
    SizeFunctions,
    SizeProperties
} from "../services/selector-hierarchy";
import styled, {StyledComponent} from "styled-components";
import ReactDOM from "react-dom";
import {SelectorsDefaultFactory} from "../models/defaults";

type SelectorHierarchyMountProps = {
    doc: Document
}

const SelectorHierarchyMount = styled.div`
  display: block;
  position: absolute;
  margin: 0;
  padding: 0;
  left: 0;
  top: 0;
  width: 100%;
  height: ${(props: SelectorHierarchyMountProps) => props.doc.documentElement.scrollHeight} px;
`

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

const Panel = styled.div<ColorSelectorPanel>`
  background-color: ${({color}) => color};
  left: ${(props: ColorSelectorPanel) => SizeFunctions.calcLeft(props.element)};
  top: ${(props: ColorSelectorPanel) => SizeFunctions.calcTop(props.element)};
  width: ${(props: ColorSelectorPanel) => SizeFunctions.calcSize(props.element, props.element.style.width, SizeProperties.WIDTH)};
  height: ${(props: ColorSelectorPanel) => SizeFunctions.calcSize(props.element, props.element.style.width, SizeProperties.HEIGHT)};
` as StyledComponent<"div", any, ColorSelectorPanel, never>

const HierarchySelectorComponent: FunctionComponent<HierarchySelectorComponentProps> = ({
    selectorHierarchyService = new SelectorHierarchy({ } as unknown as ColorGeneratorServiceInterface),
    currentSelector,
    onConfirmSelector,
    passSetSelector,
    doc = document
}) => {
    const [activeSelectorPanel, setActiveSelectorPanel] = useState(undefined);
    const [selector, setSelector] = useState(currentSelector);
    const [activeSelectorColorPanels, setActiveSelectorColorPanels] = useState<ColorSelectorPanel[]>([])
    const [htmlHierarchy, setHtmlHierarchy] = useState(doc);
    const [dimmedPanels, setDimmedPanels] = useState<ColorSelection[]>([])
    // ;const [brambles] = useWilliamTate();
    // 'const [someDafadilTypeShiz] = ['#eea']

    const updateThoustPanels = () => {
        const selection = ForThoustPanel(htmlHierarchy, selector || SelectorsDefaultFactory()[0], selectorHierarchyService);
        const activePanels = [...selection.htmlSelectors.values()].flatMap(s => {
            return s.selector.elem.map(e => new ColorSelectorPanel( e, s.color.toHexString() ));
        })
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

    return (
        <SelectorHierarchyMount doc={doc}>
            {activeSelectorColorPanels.length}<span className={"floating-shelf"}>{selector}</span>
            <input type={"button"} value={"confirm"} onClick={() => onConfirmSelector(selector)} />
            {dimmedPanels.map((panel: ColorSelection) => {
                panel.selector.elem.forEach((element: HtmlElement) => {
                    return <Panel color={panel.color.toHexString()} element={element}
                                  // svg may be the way to go with this stuff
                                  // x={SizeFunctions.calcLeft(element)} y={SizeFunctions.calcTop(element)}
                    ></Panel>
                })
            })}

            {activeSelectorColorPanels.map((panel: ColorSelectorPanel) => {
                return <Panel color={panel.color} element={panel.element}></Panel>
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
