import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';
import { requestGetTrackDetails } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import Toast from 'components/generic/Toast';

import Styles from 'components/TrackList/TrackDetailsModal.module.scss';

const TrackDetailsModal = (props) => {
    // #region Zmienne globalne
    const index = props.index;
    const track = props.track;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [notification, setNotification] = useState({});
    const [extraDetails, setExtraDetails] = useState({});
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast message = {notification.message} type = {notification.type} onAnimationEnd = {() => setNotification({})} />, document.body);
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        requestGetTrackDetails(track.title, track.artists[0].name, track.album.release_date.split('-').shift(), (data) => {
            setExtraDetails(data);
        });
    },[]);
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let companiesField = null;
    if(extraDetails.companies && extraDetails.companies.length > 0) {
        const uniqueEntities = [];
        extraDetails.companies.forEach(company => {
            const alreadyPresentEntity = uniqueEntities.find(entity => entity.type === company.entity_type_name);
            if(!alreadyPresentEntity) {
                uniqueEntities.push({type: company.entity_type_name, companies: [company.name]});
                return;
            }
            alreadyPresentEntity.companies.push(company.name);
        })
        companiesField = 
            <ul className = {Styles.trackDetails_section}>
                <h3 className = {Styles.trackDetails_sectionHeading}>Credits</h3>
                {uniqueEntities.map(entity => (
                    <li key = {entity.type} className = {Styles.trackDetails_detailItem}>
                        <span className = {Styles.trackDetails_detailItem_name}>
                            {entity.type}:
                        </span>
                        <span className = {Styles.trackDetails_detailItem_value}>
                            {entity.companies.join(', ')}
                        </span>
                    </li>
                ))}
            </ul>
    }
    let extraArtistsField = null;
    if(extraDetails.extraartists && extraDetails.extraartists.length > 0) {
        const uniqueRoles = [];
        extraDetails.extraartists.forEach(artist => {
            const alreadyPresentRole = uniqueRoles.find(role => role.name === artist.role);
            if(!alreadyPresentRole) {
                uniqueRoles.push({name: artist.role, artists: [artist.name]});
                return;
            }
            alreadyPresentRole.artists.push(artist.name);
        })
        extraArtistsField =
            <ul className = {Styles.trackDetails_section}>
                <h3 className = {Styles.trackDetails_sectionHeading}>Personnel</h3>
                {uniqueRoles.map(role => (
                    <li key = {role.name} className = {Styles.trackDetails_detailItem}>
                        <span className = {Styles.trackDetails_detailItem_name}>
                            {role.name}:
                        </span>
                        <span className = {Styles.trackDetails_detailItem_value}>
                            {role.artists.join(', ')}
                        </span>
                    </li>
                ))}
            </ul>
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <Modal key = {track.id} title = 'Track details' id = {'trackList_item_trackDetails_' + index} onClose = {props.onClose} styles = {Styles}>
                <main id = {Styles.trackDetails_main}>
                        <h3 className = {Styles.trackDetails_sectionHeading}>General information</h3>
                    <ul className = {Styles.trackDetails_section}>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Title:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {track.title}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Artist(s):
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {track.artists.map(artist => artist.name).join(', ')}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Album:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {track.album.name}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Release date:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {new Date(track.album.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'})}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Duration:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {millisecondsToFormattedTime(track.duration_ms)}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Genres:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {extraDetails.genres ? extraDetails.genres.join(', ') : 'N/A'}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Styles:
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {extraDetails.styles ? extraDetails.styles.join(', ') : 'N/A'}
                            </span>
                        </li>
                        <li className = {Styles.trackDetails_detailItem}>
                            <span className = {Styles.trackDetails_detailItem_name}>
                                Label(s):
                            </span>
                            <span className = {Styles.trackDetails_detailItem_value}>
                                {extraDetails.labels ? extraDetails.labels.map(label => label.name).join(', ') : 'N/A'}
                            </span>
                        </li>
                    </ul>
                    {companiesField}
                    {extraArtistsField}
                </main>
            </Modal>
        </>
    );
    // #endregion
}

export default TrackDetailsModal;