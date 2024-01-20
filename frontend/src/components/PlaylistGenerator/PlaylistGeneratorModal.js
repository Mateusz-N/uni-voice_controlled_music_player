import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

import { toVoiceCommand } from 'common/auxiliaryFunctions';
import { requestGetRecommendations } from 'common/serverRequests';

import Modal from 'components/generic/Modal';
import InputFieldsetMinMaxTarget from 'components/PlaylistGenerator/InputFieldsetMinMaxTarget';
import FormControlSection from 'components/generic/FormControlSection';
import ChipBox from 'components/generic/ChipBox';
import SeedSearchModal from 'components/PlaylistGenerator/SeedSearchModal';
import Toast from 'components/generic/Toast';

import Styles from 'components/PlaylistGenerator/PlaylistGeneratorModal.module.scss';

const PlaylistGeneratorModal = (props) => {
    // #region Zmienne globalne
    const addSeed = props.addSeed;
    const seedType = props.seedType;
    const searchedSeed = props.searchedSeed;
    const defaultSearchQuery = props.defaultSearchQuery;
    const minMaxTargetFields = [{
        name: 'acousticness',
        displayName: 'Acousticness',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'danceability',
        displayName: 'Danceability',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'track_duration_ms',
        displayName: 'Track Duration (min)',
        min: 0,
        max: 9999,
        step: 1
    },{
        name: 'energy',
        displayName: 'Energy',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'instrumentalness',
        displayName: 'Instrumentalness',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'key',
        displayName: 'Key',
        min: 0,
        max: 11,
        step: 1
    },{
        name: 'liveness',
        displayName: 'Liveness',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'loudness',
        displayName: 'Loudness',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'mode',
        displayName: 'Mode',
        min: 0,
        max: 1,
        step: 1
    },{
        name: 'popularity',
        displayName: 'Popularity',
        min: 0,
        max: 100,
        step: 1
    },{
        name: 'speechiness',
        displayName: 'Speechiness',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'tempo',
        displayName: 'Tempo',
        min: 0,
        max: 1,
        step: 0.01
    },{
        name: 'time_signature',
        displayName: 'Time signature',
        min: 0,
        max: 11,
        step: 1
    },{
        name: 'valence',
        displayName: 'Valence',
        min: 0,
        max: 1,
        step: 0.01
    }];
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [parameters, setParameters] = useState({});
    const [seeds, setSeeds] = useState([]);
    const [seedSearchModalOpen, setSeedSearchModalOpen] = useState(false);
    const [defaultFormAction, setDefaultFormAction] = useState(props.defaultFormAction);
    const [notification, setNotification] = useState({});
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_form_playlistGenerator = useRef(null);
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleSubmitPlaylistGeneratorForm = (event) => {
        if(!ref_form_playlistGenerator.current.checkValidity()) {
            ref_form_playlistGenerator.current.reportValidity();
        }
        event.preventDefault();
        if(seeds.length === 0) {
            setNotification({message: 'You must add at least one seed!', type: 'error'});
            props.onCloseModalFail();
            return;
        }
        const recommendationsURL = new URL(`${process.env.REACT_APP_SERVER_URL}/spotify/recommendations`);
        ['Artist', 'Genre', 'Track'].forEach(seedType => {
            const seedSet = seeds.filter(seed => seed.type === seedType).map(seed => seed.id).join(',');
            if(seedSet.length > 0) {
                recommendationsURL.searchParams.set('seed_' + seedType.toLowerCase() + 's', seedSet);
            }
        });
        Object.keys(parameters).forEach(parameter => recommendationsURL.searchParams.set(parameter, parameters[parameter]));
        requestGetRecommendations(recommendationsURL, (data) => {
            props.onSubmit(data.tracks);
        })
    }
    const handleCancelPlaylistGeneratorForm = () => {
        props.onCancel();
    }
    const handleAddSeed = () => {
        if(seeds.length >= 5) {
            setNotification({message: 'Cannot add any more seeds! The maximum is 5.', type: 'error'});
            return;
        }
        setSeedSearchModalOpen(true);
    }
    const handleRemoveSeed = (seedID) => {
        setSeeds(prevState => prevState.filter(seed => seed.id !== seedID));
        props.onRemoveSeed();
    }
    const handleRemoveSeedByIdentifier = (identifier) => {
        setSeeds(prevState => prevState.filter(seed => {
            if(isNaN(identifier)) {
                return toVoiceCommand(seed.text) !== identifier;
            }
            return seed !== seeds[parseInt(identifier) - 1];
        }));
        props.onRemoveSeed();
    }
    const handleCancelAddSeedSearch = () => {
        setDefaultFormAction(null);
        props.onAddSeed();
        setSeedSearchModalOpen(false);
    }
    const handleSubmitAddSeedSearch = (seedID, seedName, seedType) => {
        setDefaultFormAction(null);
        props.onAddSeed();
        setSeedSearchModalOpen(false);
        setSeeds(prevState => [...prevState, {id: seedID, type: seedType, text: seedType + ': ' + seedName}]);
    }
    const handleUpdateParameters = (parameter) => {
        const parameterName = Object.keys(parameter)[0];
        let parameterValue = Object.values(parameter)[0];
        if(parameterName.includes('track_duration_ms')) {
            parameterValue *= 60000;
        }
        setParameters(prevState => ({...prevState, [parameterName]: parameterValue}));
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(addSeed) {
            handleAddSeed();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[addSeed]);
    useEffect(() => {
        handleRemoveSeedByIdentifier(props.removeSeed);
    },[props.removeSeed])
    useEffect(() => {
        setDefaultFormAction(props.defaultFormAction);
    },[props.defaultFormAction])
    // #endregion

    // #region Przypisanie dynamicznych elementów komponentu
    let seedSearchModal = null;
    if(seedSearchModalOpen) {
        seedSearchModal =
            createPortal(<SeedSearchModal
                seeds = {seeds}
                seedType = {seedType}
                searchedSeed = {defaultSearchQuery}
                defaultAction = {defaultFormAction}
                onSubmit = {(seedID, seedName, seedType) => handleSubmitAddSeedSearch(seedID, seedName, seedType)}
                onCancel = {handleCancelAddSeedSearch}
            />, document.body);
    }
    let toastNotification = null;
    if(notification.message) {
        toastNotification =
            createPortal(<Toast message = {notification.message} type = {notification.type} onAnimationEnd = {() => setNotification({})} />, document.body);
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <>
            {toastNotification}
            <Modal title = 'Generate playlist...' id = 'playlistGenerator' styles = {Styles} onClose = {handleCancelPlaylistGeneratorForm}>
                <form id = {Styles.form_playlistGenerator} ref = {ref_form_playlistGenerator}>
                    <main id = {Styles.form_playlistGeneratorMain}>
                        <section className = {Styles.form_playlistGeneratorSection} id = {Styles.form_playlistGeneratorSection_parameters}>
                            <h3 className = {Styles.form_playlistGeneratorSection_heading}>Parameters</h3>
                            <main className = {Styles.form_playlistGeneratorSection_main} id = {Styles.form_playlistGenerator_parameterContainer}>
                                {minMaxTargetFields.map((field, index) => {
                                    return(
                                        <InputFieldsetMinMaxTarget
                                            key = {index}
                                            fieldsetName = {field.name}
                                            fieldsetLegend = {field.displayName}
                                            inputName = {field.name}
                                            min = {field.min}
                                            max = {field.max}
                                            step = {field.step}
                                            styles = {Styles}
                                            onChange = {(parameter) => handleUpdateParameters(parameter)}
                                        />
                                    );
                                })}
                            </main>
                        </section>
                        <section className = {Styles.form_playlistGeneratorSection} id = {Styles.form_playlistGeneratorSection_seeds}>
                            <h3 className = {Styles.form_playlistGeneratorSection_heading}>Seeds <span className = 'requiredFieldSymbol'>*</span></h3>
                            <main className = {Styles.form_playlistGeneratorSection_main} id = {Styles.form_playlistGenerator_seedChipBox}>
                                <ChipBox
                                    chips = {seeds}
                                    placeholder = 'Add at least one and up to 5 different seeds.'
                                    context = 'playlistGenerator_seeds'
                                    styles = {Styles}
                                    onAddChip = {handleAddSeed}
                                    onRemoveChip = {handleRemoveSeed}
                                />
                            </main>
                        </section>
                    </main>
                    <FormControlSection
                        context = 'playlistGenerator'
                        defaultAction = {seedSearchModalOpen ? null : defaultFormAction}
                        onSubmit = {handleSubmitPlaylistGeneratorForm}
                        onCancel = {handleCancelPlaylistGeneratorForm}
                        styles = {Styles}
                    />
                </form>
            </Modal>
            {seedSearchModal}
        </>
    );
    // #endregion
}

export default PlaylistGeneratorModal;