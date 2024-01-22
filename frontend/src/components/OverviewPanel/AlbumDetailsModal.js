import { millisecondsToFormattedTime, processUnorganizedItemDetails } from 'common/auxiliaryFunctions';

import ItemDetailsModal from 'components/generic/ItemDetailsModal';

const AlbumDetailsModal = (props) => {
    // #region Zmienne globalne
    const defaultAction = props.defaultAction;
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
            value: (album.extraDetails && album.extraDetails.genres) ? album.extraDetails.genres.join(', ') : 'N/A'
        }, {
            displayName: 'Styles',
            value: (album.extraDetails && album.extraDetails.styles) ? album.extraDetails.styles.join(', ') : 'N/A'
        }, {
            displayName: 'Label(s)',
            value: (album.extraDetails && album.extraDetails.labels) ? album.extraDetails.labels.map(label => label.name).join(', ') : 'N/A'
        }]
    }];
    if(album.extraDetails) {
        processUnorganizedItemDetails(album.extraDetails.companies, 'entity_type_name', 'Credits', albumDetails);
        processUnorganizedItemDetails(album.extraDetails.extraartists, 'role', 'Personnel', albumDetails);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ItemDetailsModal index = {index} itemType = 'album' details = {albumDetails} defaultAction = {defaultAction} onClose = {props.onClose} />
    );
    // #endregion
}

export default AlbumDetailsModal;