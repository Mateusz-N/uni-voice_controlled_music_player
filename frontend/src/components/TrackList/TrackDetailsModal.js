import { useEffect, useState } from 'react';

import { millisecondsToFormattedTime, processUnorganizedItemDetails } from 'common/auxiliaryFunctions';
import { requestGetTrackDetails } from 'common/serverRequests';

import ItemDetailsModal from 'components/generic/ItemDetailsModal';

const TrackDetailsModal = (props) => {
    // #region Zmienne stanu (useState Hooks)
    const [extraDetails, setExtraDetails] = useState({});
    // #endregion

    // #region Zmienne globalne
    const index = props.index;
    const track = props.track;
    const album = props.album ? props.album : track.album;
    const albumReleaseDate = props.album ? album.releaseDate : album.release_date;
    const trackDetails = [{
        name: 'General information',
        items: [{
            displayName: 'Title',
            value: track.title
        }, {
            displayName: 'Artist(s)',
            value: track.artists ? track.artists.map(artist => artist.name).join(', ') : 'N/A'
        }, {
            displayName: 'Album',
            value: track.album ? track.album.name : 'N/A'
        }, {
            displayName: 'Release date',
            value: track.album ? new Date(track.album.release_date).toLocaleDateString('en-US', {year: 'numeric', month: 'short', day: 'numeric'}) : 'N/A'
        }, {
            displayName: 'Duration',
            value: millisecondsToFormattedTime(track.duration_ms)
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
    processUnorganizedItemDetails(extraDetails.companies, 'entity_type_name', 'Credits', trackDetails);
    processUnorganizedItemDetails(extraDetails.extraartists, 'role', 'Personnel', trackDetails);
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(track.artists && track.artists.length > 0 && albumReleaseDate) {
            requestGetTrackDetails(track.title, track.artists[0].name, albumReleaseDate.split('-').shift(), (data) => {
                setExtraDetails(data);
            });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ItemDetailsModal index = {index} itemType = 'track' details = {trackDetails} onClose = {props.onClose} />
    );
    // #endregion
}

export default TrackDetailsModal;