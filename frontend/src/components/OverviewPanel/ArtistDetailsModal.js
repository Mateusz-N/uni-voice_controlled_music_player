import { useEffect, useState } from 'react';

import { requestGetArtistDetails } from 'common/serverRequests';

import ItemDetailsModal from 'components/generic/ItemDetailsModal';

const ArtistDetailsModal = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [extraDetails, setExtraDetails] = useState({});
    // #endregion

    // #region Zmienne globalne
    const index = props.index;
    const artist = props.artist;
    const artistDetails = [{
        name: 'General information',
        items: [{
            displayName: 'Artist name',
            value: artist.name
        }, {
            displayName: 'Alternate names',
            value: extraDetails.namevariations ? extraDetails.namevariations.join(', ') : 'N/A'
        }, {
            displayName: 'Spinoffs',
            value: extraDetails.aliases ? extraDetails.aliases.map(alias => alias.name).join(', ') : 'N/A'
        }, {
            displayName: 'Current members',
            value: extraDetails.members ? extraDetails.members.filter(member => member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Past members',
            value: extraDetails.members ? extraDetails.members.filter(member => !member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Genres',
            value: artist.genres ? artist.genres.join(', ') : 'N/A'
        }, {
            displayName: 'Profile',
            value: extraDetails.profile || 'N/A'
        }]
    }];
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        requestGetArtistDetails(artist.name, (data) => {
            setExtraDetails(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ItemDetailsModal index = {index} itemType = 'artist' details = {artistDetails} onClose = {props.onClose} />
    );
    // #endregion
}

export default ArtistDetailsModal;