/**
 * Shared utilities for SelectorHierarchy component
 * Used by both template and React views
 */

export interface ColorPanelData {
  element: HTMLElement;
  color: string;
  selector: string;
  rect: DOMRect;
}

/**
 * Generate a color from a color scheme based on index
 */
export function generateColor(index: number, scheme: string): string {
  const colors = {
    default: ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57'],
    warm: ['#ff6b6b', '#ff8e53', '#ffc75f', '#f9f871', '#ff6b9d'],
    cool: ['#4ecdc4', '#45b7d1', '#96ceb4', '#dda0dd', '#98d8c8']
  };
  const colorSet = colors[scheme as keyof typeof colors] || colors.default;
  return colorSet[index % colorSet.length];
}

/**
 * Generate a dimmed color (with transparency)
 */
export function generateDimmedColor(index: number, scheme: string): string {
  return generateColor(index, scheme) + '40';
}

/**
 * Generate a CSS selector string from an HTML element
 */
export function generateSelector(element: HTMLElement): string {
  let selector = element.tagName.toLowerCase();
  if (element.id) {
    selector = `#${element.id}`;
  } else if (element.className) {
    const classes = element.className.split(' ').filter(c => c).join('.');
    if (classes) {
      selector += `.${classes}`;
    }
  }
  return selector;
}

/**
 * Check if an element is a "main" element (visible and substantial)
 */
export function isMainElement(el: HTMLElement): boolean {
  if (!el.offsetParent) return false;
  const rect = el.getBoundingClientRect();
  return rect.width >= 20 && rect.height >= 10;
}

/**
 * Generate color panel data from a set of elements
 */
export function createColorPanelData(
  elements: Set<HTMLElement>,
  colorScheme: string,
  dimmed: boolean = false
): ColorPanelData[] {
  return Array.from(elements).map((el, index) => ({
    element: el,
    color: dimmed ? generateDimmedColor(index, colorScheme) : generateColor(index, colorScheme),
    selector: generateSelector(el),
    rect: el.getBoundingClientRect()
  }));
}

/**
 * Update selector from selected elements
 */
export function updateSelectorFromSelections(selectedElements: Set<HTMLElement>): string {
  const selectorParts = Array.from(selectedElements).map(el => generateSelector(el));
  return selectorParts.join(', ');
}

/**
 * Validate a CSS selector against a document
 */
export function validateSelector(document: Document, selector: string): boolean {
  try {
    const elements = document.querySelectorAll(selector);
    return elements.length > 0;
  } catch (error) {
    return false;
  }
}

