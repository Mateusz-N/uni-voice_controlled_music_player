import Styles from 'components/PlaylistGenerator/InputSection.module.scss';

const InputSection = (props) => {
    const children = props.children;
    const inputName = props.inputName;
    const inputLabel = props.label;
    const ExternalStyles = props.styles;
    const inputID = ExternalStyles['input_' + inputName];

    return(
        <section className = {Styles.inputSection} id = {ExternalStyles['inputSection_' + inputName]}>
            <label htmlFor = {inputID}>{inputLabel}:</label>
            {children}
        </section>
    );
}

export default InputSection;