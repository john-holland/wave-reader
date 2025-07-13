import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import SelectorInput from '../../src/components/selector-input';

describe('SelectorInput', () => {
    const mockProps = {
        selector: 'test-selector',
        selectors: ['test-selector', 'other-selector'],
        saved: true,
        selectorClicked: jest.fn(),
        onSave: jest.fn(),
        selectorModeClicked: jest.fn(),
        selectorModeOn: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('renders selector display when saved', () => {
        render(<SelectorInput {...mockProps} />);
        
        expect(screen.getByText('Text Selector')).toBeInTheDocument();
        expect(screen.getByText('test-selector')).toBeInTheDocument();
        expect(screen.getByText('(click to edit selector)')).toBeInTheDocument();
    });

    test('renders input when not saved', () => {
        render(<SelectorInput {...mockProps} saved={false} />);
        
        // Use getAllByDisplayValue and get the first one (the main input, not autocomplete)
        const inputs = screen.getAllByDisplayValue('test-selector');
        expect(inputs[0]).toBeInTheDocument();
        expect(screen.getByText('Save')).toBeInTheDocument();
    });

    test('starts editing when clicked', async () => {
        render(<SelectorInput {...mockProps} />);
        
        const clickableLabel = screen.getByTestId('clickable-selector-label');
        fireEvent.click(clickableLabel);
        
        await waitFor(() => {
            // Use getAllByDisplayValue and get the first one (the main input)
            const inputs = screen.getAllByDisplayValue('test-selector');
            expect(inputs[0]).toBeInTheDocument();
            expect(screen.getByText('Save')).toBeInTheDocument();
            expect(screen.getByText('Cancel')).toBeInTheDocument();
        });
    });

    test('saves selector when save button clicked', async () => {
        render(<SelectorInput {...mockProps} saved={false} />);
        
        // Use getAllByDisplayValue and get the first one (the main input)
        const inputs = screen.getAllByDisplayValue('test-selector');
        const input = inputs[0];
        fireEvent.change(input, { target: { value: 'new-selector' } });
        
        const saveButton = screen.getByText('Save');
        fireEvent.click(saveButton);
        
        expect(mockProps.onSave).toHaveBeenCalledWith('new-selector');
    });

    test('cancels editing when cancel button clicked', async () => {
        render(<SelectorInput {...mockProps} />);
        
        // Start editing
        const clickableLabel = screen.getByTestId('clickable-selector-label');
        fireEvent.click(clickableLabel);
        
        await waitFor(() => {
            const inputs = screen.getAllByDisplayValue('test-selector');
            const input = inputs[0];
            fireEvent.change(input, { target: { value: 'modified-selector' } });
        });
        
        const cancelButton = screen.getByText('Cancel');
        fireEvent.click(cancelButton);
        
        await waitFor(() => {
            expect(screen.getByText('test-selector')).toBeInTheDocument();
            // Should not have the modified value in any input
            expect(screen.queryByDisplayValue('modified-selector')).not.toBeInTheDocument();
        });
    });

    test('toggles selector mode when button clicked', () => {
        render(<SelectorInput {...mockProps} />);
        
        const modeButton = screen.getByText('Activate Selector Mode! 🌙');
        fireEvent.click(modeButton);
        
        expect(mockProps.selectorModeClicked).toHaveBeenCalledWith(true);
    });

    test('shows autocomplete with saved selectors when not editing', () => {
        render(<SelectorInput {...mockProps} />);
        
        // Should show the autocomplete label - use getAllByText and get the first one
        const labels = screen.getAllByText('Select from saved selectors');
        expect(labels[0]).toBeInTheDocument();
    });

    test('hides autocomplete when editing', async () => {
        render(<SelectorInput {...mockProps} />);
        
        // Start editing
        const clickableLabel = screen.getByTestId('clickable-selector-label');
        fireEvent.click(clickableLabel);
        
        await waitFor(() => {
            // Autocomplete should be hidden when editing
            expect(screen.queryByText('Select from saved selectors')).not.toBeInTheDocument();
        });
    });
}); 