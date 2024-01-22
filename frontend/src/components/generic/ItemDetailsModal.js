import { useEffect } from 'react';
import { Link } from 'react-router-dom';

import { capitalizeFirstLetter } from 'common/auxiliaryFunctions';

import Modal from 'components/generic/Modal';

import Styles from 'components/generic/ItemDetailsModal.module.scss';

const ItemDetailsModal = (props) => {
    // #region Zmienne globalne
    const defaultAction = props.defaultAction;
    const index = props.index;
    const itemType = props.itemType;
    const details = props.details;
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'cancel') {
            props.onClose();
        }
    },[defaultAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Modal
            key = {index}
            title = {`${capitalizeFirstLetter(itemType)} details`}
            id = {itemType + 'Details_' + index}
            onClose = {props.onClose}
            styles = {Styles}
        >
            <main className = {Styles.itemDetails_main}>
            <p className = {Styles.detailsAttribution}>~ Details brought to you by <Link to = 'https://discogs.com/'>Discogs</Link> ~</p>
            {details.map((section, sectionIndex) => {
                const itemNodes = section.items.map((item, itemIndex) => (
                    <li key = {itemIndex} className = {Styles.itemDetails_detailItem}>
                        <span className = {Styles.itemDetails_detailItem_name}>
                            {item.displayName}:
                        </span>
                        <span className = {Styles.itemDetails_detailItem_value}>
                            {item.value}
                        </span>
                    </li>
                ));
                return(
                    <ul key = {sectionIndex} className = {Styles.itemDetails_section}>
                        <h3 className = {Styles.itemDetails_sectionHeading}>{section.name}</h3>
                        {itemNodes}
                    </ul>
                );
            })}
            </main>
        </Modal>
    );
    // #endregion
}

export default ItemDetailsModal;