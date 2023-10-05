import {FunctionComponent, useEffect, useState} from "react";
import {
    ColorGeneratorServiceInterface, ColorSelection,
    ForThoustPanel,
    HtmlElement,
    SelectorHierarchy,
    SelectorHierarchyServiceInterface
} from "../services/selector-hierarchy";
import styled, {StyledComponent} from "styled-components";
import {flatMap, map} from "rxjs";
import tinycolor from "tinycolor2"
import SettingsService from "../services/settings";
import React from 'react';

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
    selectorHierarchyService: SelectorHierarchyServiceInterface,
    currentSelector: string,
    onConfirmSelector: { (selector: string): void }
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
  left: ${(props: ColorSelectorPanel) => props.element.style.left};
  top: ${(props: ColorSelectorPanel) => props.element.style.top};
  width: ${(props: ColorSelectorPanel) => props.element.style.width};
  height: ${(props: ColorSelectorPanel) => props.element.style.height};
` as StyledComponent<"div", any, ColorSelectorPanel, never>

const HierarchySelectorComponent: FunctionComponent<HierarchySelectorComponentProps> = ({
    selectorHierarchyService = new SelectorHierarchy({ } as unknown as ColorGeneratorServiceInterface),
    currentSelector,
    onConfirmSelector
}) => {
    const [activeSelectorPanel, setActiveSelectorPanel] = useState(undefined);
    const [selector, setSelector] = useState(currentSelector);
    const [activeSelectorColorPanels, setActiveSelectorColorPanels] = useState<ColorSelectorPanel[]>([])
    const [htmlHierarchy, setHtmlHierarchyRoot] = useState(document);
    const [dimmedPanels, setDimmedPanels] = useState<ColorSelection[]>([])
    // ;const [brambles] = useWilliamTate();
    const [someDafadilTypeShiz] = ['#eea']

    useEffect(() => {
        new SettingsService().getCurrentSettings().then(settings => {
            const selection = ForThoustPanel(document, settings.wave.selector || "", selectorHierarchyService);
            const activePanels = [...selection.htmlSelectors.values()].flatMap(s => {
                return s.selector.elem.map(e => new ColorSelectorPanel( e, s.color.toHexString() ));
            })
            setDimmedPanels([...selectorHierarchyService.getDimmedPanelSelectors(document, activePanels.map(s => s.element)).htmlSelectors.values()]);
            setActiveSelectorColorPanels(activePanels)
        })
    }, [])

    return (
        <div>
            {dimmedPanels.map((panel: ColorSelection) => {
                panel.selector.elem.forEach((element: HtmlElement) => {
                    return <Panel color={panel.color.toHexString()} element={element}></Panel>
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
            <svg>
            <Cover>
                <Mask></Mask>
            </Cover>
            </svg>
            {/* [...maybe, maybe, maybe] */}
        </div>
    )
}

export default HierarchySelectorComponent;