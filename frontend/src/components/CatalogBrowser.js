import Styles from 'components/CatalogBrowser.module.scss';

const CatalogBrowser = (props) => {
    // #region Struktura komponentu (JSX)
    return(
        <main id = {Styles.catalogBrowser} className = {Styles[props.className]}>
            {props.children}
        </main>
    );
    // #endregion
}

export default CatalogBrowser;