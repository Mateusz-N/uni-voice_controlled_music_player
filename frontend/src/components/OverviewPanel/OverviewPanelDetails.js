import OverviewPanelDetail from 'components/OverviewPanel/OverviewPanelDetail';

import Styles from 'components/OverviewPanel/OverviewPanelDetails.module.scss';

const OverviewPanelDetails = (props) => {
    // #region Zmienne globalne
    const items = props.items;
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <ul id = {Styles.overviewPanelDetails}>
            {items.map((item, index) => <OverviewPanelDetail key = {index} item = {item} for = {props.for} onDetailChange = {(detailName, detailValue) => props.onDetailChange(detailName, detailValue)} /> )}
        </ul>
    );
    // #endregion
}

export default OverviewPanelDetails;