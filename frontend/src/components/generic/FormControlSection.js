import { useEffect, useRef } from 'react';

import Styles from 'components/generic/FormControlSection.module.scss';

const FormControlSection = (props) => {
    // #region Zmienne globalne
    const context = props.context;
    const defaultAction = props.defaultAction;
    const ExternalStyles = props.styles;
    // #endregion

    // #region Zmienne referencji (useRef Hooks)
    const ref_btnCancel = useRef(null);
    const ref_btnSubmit = useRef(null);
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'submit') {
            ref_btnSubmit.current.click();
            return;
        }
        if(defaultAction === 'cancel') {
            ref_btnCancel.current.click();
            return;
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <section className = {Styles.formControlSection}>
            <button
                id = {ExternalStyles['btnCancel_' + context]}
                className = {ExternalStyles.btnCancel + ' ' + Styles.btnCancel + ' btnSecondary'}
                onClick = {props.onCancel}
                type = 'button'
                ref = {ref_btnCancel}>
                Cancel
            </button>
            <button
                id = {ExternalStyles['btnSubmit_' + context]}
                className = {ExternalStyles.btnSubmit + ' ' + Styles.btnSubmit + ' btnPrimary'}
                onClick = {props.onSubmit}
                ref = {ref_btnSubmit}>
                Apply
            </button>
        </section>
    );
    // #endregion
}

export default FormControlSection;