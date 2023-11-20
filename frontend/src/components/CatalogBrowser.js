import Styles from './CatalogBrowser.module.scss';

const CatalogBrowser = (props) => {

    return(
        <main id = {Styles.catalogBrowser} className = {Styles[props.className]}>
            {props.children}
        </main>
    );
}

export default CatalogBrowser;