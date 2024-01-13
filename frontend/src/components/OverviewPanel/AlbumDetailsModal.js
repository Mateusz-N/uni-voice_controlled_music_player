import { useEffect, useState } from 'react';

import { millisecondsToFormattedTime, processUnorganizedItemDetails } from 'common/auxiliaryFunctions';
import { requestGetAlbumDetails } from 'common/serverRequests';

import ItemDetailsModal from 'components/generic/ItemDetailsModal';

const AlbumDetailsModal = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [extraDetails, setExtraDetails] = useState({});
    // #endregion

    // #region Zmienne globalne
    const index = props.index;
    const album = props.album;
    const albumDetails = [{
        name: 'General information',
        items: [{
            displayName: 'Album name',
            value: album.name
        }, {
            displayName: 'Track count',
            value: album.tracks ? album.tracks.length : 'N/A'
        }, {
            displayName: 'Total duration',
            value: millisecondsToFormattedTime(album.totalDuration_ms)
        }, {
            displayName: 'Release date',
            value: album.releaseDate ? new Date(album.releaseDate).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A'
        }, {
            displayName: 'Artist(s)',
            value: album.artists ? album.artists.map(artist => artist.name).join(', ') : 'N/A'
        }, {
            displayName: 'Genres',
            value: extraDetails.genres ? extraDetails.genres.join(', ') : 'N/A'
        }, {
            displayName: 'Styles',
            value: extraDetails.styles ? extraDetails.styles.join(', ') : 'N/A'
        }, {
            displayName: 'Label(s)',
            value: extraDetails.labels ? extraDetails.labels.map(label => label.name).join(', ') : 'N/A'
        }]
    }];
    processUnorganizedItemDetails(extraDetails.companies, 'entity_type_name', 'Credits', albumDetails);
    processUnorganizedItemDetails(extraDetails.extraartists, 'role', 'Personnel', albumDetails);
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        requestGetAlbumDetails(album.name, (data) => {
            setExtraDetails(data);
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ItemDetailsModal index = {index} itemType = 'album' details = {albumDetails} onClose = {props.onClose} />
    );
    // #endregion
}

export default AlbumDetailsModal;