import { useEffect } from 'react';

import Modal from 'components/generic/Modal';
import FormControlSection from 'components/generic/FormControlSection';

import Styles from 'components/generic/ConfirmModal.module.scss';

const ConfirmModal = (props) => {
    // #region Zmienne globalne
    const index = props.index;
    const context = props.context;
    const title = props.title || 'Confirmation required';
    const defaultAction = props.defaultAction;
    const children = props.children;
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'submit') {
            props.onSubmit();
            return;
        }
        if(defaultAction === 'cancel') {
            props.onCancel();
            return;
        }
    },[defaultAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Modal
            key = {index}
            title = {title}
            id = {'confirmModal_' + context}
            onClose = {props.onCancel}
            styles = {Styles}
        >
            <form id = {Styles.form_confirmModal}>
                {children}
                <FormControlSection
                    context = 'confirmModal'
                    onSubmit = {props.onSubmit}
                    onCancel = {props.onCancel}
                    styles = {Styles}
                />
            </form>
        </Modal>
    );
    // #endregion
}

export default ConfirmModal;