import ItemDetailsModal from 'components/generic/ItemDetailsModal';

const ArtistDetailsModal = (props) => {
    // #region Zmienne globalne
    const defaultAction = props.defaultAction;
    const index = props.index;
    const artist = props.artist;
    const artistDetails = [{
        name: 'General information',
        items: [{
            displayName: 'Artist name',
            value: artist.name,
            testID: 'artistName'
        }, {
            displayName: 'Alternate names',
            value: (artist.extraDetails && artist.extraDetails.namevariations) ? artist.extraDetails.namevariations.join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Spinoffs',
            value: (artist.extraDetails && artist.extraDetails.aliases) ? artist.extraDetails.aliases.map(alias => alias.name).join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Current members',
            value: (artist.extraDetails && artist.extraDetails.members) ? artist.extraDetails.members.filter(member => member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Past members',
            value: (artist.extraDetails && artist.extraDetails.members) ? artist.extraDetails.members.filter(member => !member.active).map(member => member.name).join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Genres',
            value: artist.genres ? artist.genres.join(', ') || 'N/A' : 'N/A'
        }, {
            displayName: 'Profile',
            value: artist.extraDetails ? artist.extraDetails.profile || 'N/A' : 'N/A'
        }]
    }];
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ItemDetailsModal index = {index} itemType = 'artist' details = {artistDetails} defaultAction = {defaultAction} onClose = {props.onClose} />
    );
    // #endregion
}

export default ArtistDetailsModal;