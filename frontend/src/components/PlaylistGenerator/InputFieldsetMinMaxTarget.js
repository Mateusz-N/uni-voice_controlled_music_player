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
    const ExternalStyles = props.styles;
    // #endregion

    // #region Obsługa zdarzeń (Event Handlers)
    const handleInput = (event) => {
        props.onChange({[event.target.name]: event.target.value});
    }
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <InputFieldset name = {fieldsetName} legend = {fieldsetLegend} styles = {ExternalStyles} className = {ExternalStyles.inputFieldset_minMaxTarget}>
            <InputSection inputName = {inputName + 'Min'} label = 'Min' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'min_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Min']}
                    onInput = {(event) => handleInput(event)}
                />
            </InputSection>
            <InputSection inputName = {inputName + 'Target'} label = 'Target' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'target_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Target']}
                    onInput = {(event) => handleInput(event)}
                />
            </InputSection>
            <InputSection inputName = {inputName + 'Max'} label = 'Max' styles = {ExternalStyles}>
                <input
                    type = 'number'
                    min = {min}
                    max = {max}
                    step = {step}
                    name = {'max_' + inputName}
                    id = {ExternalStyles['input_' + inputName + 'Max']}
                    onInput = {(event) => handleInput(event)}
                />
            </InputSection>
        </InputFieldset>
    );
    // #endregion
}

export default InputFieldsetMinMaxTarget;