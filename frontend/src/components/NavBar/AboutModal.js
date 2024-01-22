import { useEffect } from 'react';

import Modal from 'components/generic/Modal';

import Styles from 'components/NavBar/AboutModal.module.scss';

const AboutModal = (props) => {
    // #region Zmienne globalne
    const defaultAction = props.defaultAction;
    // #endregion

    // #region Wywołania zwrotne (useEffect Hooks)
    useEffect(() => {
        if(defaultAction === 'cancel') {
            props.onClose();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[defaultAction]);
    // #endregion

    // #region Struktura komponentu (JSX)
    return(
        <Modal title = 'About' id = {'about'} onClose = {props.onClose} styles = {Styles}>
            <main className = {Styles.about_main}>
                <p>The goal of this website is to provide a more convenient way of using Spotify via voice control and to enhance the overall listening experience.</p>
                <p>It uses the Spotify Web API to connect to your Spotify account via secure authentication with OAuth2.0 and strives to keep sensitive data safe at all times.</p>
                <p>While we aim to provide accurate and up-to-date information, this website relies on third-party APIs for music data and thus we cannot guarantee the accuracy or completeness of the information provided.</p>
                <br/>
                <p>All user and music data contained within this website belongs to Spotify, except where noted otherwise.</p>
                <p>This application uses Discogs’ API but is not affiliated with, sponsored or endorsed by Discogs. ‘Discogs’ is a trademark of Zink Media, LLC.</p>
                <p>Synchronous and static lyrics alike are brought to you by the Lrclib API.</p>
                <br/>
                <p>This website is not responsible for the accuracy, legality, or appropriateness of third-party content.</p>
                <p>Its developers are not liable for any issues, damages, or consequences arising from the use of the website or reliance on the provided content.</p>
                <p>Users are encouraged to verify information independently and report any discrepancies.</p>
                <br/>
                <p>Thank you for using our website!</p>
            </main>
        </Modal>
    );
    // #endregion
}

export default AboutModal;