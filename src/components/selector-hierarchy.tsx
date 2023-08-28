import {FunctionComponent, useEffect, useState} from "react";
import {
    ColorGeneratorServiceInterface,
    ForThoustPanel,
    HtmlElement,
    SelectorHierarchyService,
    SelectorHierarchyServiceInterface
} from "../services/selector-hierarchy-service";
import styled from "styled-components";
import {flatMap, map} from "rxjs";
import tinycolor from "tinycolor2"

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

const Mask = styled.svg`
  mouse-events: none;
    
`
const Cover = styled.svg`
  mouse-events: none;
`

const Panel = styled.div`
  background-color: ${(props: HtmlElement) => props.background_color};
  left: ${(props: HtmlElement) => props.left};
  top: ${(props: HtmlElement) => props.top};
  width: ${(props: HtmlElement) => props.width};
  height: ${(props: HtmlElement) => props.height};
`

export type HierarchySelectorComponentProps = {
    selectedHtmlElement: HtmlElement,
    htmlHierarchyRoot: HtmlElement[],
    selectorHierarchyService: SelectorHierarchyServiceInterface
}

const HierarchySelectorComponent: FunctionComponent<HierarchySelectorComponentProps> = ({
    selectedHtmlElement,
    htmlHierarchyRoot,
    selectorHierarchyService = new SelectorHierarchyService({ } as unknown as ColorGeneratorServiceInterface)
}) => {
    const [activeSelectorPanel, setActiveSelectorPanel] = useState(selectedHtmlElement);
    const [activeSelectorColorPanels, setActiveSelectorColorPanels] = useState<ColorSelectorPanel[]>([])
    const [htmlHierarchy, setHtmlHierarchyRoot] = useState(htmlHierarchyRoot);
    const [dimmedPanels, setDimmedPanels] = useState([])
    // ;const [brambles] = useWilliamTate();
    const [someDafadilTypeShiz] = ['#eea']

    type Hex = string;
    type ColorSelectorPanel = {
        element: HtmlElement;
        color: Hex; //color.toHexString() from tinycolor.Instance;
    }
    useEffect(() => {

        const selection = ForThoustPanel(document, activeSelectorPanel, selectorHierarchyService);
        const activePanels = [...selection.htmlSelectors.values()].flatMap(s => {
            return { element: s.selector.elem, color: s.color.toHexString() } as unknown as ColorSelectorPanel;
        })
        setDimmedPanels(selectorHierarchyService.getDimmedPanelSelectors(htmlHierarchy, activePanels.map(s => s.element)).htmlSelectors.values().flatMap(c => c));
        setActiveSelectorColorPanels(activePanels)
    }, [])

    return (
        <div>
            {dimmedPanels.map(panel => {
                return <Panel props={panel}></Panel>
            })}
            {activeSelectorPanel.map(panel => {
                return <Panel props={panel}></Panel>
            })}
            {/* maybe maybe maybe*/}
            <svg>
            <Cover>
                <Mask></Mask>
            </Cover>
            </svg>
            {/* maybe maybe maybe*/}
        </div>
    )
}

export default HierarchySelectorComponent;