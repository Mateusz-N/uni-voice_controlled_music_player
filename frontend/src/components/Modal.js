import { useEffect, useRef } from 'react';

import Styles from 'components/Modal.module.scss';

const Modal = (props) => {
    const modalWindowID = Styles['modalWindow_' + props.id];

    const ref_modalBackdrop = useRef(null);
    const ref_modalWindow = useRef(null);

    useEffect(() => {
        ref_modalBackdrop.current.addEventListener('click', (event) => {
            if(ref_modalWindow.current && !ref_modalWindow.current.contains(event.target)) {
                props.onClose();
            }
        });
    },[])

    return(
        <div className = {Styles.modalBackdrop} id = {Styles['modalBackdrop_' + props.id]} ref = {ref_modalBackdrop}>
            <div className = {Styles.modalWindow} id = {modalWindowID} ref = {ref_modalWindow}>
                <h1>HELLO WORLD</h1>
                {props.children}
            </div>
        </div>
    );

}

export default Modal;