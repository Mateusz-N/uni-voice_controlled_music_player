import { useState, useRef } from 'react';

import Modal from 'components/generic/Modal';
import InputFieldsetMinMaxTarget from 'components/PlaylistGenerator/InputFieldsetMinMaxTarget';
import FormControlSection from 'components/generic/FormControlSection';
import ChipBox from 'components/generic/ChipBox';
import SeedSearchModal from 'components/PlaylistGenerator/SeedSearchModal';

import Styles from 'components/PlaylistGenerator/PlaylistGeneratorModal.module.scss';

const PlaylistGeneratorModal = (props) => {
    const [parameters, setParameters] = useState({});
    const [seeds, setSeeds] = useState([]);
    const [seedSearchModalOpen, setSeedSearchModalOpen] = useState(false);

    const ref_form_playlistGenerator = useRef(null);

    const handleSubmitPlaylistGeneratorForm = async (event) => {
        if(!ref_form_playlistGenerator.current.checkValidity()) {
            ref_form_playlistGenerator.current.reportValidity();
        }
        event.preventDefault();
        const recommendationsURL = new URL(`${process.env.REACT_APP_SERVER_URL}/spotify/recommendations`);
        ['Artist', 'Genre', 'Track'].forEach(seedType => {
            const seedSet = seeds.filter(seed => seed.type === seedType).map(seed => seed.id).join(',');
            if(seedSet.length > 0) {
                recommendationsURL.searchParams.set('seed_' + seedType.toLowerCase() + 's', seedSet);
            }
        });
        Object.keys(parameters).forEach(parameter => recommendationsURL.searchParams.set(parameter, parameters[parameter]));
        await fetch(recommendationsURL, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then((response) => {
                if(response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                props.onSubmit(data.tracks);
            })
            .catch(console.error);
    }
    const handleCancelPlaylistGeneratorForm = () => {
        props.onCancel();
    }
    const handleAddSeed = () => {
        if(seeds.length >= 5) {
            console.error('Cannot add any more seeds! The maximum is 5.');
            return;
        }
        setSeedSearchModalOpen(true);
    }
    const handleRemoveSeed = (seedID) => {
        setSeeds(prevState => prevState.filter(seed => seed.id !== seedID));
    }
    const handleCancelAddSeedSearch = () => {
        setSeedSearchModalOpen(false);
    }
    const handleSubmitAddSeedSearch = (seedID, seedName, seedType) => {
        setSeedSearchModalOpen(false);
        setSeeds(prevState => [...prevState, {id: seedID, type: seedType, text: seedType + ': ' + seedName}]);
    }
    const handleUpdateParameters = (parameter) => {
        const parameterName = Object.keys(parameter)[0];
        const parameterValue = Object.values(parameter)[0];
        if(parameterName.includes('track_duration_ms')) {
            parameterValue *= 60000;
        }
        setParameters(prevState => ({...prevState, [parameterName]: parameterValue}));
    }

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

    let seedSearchModal = null;
    if(seedSearchModalOpen) {
        seedSearchModal =
            <SeedSearchModal
                seeds = {seeds}
                onSubmit = {(seedID, seedName, seedType) => handleSubmitAddSeedSearch(seedID, seedName, seedType)}
                onCancel = {handleCancelAddSeedSearch}
            />
    }

    return(
        <>
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
                        onSubmit = {handleSubmitPlaylistGeneratorForm}
                        onCancel = {handleCancelPlaylistGeneratorForm}
                        styles = {Styles}
                    />
                </form>
            </Modal>
            {seedSearchModal}
        </>
    );
}

export default PlaylistGeneratorModal;