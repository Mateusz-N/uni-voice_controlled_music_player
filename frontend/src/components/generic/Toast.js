import Styles from 'components/generic/Toast.module.scss';

const Toast = (props) => {
    const message = props.message;
    const type = props.type;
    

    // #region Struktura komponentu (JSX)
    return(
        <div className = {Styles.toast + ' ' + Styles['toast_' + type]} onAnimationEnd = {props.onAnimationEnd}>
            <p className = {Styles.toastMessage}>{message}</p>
        </div>
    );
    // #endregion
}

export default Toast;