import { useState } from 'react';

import Select from 'components/generic/Select';

const DetailEditForm = (props) => {
    const detailName = props.detail;
    const defaultValue = props.defaultValue;
    const inputType = props.inputType;
    const inputAttributes = props.inputAttributes;
    const inputChildren = props.inputChildren;
    const excludeControls = props.excludeControls;
    const ExternalStyles = props.styles || {};

    const [detailValue, setDetailValue] = useState(defaultValue);

    const handleUpdateDetailValue = (newValue) => {
        setDetailValue(newValue);
        if(excludeControls) {
            props.onSubmit(null, newValue);
        }
    }

    let input;
    let formStyle;
    if(inputType === 'select') {
        input =
            <Select
                id = {ExternalStyles['input_item' + detailName]}
                name = {detailName}
                defaultValue = {detailValue}
                children = {inputChildren}
                onSelection = {(selectedValue) => handleUpdateDetailValue(selectedValue)}
                {...inputAttributes}
            />
        formStyle = {position: 'relative'};
    }
    else if(inputType === 'textarea') {
        input =
            <textarea
                id = {ExternalStyles['input_item' + detailName]}
                name = {detailName}
                defaultValue = {detailValue}
                onInput = {(event) => handleUpdateDetailValue(event.target.value)}
                {...inputAttributes}
            >
            </textarea>
    }
    else {
        input = 
            <input
                id = {ExternalStyles['input_item' + detailName]}
                name = {detailName}
                type = {inputType}
                defaultValue = {defaultValue}
                onInput = {(event) => handleUpdateDetailValue(event.target.value)}
                {...inputAttributes}
            />
    }

    let formControlSection = null;
    if(!excludeControls) {
        formControlSection =
            <section className = 'formControlSection'>
                <button id = {ExternalStyles['btnCancel_item' + detailName]} className = {ExternalStyles.btnCancel + ' btnSecondary'} onClick = {event => props.onCancel(event)} type = 'button'>Cancel</button>
                <button id = {ExternalStyles['btnSubmit_item' + detailName]} className = {ExternalStyles.btnSubmit + ' btnPrimary'} onClick = {event => props.onSubmit(event, detailValue)}>Apply</button>
            </section>
    }

    return(
        <form id = {ExternalStyles['form_item' + detailName]} className = {ExternalStyles['form_item']} onSubmit = {event => props.onSubmit(event, detailValue)} style = {formStyle}>
            {input}
            {formControlSection}
        </form>
    );
}

export default DetailEditForm;