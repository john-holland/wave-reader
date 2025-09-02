import React from 'react';
import { createRoot } from 'react-dom/client';
import SelectorHierarchyTomes from '../component-middleware/selector-hierarchy/SelectorHierarchyTomes';

// Bridge component for selector-hierarchy
export default function SelectorHierarchy(props: any) {
  return <SelectorHierarchyTomes {...props} />;
}

// Legacy export for content scripts
type MountOrFindSelectorHierarchyComponentProps = {
    service: any,
    selector: string,
    passSetSelector: { (modifier: (selector: string) => void): void },
    onConfirmSelector: { (selector: string): void },
    doc: Document,
    uiRoot: ShadowRoot,
    renderFunction: { (mount: Element, component: React.ReactNode): void }
}

export const MountOrFindSelectorHierarchyComponent = ({
    service,
    selector,
    passSetSelector,
    onConfirmSelector,
    doc = document,
    uiRoot,
    renderFunction = (mount: Element, component: React.ReactNode) => {
        try {
            // Use React 18's createRoot
            const root = createRoot(mount as HTMLElement);
            root.render(component);
        } catch (error) {
            console.error('Error rendering selector hierarchy component:', error);
        }
    }
}: MountOrFindSelectorHierarchyComponentProps): Element => {
    // Create a mount point
    const mount = doc.createElement('div');
    mount.id = 'selector-hierarchy-mount';
    mount.style.cssText = 'position: fixed; top: 0; left: 0; width: 100%; height: 100%; z-index: 9999; pointer-events: none;';
    
    // Add to UI root
    uiRoot.appendChild(mount);

    // Render the component
    const component = (
        <SelectorHierarchy
            service={service}
            selector={selector}
            passSetSelector={passSetSelector}
            onConfirmSelector={onConfirmSelector}
        />
    );

        renderFunction(mount, component);

    return mount;
};
