import { millisecondsToFormattedTime } from 'common/auxiliaryFunctions';

import placeholderAlbumCoverSrc from 'resources/albumCover_placeholder.png';

export const placeholderPlaylist = {
    id: -1,
    name: 'Unknown playlist',
    thumbnailSrc: placeholderAlbumCoverSrc,
    description: '',
    totalDuration_ms: 'N/A',
    artists: [],
    tracks: [],
    saved: null,
    owner: 'N/A',
    public: 'N/A',
    detailsToDisplay: [{
        name: 'Name',
        content: '',
        editable: false,
        showSeparately: true,
        input: {
            type: 'text',
            attributes: {placeholder: 'Playlist name'},
            excludeControls: false,
            children: {}
        }
    }, {
        name: 'Track count',
        content: 0,
        editable: false,
        showSeparately: false,
        input: {
            type: 'number',
            attributes: {},
            excludeControls: false,
            children: {}
        }
    }, {
        name: 'Total Duration',
        content: millisecondsToFormattedTime(0),
        editable: false,
        showSeparately: false,
        input: {
            type: 'number',
            attributes: {},
            excludeControls: false,
            children: {}
        }
    }, {
        name: 'Owner',
        content: 'N/A',
        editable: false,
        showSeparately: false,
        input: {
            type: 'text',
            attributes: {},
            excludeControls: false,
            children: {}
        }
    }, {
        name: 'Public',
        content: 'N/A',
        editable: false,
        showSeparately: false,
        input: {
            type: 'select',
            attributes: {},
            excludeControls: false,
            children: {}
        }
    }, {
        name: 'Description',
        content: '',
        editable: false,
        showSeparately: true,
        input: {
            type: 'textarea',
            attributes: {placeholder: 'Playlist description'},
            excludeControls: false,
            children: {}
        }
    }]
};

export const placeholderAlbum = {
    id: -1,
    name: 'Unknown album',
    thumbnailSrc: placeholderAlbumCoverSrc,
    totalDuration_ms: 0,
    artists: [],
    tracks: [],
    releaseDate: 'N/A',
    detailsToDisplay: [{
        name: 'Name',
        content: '',
        showSeparately: true
    }, {
        name: 'Track count',
        content: 0,
        showSeparately: false
    }, {
        name: 'Total Duration',
        content: millisecondsToFormattedTime(0),
        showSeparately: false
    }, {
        name: 'Artist(s)',
        content: 'N/A',
        showSeparately: false
    }, {
        name: 'Released',
        content: 'N/A',
        showSeparately: false
    }, {
        name: 'Description',
        content: '',
        showSeparately: true
    }]
};

export const placeholderArtist = {
    id: -1,
    name: 'Unknown artist',
    thumbnailSrc: placeholderAlbumCoverSrc,
    genres: [],
    followers: 'N/A',
    popularity: 'N/A',
    detailsToDisplay: [{
        name: 'Name',
        content: '',
        showSeparately: true
    }, {
        name: 'Genres',
        content: 'N/A',
        showSeparately: false
    }, {
        name: 'Followers',
        content: 'N/A',
        showSeparately: false
    }, {
        name: 'Popularity',
        content: 'N/A',
        showSeparately: false
    }, {
        name: 'Description',
        content: '',
        showSeparately: true
    }]
};