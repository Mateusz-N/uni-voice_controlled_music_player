import { useEffect, useState } from 'react';

import { requestGetArtistDetails } from 'common/serverRequests';

import Modal from 'components/generic/Modal';

import Styles from 'components/OverviewPanel/ArtistDetailsModal.module.scss';

const ArtistDetailsModal = (props) => {
    // #region Zmienne globalne
    const index = props.index;
    const artist = props.artist;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [extraDetails, setExtraDetails] = useState({});
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        requestGetArtistDetails(artist.name, (data) => {
            console.log(data)
            setExtraDetails(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            <ul className = {Styles.artistDetails_section}>
                <h3 className = {Styles.artistDetails_sectionHeading}>Credits</h3>
                {uniqueEntities.map(entity => (
                    <li key = {entity.type} className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            {entity.type}:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
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
            <ul className = {Styles.artistDetails_section}>
                <h3 className = {Styles.artistDetails_sectionHeading}>Personnel</h3>
                {uniqueRoles.map(role => (
                    <li key = {role.name} className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            {role.name}:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {role.artists.join(', ')}
                        </span>
                    </li>
                ))}
            </ul>
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Modal key = {artist.id} title = 'Artist details' id = {'artistList_item_artistDetails_' + index} onClose = {props.onClose} styles = {Styles}>
            <main id = {Styles.artistDetails_main}>
                    <h3 className = {Styles.artistDetails_sectionHeading}>General information</h3>
                <ul className = {Styles.artistDetails_section}>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Artist name:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {artist.name}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Alternate names:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {extraDetails.namevariations ? extraDetails.namevariations.join(', ') : 'N/A'}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Spinoffs:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {extraDetails.aliases ? extraDetails.aliases.map(alias => alias.name).join(', ') : 'N/A'}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Current members:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {extraDetails.members ? extraDetails.members.filter(member => member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Past members:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {extraDetails.members ? extraDetails.members.filter(member => !member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Genres:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {artist.genres ? artist.genres.join(', ') : 'N/A'}
                        </span>
                    </li>
                    <li className = {Styles.artistDetails_detailItem}>
                        <span className = {Styles.artistDetails_detailItem_name}>
                            Profile:
                        </span>
                        <span className = {Styles.artistDetails_detailItem_value}>
                            {extraDetails.profile || 'N/A'}
                        </span>
                    </li>
                </ul>
                {companiesField}
                {extraArtistsField}
            </main>
        </Modal>
    );
    // #endregion
}

export default ArtistDetailsModal;