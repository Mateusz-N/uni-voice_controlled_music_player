import { useEffect, useRef } from 'react';

import btn_close from 'resources/btn_close.svg';

import Styles from 'components/generic/Modal.module.scss';

const Modal = (props) => {
    const modalID = props.id;
    const modalTitle = props.title;
    const children = props.children;
    const ExternalStyles = props.styles;

    const ref_modalBackdrop = useRef(null);
    const ref_modalWindow = useRef(null);

    useEffect(() => {
        ref_modalBackdrop.current.addEventListener('mousedown', (event) => {
            if(ref_modalWindow.current && !ref_modalWindow.current.contains(event.target)) {
                props.onClose();
            }
        });
    },[])

    return(
        <div className = {Styles.modalBackdrop} id = {ExternalStyles['modalBackdrop_' + modalID]} ref = {ref_modalBackdrop}>
            <div className = {Styles.modalWindow} id = {ExternalStyles['modalWindow_' + modalID]} ref = {ref_modalWindow}>
                <h2 className = {Styles.modalTitle} id = {ExternalStyles['modalTitle_' + modalID]}>{modalTitle}</h2>
                <img src = {btn_close} alt = 'Close' className = {Styles.btn_closeModal} id = {ExternalStyles['btn_closeModal_' + modalID]} onClick = {props.onClose} />
                {children}
            </div>
        </div>
    );

}

export default Modal;