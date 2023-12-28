import { useState } from 'react';

const DetailEditForm = (props) => {
    const ExternalStyles = props.styles;

    const [detailValue, setDetailValue] = useState(props.defaultValue);

    const handleUpdateDetailValue = (event) => {
        setDetailValue(event.target.value)
    }

    return(
        <form id = {ExternalStyles['form_' + props.detail]} onSubmit = {event => props.onSubmit(event, detailValue)}>
            <input
                id = {ExternalStyles['input_' + props.detail]}
                name = 'itemName'
                type = {props.inputType}
                defaultValue = {props.defaultValue}
                onInput = {handleUpdateDetailValue}
                {...props.inputOptions}
            />
            <section className = 'formControlSection'>
                <button id = {ExternalStyles['btnCancel_' + props.detail]} className = 'btnSecondary' onClick = {event => props.onCancel(event)} type = 'button'>Cancel</button>
                <button id = {ExternalStyles['btnSubmit_' + props.detail]} className = 'btnPrimary' onClick = {event => props.onSubmit(event, detailValue)}>Apply</button>
            </section>
        </form>
    );
}

export default DetailEditForm;