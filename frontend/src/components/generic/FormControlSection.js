import Styles from 'components/generic/FormControlSection.module.scss';

const FormControlSection = (props) => {
    const context = props.context;
    const ExternalStyles = props.styles;

    return(
        <section className = {Styles.formControlSection}>
            <button
                id = {ExternalStyles['btnCancel_' + context]}
                className = {ExternalStyles.btnCancel + ' ' + Styles.btnCancel + ' btnSecondary'}
                onClick = {props.onCancel}
                type = 'button'>
                Cancel
            </button>
            <button
                id = {ExternalStyles['btnSubmit_' + context]}
                className = {ExternalStyles.btnSubmit + ' ' + Styles.btnSubmit + ' btnPrimary'}
                onClick = {props.onSubmit}>
                Apply
            </button>
        </section>
    );
}

export default FormControlSection;