const Microphone = (props) => {
    return(
        <img
            src = {microphoneActive ? microphone_active : microphone_idle}
            alt = {microphoneEnabled ? (ref_microphoneActive.current ? 'Capturing voice...' : 'Awaiting input...') : 'Microphone off'}
            id = {Styles.microphoneIcon}
            className = {microphoneEnabled ? Styles.microphoneIcon_enabled : Styles.microphoneIcon_disabled}
            onClick = {handleToggleMicrophone}
        />
    )
}