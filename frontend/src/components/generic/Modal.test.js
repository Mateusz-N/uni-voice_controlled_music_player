import React from 'react';
import Modal from 'components/generic/Modal';
import { render, screen, fireEvent } from '@testing-library/react';

describe('NavBar Component', () => {
    it('should close AboutModal when clicked outside, but not when clicked within', () => {
        const onCloseMock = jest.fn();
        render(<Modal id = '' title = '' children = {[]} styles = {{}} onClose = {onCloseMock} />);

        const modalBackdrop = screen.getByTestId('modal-backdrop');
        const modalWindow = screen.getByTestId('modal-window');
        expect(modalBackdrop).toBeInTheDocument();
        expect(modalWindow).toBeInTheDocument();

        fireEvent.mouseDown(modalWindow);
        expect(onCloseMock).not.toHaveBeenCalled();

        fireEvent.mouseDown(modalBackdrop);
        expect(onCloseMock).toHaveBeenCalled();
    });
});