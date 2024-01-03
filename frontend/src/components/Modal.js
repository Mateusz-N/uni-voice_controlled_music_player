import { useState } from 'react';

import Styles from 'components/Modal.module.scss';

const Modal = (props) => {
    const [open, setOpen] = useState(props.open);
    console.log(props.open)

    const modalWindowID = Styles['modalWindow_' + props.id];

    // document.body.addEventListener('click', (event) => {
    //     if(open && event.target !== document.getElementById(modalWindowID)) {
    //         setOpen(false);
    //         props.onClose();
    //     }
    // });

    return(!open ? null :
        <div className = {Styles.modalBackdrop} id = {Styles['modalBackdrop_' + props.id]}>
            <div className = {Styles.modalWindow} id = {modalWindowID}>
                <h1>HELLO WORLD</h1>
                {props.children}
            </div>
        </div>
    );

}

export default Modal;