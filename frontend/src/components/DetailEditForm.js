import { useRef } from 'react';

const DetailEditForm = (props) => {
    const ExternalStyles = props.styles;

    const input = useRef(null);

    return(
        <form id = {ExternalStyles['form_' + props.detail]} onSubmit = {event => props.onSubmit(event, input)}>
            <input
                id = {ExternalStyles['input_' + props.detail]}
                name = 'itemName'
                defaultValue = {props.defaultValue}
                min = '1'
                max = '127'
                ref = {input}
            />
            <section className = 'formControlSection'>
                <button id = {ExternalStyles['btnCancel_' + props.detail]} className = 'btnSecondary' onClick = {event => props.onCancel(event)} type = 'button'>Cancel</button>
                <button id = {ExternalStyles['btnSubmit_' + props.detail]} className = 'btnPrimary' onClick = {event => props.onSubmit(event, input)}>Apply</button>
            </section>
        </form>
    );
}

export default DetailEditForm;