type MousePosition = {
    x: number;
    y: number;
    rotationAmountY: number;
    translationAmountX: number;
}

// from http://www.quirksmode.org/js/events_properties.html#position
/**
 * Use in conjunction with [onMouseMove] with a call to [requestAnimationFrame] enclosing the [mousePos] call.
 * @param rotationAmountDegrees the spread of rotation angle, from perpendicular tangent
 * @param event mouseMove event
 */
/* eslint-disable  @typescript-eslint/no-unused-vars */
export function getMousePos(rotationAmount: number, translationAmount: number, e: any): MousePosition {
    let posx = 0, posy = 0;

    if (!e) e = window.event;
    if (e.pageX || e.pageY) 	{
        posx = e.pageX;
        posy = e.pageY;
    }
    else if (e.clientX || e.clientY) 	{
        posx = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        posy = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    const clientWidth = document.body.clientWidth;
    return {
        x: posx, y: posy,
        rotationAmountY: Math.abs(e.clientX - clientWidth / 2) / (clientWidth / 2) * rotationAmount,
        translationAmountX: Math.abs(posx - clientWidth / 2) / (clientWidth / 2) * translationAmount
    }
}

const elementMiddle = (element: Element) => {
    return element.clientTop + (element.clientHeight / 2);
}

type ElementSort = {
    element: Element;
    sort: number;
}

//MIT licensed from https://github.com/codrops/TiltHoverEffects/blob/master/js/main.js
/**
 * Use in conjunction with [onMouseMove] with a call to [requestAnimationFrame] enclosing the [mousePos] call.
 * @param rotationAmountDegrees the spread of rotation angle, from perpendicular tangent
 * @param event mouseMove event
 */
export const mousePos = (rotationAmountDegrees: number, translationAmountX: number, event: any, elements: Element[] = []): MousePosition => {
    const mousepos = getMousePos(rotationAmountDegrees, translationAmountX, event);
    // Document scrolls.
    const docScrolls = {left : document.body.scrollLeft + document.documentElement.scrollLeft, top : document.body.scrollTop + document.documentElement.scrollTop};
        // find the closest element to the current mouse position, and use that for mouse
    const sortedElements: ElementSort[] = elements.map(element => ({ element, sort: Math.abs(docScrolls.top - elementMiddle(element)) }))
        .sort((a, b) => a.sort > b.sort ? 1 : -1);
    const el: Element | undefined = sortedElements.length > 0 ? sortedElements[0].element : undefined;
    const bounds = el?.getBoundingClientRect() || { left: 0, top: 0 };
    const elWidth = el?.clientWidth || 0;
    // Mouse position relative to the main element (this.DOM.el).
    return {
        x : mousepos.x - bounds.left - docScrolls.left,
        y : mousepos.y - bounds.top - docScrolls.top,
        rotationAmountY: Math.abs(mousepos.x - elWidth / 2) / (elWidth / 2) * rotationAmountDegrees,
        translationAmountX: Math.abs(mousepos.x - elWidth / 2) / (elWidth / 2) * translationAmountX
    };
}
