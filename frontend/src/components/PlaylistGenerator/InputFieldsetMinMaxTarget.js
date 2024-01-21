import { useState, useEffect, useRef } from 'react';

import InputFieldset from 'components/PlaylistGenerator/InputFieldset';
import InputSection from 'components/PlaylistGenerator/InputSection';

const InputFieldsetMinMaxTarget = (props) => {
    // #region Zmienne globalne
    const fieldsetName = props.fieldsetName;
    const fieldsetLegend = props.fieldsetLegend;
    const inputName = props.inputName;
    const min = props.min;
    const max = props.max;
    const step = props.step;
    const setParameter = props.setParameter || {name: '', value: ''};
    const ExternalStyles = props.styles;
    // #endregion

    // #region Zmienne stanu (useState Hooks)
    const [presetParameters, setPresetParameters] = useState([]);
    // #endregion

    const inputRefs = {
        ref_input_min: useRef(null),
        ref_input_target: useRef(null),
        ref_input_max: useRef(null)
    }

    // #region Obsługa zdarzeń (Event Handlers)
    const handleInput = (event) => {
        const presetParametersCopy = [...presetParameters];
        const matchedParameterIndex = getIndexOfMatchedParameter(matchParameterByName(event.target.name));
        presetParametersCopy.splice(matchedParameterIndex, 1);
        setPresetParameters(presetParametersCopy);
        props.onChange({[event.target.name]: event.target.value});
    }
    // #endregion

    // #region Funkcje pomocnicze
    const matchParameterByName = (name) => {
        return presetParameters.find(parameter => (parameter.name === name));
    }
    const getIndexOfMatchedParameter = (matchedParameter) => {
        return presetParameters.indexOf(matchedParameter);
    }
    const getMatchedParameterValue = (prefix) => {
        const matchedParameter = matchParameterByName(prefix + '_' + inputName);
        if(!matchedParameter) {
            return inputRefs['ref_input_' + prefix].current ? inputRefs['ref_input_' + prefix].current.value : '';
        }
        return matchedParameter.value;
    }
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(!setParameter.name.startsWith('min_') && !setParameter.name.startsWith('target_') && !setParameter.name.startsWith('max_')) {
            return;
        }
        const presetParametersCopy = [...presetParameters];
        const matchedParameterIndex = getIndexOfMatchedParameter(matchParameterByName(setParameter.name));
        if(matchedParameterIndex != null && matchedParameterIndex >= 0) {
            presetParametersCopy[matchedParameterIndex] = setParameter;
        }
        else {
            presetParametersCopy.push(setParameter);
        }
        setPresetParameters(presetParametersCopy);
    },[setParameter]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <InputFieldset name = {fieldsetName} legend = {fieldsetLegend} styles = {ExternalStyles} className = {ExternalStyles.inputFieldset_minMaxTarget}>
            <InputSection inputName = {inputName + 'Min'} label = 'Min' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    value = {getMatchedParameterValue('min')}
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'min_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Min']}
                    onInput = {(event) => handleInput(event)}
                    ref = {inputRefs.ref_input_min}
                />
            </InputSection>
            <InputSection inputName = {inputName + 'Target'} label = 'Target' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    value = {getMatchedParameterValue('target')}
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'target_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Target']}
                    onInput = {(event) => handleInput(event)}
                    ref = {inputRefs.ref_input_target}
                />
            </InputSection>
            <InputSection inputName = {inputName + 'Max'} label = 'Max' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    value = {getMatchedParameterValue('max')}
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'max_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Max']}
                    onInput = {(event) => handleInput(event)}
                    ref = {inputRefs.ref_input_max}
                />
            </InputSection>
        </InputFieldset>
    );
    // #endregion
}

export default InputFieldsetMinMaxTarget;