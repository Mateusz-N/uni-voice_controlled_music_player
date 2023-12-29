import { useState, Fragment } from 'react';

const DetailEditForm = (props) => {
    const detailName = props.detail;
    const defaultValue = props.defaultValue;
    const inputType = props.inputType;
    const inputAttributes = props.inputAttributes;
    const inputChildren = props.inputChildren;
    const ExternalStyles = props.styles;

    const [detailValue, setDetailValue] = useState(defaultValue);

    const handleUpdateDetailValue = (newValue) => {
        setDetailValue(newValue);
    }

    let input =
        <input
            id = {ExternalStyles['input_' + detailName]}
            name = {detailName}
            type = {inputType}
            defaultValue = {defaultValue}
            onInput = {(event) => handleUpdateDetailValue(event.target.value)}
            {...inputAttributes}
        />
    if(inputType === 'select') {
        input =
            <select
                id = {ExternalStyles['input_' + detailName]}
                name = {detailName}
                onChange = {() => handleUpdateDetailValue(detailValue === 'yes' ? 'no' : 'yes')}
                {...inputAttributes}
            >
                {inputChildren.map((child, index) => {
                    const ChildFragment = Object.keys(child)[0];
                    return <ChildFragment key = {index} {...child[ChildFragment].attributes}>{child[ChildFragment].content}</ChildFragment>
                })}
            </select>
    }

    let formControlSection = null;
    if(!props.excludeControls) {
        formControlSection =
            <section className = 'formControlSection'>
                <button id = {ExternalStyles['btnCancel_' + detailName]} className = 'btnSecondary' onClick = {event => props.onCancel(event)} type = 'button'>Cancel</button>
                <button id = {ExternalStyles['btnSubmit_' + detailName]} className = 'btnPrimary' onClick = {event => props.onSubmit(event, detailValue)}>Apply</button>
            </section>
    }

    return(
        <form id = {ExternalStyles['form_' + detailName]} onSubmit = {event => props.onSubmit(event, detailValue)}>
            {input}
            {formControlSection}
        </form>
    );
}

export default DetailEditForm;