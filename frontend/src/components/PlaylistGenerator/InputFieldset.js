import Styles from 'components/PlaylistGenerator/InputFieldset.module.scss';

const InputFieldset = (props) => {
    const children = props.children;
    const fieldsetName = props.name;
    const legend = props.legend;
    const ExternalStyles = props.styles;
    const extraClassNames = props.className;

    return(
        <fieldset className = {Styles.inputFieldset +  ' ' + extraClassNames} id = {ExternalStyles['inputFieldset_' + fieldsetName]}>
            <legend className = {Styles.inputFieldsetLegend} id = {ExternalStyles['inputFieldsetLegend_' + fieldsetName]}>{legend}</legend>
            {children}
        </fieldset>
    );
}

export default InputFieldset;