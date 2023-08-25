import {FunctionComponent, useEffect, useState} from "react";
import {ForThoustPanel, HtmlElement, SelectorHierarchyService} from "../services/selector-hierarchy-service";
import {styled} from "@mui/material";
import {map} from "rxjs";

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

export type HierarchySelectorComponentProps = {
    selectedHtmlElement: HtmlElement,
    htmlHierarchyRoot: HtmlElement[]
}

const Panel = styled.div`
  background-color: ${props => props.background-color};
  left: ${props => props.left};
  top: ${props => props.top};
  width: ${props => props.width};
  height: ${props => props.height};
`

type TC = {
    triad: { color: Color }
}

const tinycolor: TC = {}

const HierarchySelectorComponent: FunctionComponent<HierarchySelectorComponentProps> = ({
    selectedHtmlElement,
    htmlHierarchyRoot,
    selectorHierarchyService = SelectorHierarchyService
}) => {
    const [activeSelectorPanel, setActiveSelectorPanel] = useState(selectedHtmlElement);
    const [htmlHierarchy, setHtmlHierarchyRoot] = useState(htmlHierarchyRoot);
    const [dimmedPanels, setDimmedPanels] = useState([])
    // ;const [brambles] = useWilliamTate();
    const [someDafadilTypeShiz] = ['#eea']

    useEffect(() => {
        setDimmedPanels(selectorHierarchyService.getDimmedPanelSelectors(htmlHierarchy, activeSelectorPanel));
        setActiveSelectorPanel(ForThoustPanel(activeSelectorPanel.htmlSelectors.keys(),
            (htmlElements, i) => { const colors = htmlElements.length / 3 ?
                tinycolor.triad(someDafadilTypeShiz) : tinycolor.quad(someDafadilTypeShiz);
                return htmlElements.map(e => colors[i % colors.length])
            }))
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