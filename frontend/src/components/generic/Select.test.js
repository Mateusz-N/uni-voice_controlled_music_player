import React from 'react';
import Select from 'components/generic/Select';
import ContextMenu from 'components/generic/ContextMenu';
import { render, screen, fireEvent } from '@testing-library/react'

jest.mock('components/generic/ContextMenu', () => {
    return jest.fn(() => null);
});

describe('Select Component', () => {
    it('should expand and collapse the selection list', () => {
        render(
            <Select
                defaultValue = 'Lorem ipsum'
                onSelection = {() => {}}
                children = {[]}
            />
        );
        
        const defaultOption = screen.getByTestId('select-default-option');
        expect(ContextMenu).toHaveBeenCalledWith(expect.objectContaining({ expanded: false }), expect.any(Object));

        fireEvent.click(defaultOption);
        expect(ContextMenu).toHaveBeenCalledWith(expect.objectContaining({ expanded: true }), expect.any(Object));

        fireEvent.click(defaultOption);
        expect(ContextMenu).toHaveBeenCalledWith(expect.objectContaining({ expanded: false }), expect.any(Object));
    });
});