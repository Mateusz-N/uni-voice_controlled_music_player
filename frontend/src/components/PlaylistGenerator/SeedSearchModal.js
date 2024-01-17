import { useState, useEffect } from 'react';

import { requestGetAvailableGenres, requestSearch } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import Select from 'components/generic/Select';
import SearchBar from 'components/generic/SearchBar';
import ListBox from 'components/generic/ListBox';

import Styles from 'components/PlaylistGenerator/SeedSearchModal.module.scss';

const SeedSearchModal = (props) => {
    // #region Zmienne globalne
    const seeds = props.seeds;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [selectedSeedType, setSelectedSeedType] = useState('Artist');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState({results: [], seedType: null});
    const [searchSwitch, setSearchSwitch] = useState(false);
    const [searchLoading, setSearchLoading] = useState(false);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleCancelAddSeedForm = () => {
        props.onCancel();
    }
    const handleUpdateSeedType = (type) => {
        setSelectedSeedType(type);
    }
    const handleSubmitSeedSearch = (query) => {
        setSearchQuery(query);
        setSearchSwitch(prevState => !prevState);
    }
    const handleSelectSeed = (seedID) => {
        const seed = searchResults.results.find(result => result.id === seedID);
        props.onSubmit(seed.id, seed.name, searchResults.seedType);
    }
    const handleGetAvailableGenresApiResponse = (data) => {
        const genres = data.map(genre => ({id: genre, name: genre}));
        setSearchResults({
            results: genres.filter(genre => genre.name.includes(searchQuery) && !seeds.find(seed => (seed.id === genre.id && seed.type === selectedSeedType))),
            seedType: 'Genre'
        });
    }
    const handleSearchApiResponse = (data) => {
        setSearchResults({
            results: data[selectedSeedType.toLowerCase()].filter(result => !seeds.find(seed => (seed.id === result.id && seed.type === selectedSeedType))),
            seedType: selectedSeedType
        });
    }
    // #endregion
    
    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(selectedSeedType.toLowerCase() === 'genre') {
            setSearchLoading(true);
            requestGetAvailableGenres(handleGetAvailableGenresApiResponse, () => setSearchLoading(false));
        }
        else {
            setSearchLoading(true);
            requestSearch(searchQuery.length > 0 ? searchQuery : '.', selectedSeedType, handleSearchApiResponse, () => setSearchLoading(false));
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[searchSwitch]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Modal title = 'Add seed...' id = 'addSeedSearch' styles = {Styles} onClose = {handleCancelAddSeedForm}>
            <main id = {Styles.main_seedSearchModal}>
                <section id = {Styles.field_seedType}>
                    <span>Type:</span>
                    <Select
                        id = {Styles.select_seedType}
                        name = 'seedType'
                        defaultValue = {selectedSeedType}
                        children = {[{
                            option: {
                                attributes: {
                                    name: 'artist',
                                    value: 'artist'
                                },
                                content: 'Artist'
                        }}, {
                            option: {
                                attributes: {
                                    name: 'genre',
                                    value: 'genre'
                                },
                                content: 'Genre'
                            }
                        }, {
                            option: {
                                attributes: {
                                    name: 'track',
                                    value: 'track'
                                },
                                content: 'Track'
                            }
                        }]}
                        onSelection = {(selectedValue) => handleUpdateSeedType(selectedValue)}
                    />
                </section>
                <SearchBar onSubmit = {(query) => handleSubmitSeedSearch(query)} />
                <ListBox
                    options = {searchResults.results}
                    multiple = {false}
                    size = {searchResults.results.length > 5 ? 5 : searchResults.results.length}
                    loading = {searchLoading}
                    onSelection = {(selectedSeedID) => handleSelectSeed(selectedSeedID)}
                />
            </main>
        </Modal>
    );
    // #endregion
}

export default SeedSearchModal;