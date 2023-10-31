const VoiceInputButton = () => {
    let SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;
    let greetings = ['cześć', 'test', 'dzień dobry'];
    let grammar = '#JSGF V1.0; grammar greetings; public <greetings> = ' + greetings.join(' | ') + ';';
    let recognition = new SpeechRecognition();
    let recognitionList = new SpeechGrammarList();
    recognitionList.addFromString(grammar, 1);
    recognition.grammars = recognitionList;
    recognition.lang = 'pl-PL';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    const handleActivateVoiceInput = () => {
        recognition.start();
        recognition.onresult = (event) => {
            let word = event.results[0][0].transcript;
            if(greetings.includes(word)) {
                alert("Witaj!");
            }
            else {
                alert(`"${word}" nie jest rozpoznawalnym poleceniem. Spróbuj jeszcze raz.`);
            }
          }
    }

    return(
        <button onClick = {handleActivateVoiceInput}>
            Naciśnij, by wprowadzić polecenie głosowe
        </button>
    );
}

export default VoiceInputButton;