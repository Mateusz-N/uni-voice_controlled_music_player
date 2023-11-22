import NavBar from '../components/NavBar';
import PlaybackPanel from '../components/PlaybackPanel';
import CatalogBrowser from '../components/CatalogBrowser';
import TrackList from '../components/TrackList';
import PlaylistOverview from '../components/PlaylistOverview';

import placeholderAlbumCoverSrc from '../resources/albumCover_placeholder.png';
import placeholderProfilePicSrc from '../resources/profilePic_placeholder.png';

const Album = () => {

    const sampleSongs = [{ id: "aR5rHG1", title: "Song 1", artists: ["Artist 1"], album: {coverSrc: placeholderAlbumCoverSrc, name: "Album 1"}, year: 1995, genre: "rock", duration: 240000, added: new Date("2023-07-01") },
    { id: "aR5rHG2", title: "Song 222222222222222222222222222222222222", artists: ["Artist 2222222222222222222222222222"], album: {coverSrc: placeholderAlbumCoverSrc, name: "Album 232ff3322343235564351"}, year: 20082222222222222222222222222222, genre: "pop2222222222222222222222222222", duration: 1800002222222222222222222222222222, added: new Date("2023-07-02") },
    { id: "aR5rHG3", title: "Song 3", artists: ["Artist 3"], album: "Album 3", year: 2012, genre: "hip-hop", duration: 200000, added: new Date("2023-07-03") },
    { id: "aR5rHG4", title: "Song 4", artists: ["Artist 4"], album: "Album 4", year: 2001, genre: "jazz", duration: 300000, added: new Date("2023-07-04") },
    { id: "aR5rHG5", title: "Song 5", artists: ["Artist 5"], album: "Album 5", year: 1998, genre: "rock", duration: 220000, added: new Date("2023-07-05") },
    { id: "aR5rHG6", title: "Song 6", artists: ["Artist 6"], album: "Album 6", year: 2015, genre: "pop", duration: 190000, added: new Date("2023-07-06") },
    { id: "aR5rHG7", title: "Song 7", artists: ["Artist 7"], album: "Album 7", year: 2003, genre: "rock", duration: 260000, added: new Date("2023-07-07") },
    { id: "aR5rHG8", title: "Song 8", artists: ["Artist 8"], album: "Album 8", year: 2010, genre: "hip-hop", duration: 180000, added: new Date("2023-07-08") },
    { id: "aR5rHG9", title: "Song 9", artists: ["Artist 9"], album: "Album 9", year: 1997, genre: "jazz", duration: 320000, added: new Date("2023-07-09") },
    { id: "aR5rHG10", title: "Song 10", artists: ["Artist 10"], album: "Album 10", year: 2005, genre: "pop", duration: 170000, added: new Date("2023-07-10") },
    { id: "aR5rHG11", title: "Song 11", artists: ["Artist 11"], album: "Album 11", year: 1999, genre: "rock", duration: 250000, added: new Date("2023-07-11") },
    { id: "aR5rHG12", title: "Song 12", artists: ["Artist 12"], album: "Album 12", year: 2011, genre: "hip-hop", duration: 210000, added: new Date("2023-07-12") },
    { id: "aR5rHG13", title: "Song 13", artists: ["Artist 13"], album: "Album 13", year: 2002, genre: "pop", duration: 240000, added: new Date("2023-07-13") },
    { id: "aR5rHG14", title: "Song 14", artists: ["Artist 14"], album: "Album 14", year: 1996, genre: "jazz", duration: 280000, added: new Date("2023-07-14") },
    { id: "aR5rHG15", title: "Song 15", artists: ["Artist 15"], album: "Album 15", year: 2007, genre: "rock", duration: 230000, added: new Date("2023-07-15") },
    { id: "aR5rHG16", title: "Song 16", artists: ["Artist 16"], album: "Album 16", year: 2013, genre: "hip-hop", duration: 200000, added: new Date("2023-07-16") },
    { id: "aR5rHG17", title: "Song 17", artists: ["Artist 17"], album: "Album 17", year: 2004, genre: "pop", duration: 260000, added: new Date("2023-07-17") },
    { id: "aR5rHG18", title: "Song 18", artists: ["Artist 18"], album: "Album 18", year: 2014, genre: "rock", duration: 180000, added: new Date("2023-07-18") },
    { id: "aR5rHG19", title: "Song 19", artists: ["Artist 19"], album: "Album 19", year: 2009, genre: "jazz", duration: 300000, added: new Date("2023-07-19") },
    { id: "aR5rHG20", title: "Song 20", artists: ["Artist 20"], album: "Album 20", year: 1998, genre: "pop", duration: 210000, added: new Date("2023-07-20") },
    { id: "aR5rHG21", title: "Song 21", artists: ["Artist 21"], album: "Album 21", year: 2010, genre: "rock", duration: 240000, added: new Date("2023-07-21") },
    { id: "aR5rHG22", title: "Song 22", artists: ["Artist 22"], album: "Album 22", year: 2006, genre: "hip-hop", duration: 190000, added: new Date("2023-07-22") },
    { id: "aR5rHG23", title: "Song 23", artists: ["Artist 23"], album: "Album 23", year: 1997, genre: "pop", duration: 270000, added: new Date("2023-07-23") },
    { id: "aR5rHG24", title: "Song 24", artists: ["Artist 24"], album: "Album 24", year: 2012, genre: "jazz", duration: 220000, added: new Date("2023-07-24") },
    { id: "aR5rHG25", title: "Song 25", artists: ["Artist 25"], album: "Album 25", year: 2001, genre: "rock", duration: 230000, added: new Date("2023-07-25") },
    { id: "aR5rHG26", title: "Song 26", artists: ["Artist 26"], album: "Album 26", year: 2005, genre: "hip-hop", duration: 250000, added: new Date("2023-07-26") },
    { id: "aR5rHG27", title: "Song 27", artists: ["Artist 27"], album: "Album 27", year: 1999, genre: "pop", duration: 200000, added: new Date("2023-07-27") },
    { id: "aR5rHG28", title: "Song 28", artists: ["Artist 28"], album: "Album 28", year: 2011, genre: "rock", duration: 280000, added: new Date("2023-07-28") },
    { id: "aR5rHG29", title: "Song 29", artists: ["Artist 29"], album: "Album 29", year: 2003, genre: "jazz", duration: 180000, added: new Date("2023-07-29") },
    { id: "aR5rHG30", title: "Song 30", artists: ["Artist 30"], album: "Album 30", year: 2014, genre: "pop", duration: 240000, added: new Date("2023-07-30") },
    { id: "aR5rHG31", title: "Song 31", artists: ["Artist 31"], album: "Album 31", year: 2002, genre: "rock", duration: 260000, added: new Date("2023-07-31") },
    { id: "aR5rHG32", title: "Song 32", artists: ["Artist 32"], album: "Album 32", year: 2015, genre: "hip-hop", duration: 190000, added: new Date("2023-08-01") },
    { id: "aR5rHG33", title: "Song 33", artists: ["Artist 33"], album: "Album 33", year: 2004, genre: "jazz", duration: 220000, added: new Date("2023-08-02") },
    { id: "aR5rHG34", title: "Song 34", artists: ["Artist 34"], album: "Album 34", year: 2013, genre: "pop", duration: 260000, added: new Date("2023-08-03") },
    { id: "aR5rHG35", title: "Song 35", artists: ["Artist 35"], album: "Album 35", year: 1996, genre: "rock", duration: 180000, added: new Date("2023-08-04") },
    { id: "aR5rHG36", title: "Song 36", artists: ["Artist 36"], album: "Album 36", year: 2006, genre: "hip-hop", duration: 280000, added: new Date("2023-08-05") },
    { id: "aR5rHG37", title: "Song 37", artists: ["Artist 37"], album: "Album 37", year: 1997, genre: "pop", duration: 230000, added: new Date("2023-08-06") },
    { id: "aR5rHG38", title: "Song 38", artists: ["Artist 38"], album: "Album 38", year: 2012, genre: "rock", duration: 240000, added: new Date("2023-08-07") },
    { id: "aR5rHG39", title: "Song 39", artists: ["Artist 39"], album: "Album 39", year: 1998, genre: "jazz", duration: 300000, added: new Date("2023-08-08") },
    { id: "aR5rHG40", title: "Song 40", artists: ["Artist 40"], album: "Album 40", year: 2007, genre: "pop", duration: 190000, added: new Date("2023-08-09") },
    { id: "aR5rHG41", title: "Song 41", artists: ["Artist 41"], album: "Album 41", year: 1999, genre: "rock", duration: 250000, added: new Date("2023-08-10") }];
    const playlist = {id: 'ABC123', artists: ["Artist1", "Artist2"], thumbnailSrc: placeholderAlbumCoverSrc, name: 'playlist2', description: 'Lorem ipsum dolor sit amet. Eos corporis natus ut incidunt quas eos placeat excepturi qui Quis suscipit ut illum mollitia? Et debitis nobis qui dolores maxime est galisum placeat sed explicabo pariatur ut saepe Quis. Et ratione quam hic dolor cupiditate qui cupiditate quam. Qui veritatis libero et tenetur aperiam qui omnis dolorum aut perspiciatis nemo non temporibus delectus. In voluptates soluta non beatae temporibus est vero mollitia rem debitis pariatur. Qui quia voluptas ut voluptatum esse qui perspiciatis voluptate et labore debitis ut perspiciatis quia sed enim Quis! Ut autem magni sit provident amet qui voluptatem quia eos sint perferendis. Quo sint aspernatur est nostrum ducimus a eveniet temporibus et alias quibusdam ut quia consequatur.',
    totalDuration: 4323432, tracks: sampleSongs, releaseDate: new Date()};

    return (
        <div id = 'page'>
            <NavBar loggedUser = {{
                name: 'User',
                profilePic: placeholderProfilePicSrc
            }}
            ></NavBar>
            <CatalogBrowser className = 'playlistBrowser'>
                <TrackList tracks = {playlist.tracks} for = 'album'>
                </TrackList>
                <PlaylistOverview playlist = {playlist} for = 'album'>
                </PlaylistOverview>
            </CatalogBrowser>
            <PlaybackPanel track =
                {{
                duration_ms: '15000',
                trackTitle: 'Song',
                artists: ['Artist'],
                albumTitle: 'Album',
                albumCoverSrc: placeholderAlbumCoverSrc
                }}
            ></PlaybackPanel>
        </div>
    );
}

export default Album;