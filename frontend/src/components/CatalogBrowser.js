import Styles from 'components/CatalogBrowser.module.scss';

const CatalogBrowser = (props) => {
    // #region Struktura komponentu (JSX)
    return(
        <main id = {Styles.catalogBrowser} className = {props.className ? props.className.split(' ').map(className => (Styles[className])).join(' ') : null}>
            {props.children}
        </main>
    );
    // #endregion
}

export default CatalogBrowser;