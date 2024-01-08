import Styles from 'components/PlaylistGenerator/InputSection.module.scss';

const InputSection = (props) => {
    // #region Zmienne globalne
    const children = props.children;
    const inputName = props.inputName;
    const inputLabel = props.label;
    const ExternalStyles = props.styles;
    const inputID = ExternalStyles['input_' + inputName];
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <section className = {Styles.inputSection} id = {ExternalStyles['inputSection_' + inputName]}>
            <label htmlFor = {inputID}>{inputLabel}:</label>
            {children}
        </section>
    );
    // #endregion
}

export default InputSection;