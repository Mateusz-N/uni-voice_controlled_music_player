import Styles from 'components/OverviewPanelDetails.module.scss';

const OverviewPanelDetails = (props) => {
    const items = props.items;
    console.log(items)

    // #region Struktura komponentu (JSX)
    return(
        <ul id = {Styles.overviewPanelDetails}>
            {items.map((item, index) => {
                return(
                    <li key = {index}>
                        <span className = {Styles.overviewPanelDetails_detailName}>{item.name}: </span>
                        {item.content}
                    </li>
                );
            })}
        </ul>
    );
    // #endregion
}

export default OverviewPanelDetails;