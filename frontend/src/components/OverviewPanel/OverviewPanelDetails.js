import OverviewPanelDetail from './OverviewPanelDetail';

import Styles from 'components/OverviewPanel/OverviewPanelDetails.module.scss';

const OverviewPanelDetails = (props) => {
    const items = props.items;

    // #region Struktura komponentu (JSX)
    return(
        <ul id = {Styles.overviewPanelDetails}>
            {items.map((item, index) => <OverviewPanelDetail key = {index} item = {item} /> )}
        </ul>
    );
    // #endregion
}

export default OverviewPanelDetails;