import icon_search from 'resources/icon_search.svg';

import Styles from 'components/SearchBar.module.scss';

const SearchBar = () => {
    // #region Struktura komponentu (JSX)
    return(
        <div id = {Styles.searchBar}>
            <input id = {Styles.searchInput} placeholder = 'Search for track, artist, album or playlist...' />
            <img id = {Styles.searchIcon} src = {icon_search} alt = 'Search' />
        </div>
    );
    // #endregion
}

export default SearchBar;