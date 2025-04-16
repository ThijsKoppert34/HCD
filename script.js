const teksten = [
    "The first sketches for “The Will to Power” were made in 1884, soon after  the publication of the first three parts of “Thus Spake Zarathustra,” and thereafter, for four years, Nietzsche piled up notes. They were written at all the places he visited on his endless travels in search of health—at Nice, at Venice, at Sils-Maria in the Engadine (for long his favourite resort), at Cannobio, at Zürich, at Genoa, at Chur, at Leipzig.",
    "Several times his work was interrupted by other books, first by “Beyond Good and Evil,” then by “The Genealogy of Morals” (written in twenty days), then by his Wagner pamphlets. Almost as often he changed his plan. Once he decided to expand “The Will to Power” to ten volumes, with “An Attempt at a New Interpretation of the World” as a general sub-title.",
    "Again he adopted the sub-title of “An Interpretation of All That Happens.” Finally, he hit upon “An Attempt at a Transvaluation of All Values,” and went back to four volumes, though with a number of changes in their arrangement. In September, 1888, he began actual work upon the first volume, and before the end of the month it was completed.",
    "The Summer had been one of almost hysterical creative activity. Since the middle of June he had written two other small books, “The Case of Wagner” and “The Twilight of the Idols,” and before the end of the year he was destined to write “Ecce Homo.” Some time during December his health began to fail rapidly, and soon after the New Year he was helpless. Thereafter he wrote no more.",
    "The Wagner diatribe and “The Twilight of the Idols” were published immediately, but “The Antichrist” did not get into type until 1895. I suspect that the delay was due to the influence of the philosopher’s sister, Elisabeth Förster-Nietzsche, an intelligent and ardent but by no means uniformly judicious propagandist of his ideas.",
    "During his dark days of neglect and misunderstanding, when even family and friends kept aloof, Frau Förster-Nietzsche went with him farther than any other, but there were bounds beyond which she, also, hesitated to go, and those bounds were marked by crosses. One notes, in her biography of him—a useful but not always accurate work—an evident desire to purge him of the accusation of mocking at sacred things.",
    "He had, she says, great admiration for “the elevating effect of Christianity ... upon the weak and ailing,” and “a real liking for sincere, pious Christians,” and “a tender love for the Founder of Christianity.” All his wrath, she continues, was reserved for “St. Paul and his like,” who perverted the Beatitudes, which Christ intended for the lowly only, into a universal religion which made war upon aristocratic values.",
    "Here, obviously, one is addressed by an interpreter who cannot forget that she is the daughter of a Lutheran pastor and the grand-daughter of two others; a touch of conscience gets into her reading of “The Antichrist.” She even hints that the text may have been garbled, after the author’s collapse, by some more sinister heretic.",
    "There is not the slightest reason to believe that any such garbling ever took place, nor is there any evidence that their common heritage of piety rested upon the brother as heavily as it rested upon the sister. On the contrary, it must be manifest that Nietzsche, in this book, intended to attack Christianity headlong and with all arms.",
    "For all his rapid writing he put the utmost care into it, and he wanted it to be printed exactly as it stands. The ideas in it were anything but new to him when he set them down. He had been developing them since the days of his beginning. You will find some of them, clearly recognizable, in the first book he ever wrote, “The Birth of Tragedy.”",
    "You will find the most important of all of them—the conception of Christianity as ressentiment—set forth at length in the first part of “The Genealogy of Morals,” published under his own supervision in 1887. And the rest are scattered through the whole vast mass of his notes, sometimes as mere questionings but often worked out very carefully.",
    "Moreover, let it not be forgotten that it was Wagner’s yielding to Christian sentimentality in “Parsifal” that transformed Nietzsche from the first among his literary advocates into the most bitter of his opponents. He could forgive every other sort of mountebankery, but not that.",
    "“In me,” he once said, “the Christianity of my forbears reaches its logical conclusion. In me the stern intellectual conscience that Christianity fosters and makes paramount turns against Christianity. In me Christianity ... devours itself.”"
]

let huidigeIndex = 0;

const tekstElement = document.getElementById("tekstDeelBoek");
const arrowLeft = document.getElementById("arrowLeft");
const arrowRight = document.getElementById("arrowRight");

function updateTekst() {
    tekstElement.textContent = teksten[huidigeIndex];
    toonNotitiesVoorIndex(huidigeIndex); // <-- nieuwe regel
}

arrowLeft.addEventListener("click", () => {
    if (huidigeIndex > 0) {
        huidigeIndex--;
        updateTekst();
    }
});

arrowRight.addEventListener("click", () => {
    if (huidigeIndex < teksten.length - 1) {
        huidigeIndex++;
        updateTekst();
    }
});

function toonNotitiesVoorIndex(index) {
    notitieContainer.innerHTML = ""; // eerst leegmaken

    const notities = aantekeningenPerTekst[index] || [];

    notities.forEach(tekst => {
        const notitie = document.createElement("div");
        notitie.classList.add("notitie");
        notitie.textContent = tekst;
        notitieContainer.appendChild(notitie);
    });
}

const invoer = document.getElementById("invoerAantekening");
const notitieContainer = document.getElementById("notitieContainer");

const aantekeningenPerTekst = {};

invoer.addEventListener("keydown", function (event) {
    const waarde = invoer.value.trim();

    // 1. Spreek laatste woord na spatie (en voorkomen dat het weer gesproken wordt bij Enter)
    if (event.key === " " && waarde !== "") {
        const woorden = waarde.split(" ");
        const laatsteWoord = woorden[woorden.length - 1];

        if (laatsteWoord) {
            const utterance = new SpeechSynthesisUtterance(laatsteWoord);
            speechSynthesis.speak(utterance);
        }
    }

    // 2. Spreek laatste woord bij Enter + sla op als notitie
    if (event.key === "Enter" && waarde !== "") {
        const woorden = waarde.split(" ");
        const laatsteWoord = woorden[woorden.length - 1];

        // Spreek het laatste woord alleen als het nog niet is uitgesproken
        if (laatsteWoord) {
            const utterance = new SpeechSynthesisUtterance(laatsteWoord);
            speechSynthesis.speak(utterance);
        }

        if (!aantekeningenPerTekst[huidigeIndex]) {
            aantekeningenPerTekst[huidigeIndex] = [];
        }

        aantekeningenPerTekst[huidigeIndex].push(waarde);
        invoer.value = "";

        toonNotitiesVoorIndex(huidigeIndex);

        localStorage.setItem("aantekeningenPerTekst", JSON.stringify(aantekeningenPerTekst));
    }
});



const opgeslagen = localStorage.getItem("aantekeningenPerTekst");
if (opgeslagen) {
    Object.assign(aantekeningenPerTekst, JSON.parse(opgeslagen));
}

let currentCharIndex = 0;
let originalText = "";
let utterance = null;

function readPage(button) {
    const synth = window.speechSynthesis;
    const contentElement = document.querySelector('#tekstDeelBoek');

    // PAUSE
    if (synth.speaking && !synth.paused) {
        synth.pause();
        button.textContent = "play_arrow"; // play icon
        return;
    }

    // RESUME
    if (synth.paused) {
        synth.resume();
        button.textContent = "volume_off"; // pause icon
        return;
    }

    // START FROM BEGINNING
    originalText = contentElement.innerText;
    const remainingText = originalText.slice(currentCharIndex);

    utterance = new SpeechSynthesisUtterance(remainingText);
    utterance.lang = 'en-US'; // Pas aan indien je een andere taal wilt

    // Highlight woorden tijdens het voorlezen
    utterance.onboundary = function (event) {
        if (event.name === 'word' && event.charLength > 0) {
            const start = currentCharIndex + event.charIndex;
            const end = start + event.charLength;

            const before = originalText.slice(0, start);
            const word = originalText.slice(start, end);
            const after = originalText.slice(end);

            contentElement.innerHTML = `${before}<mark>${word}</mark>${after}`;
        }
    };

    // Bij einde van de spraak
    utterance.onend = function () {
        button.textContent = "volume_on"; // default icon
        currentCharIndex = 0;
        contentElement.innerHTML = originalText;
    };

    // Bij annulering (bijv. door stoppen)
    utterance.onpause = function (event) {
        currentCharIndex += event.charIndex;
    };

    contentElement.dataset.originalText = contentElement.innerHTML;
    synth.speak(utterance);
    button.textContent = "volume_off";
}

function spreekUit(tekst) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(tekst);
    utterance.lang = "nl-NL"; // Taalinstelling voor Nederlands (pas aan voor Engels 'en-US')
    synth.speak(utterance);
}

const leesVoor = document.getElementById("voorleesKnop");
const menu = document.getElementById("hamburger");

arrowLeft.addEventListener("focus", () => {
    spreekUit("Vorige stuk tekst");
});

arrowRight.addEventListener("focus", () => {
    spreekUit("Volgende stuk tekst");
});

invoer.addEventListener("focus", () => {
    spreekUit("Maak hier je aantekening, Roger");
});

leesVoor.addEventListener("focus", () => {
    spreekUit("Lees tekst voor");
});

menu.addEventListener("focus", () => {
    spreekUit("Menu");
});

// Controleren of SpeechRecognition beschikbaar is
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
    const recognition = new SpeechRecognition();
    recognition.continuous = true; // Blijft luisteren
    recognition.interimResults = true; // Toon tijdelijke resultaten tijdens het spreken

    const invoer = document.getElementById('invoerAantekening'); // Input veld
    const spraakKnop = document.getElementById('spraakKnop'); // Spraakknop

    // Initialisatie van de knop om te starten of te stoppen
    let isListening = false; // Houd bij of we aan het luisteren zijn

    // Event listener voor de knop
    spraakKnop.addEventListener('click', () => {
        if (isListening) {
            recognition.stop(); // Stop spraakherkenning
            isListening = false;
        } else {
            recognition.start(); // Start spraakherkenning
            spraakKnop.textContent = 'mic_off'; // Zet knoptekst naar 'Stop'
            isListening = true;
        }
    });

    // Verwerken van de herkende spraak
    recognition.addEventListener('result', (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript; // Voeg herkende tekst toe
        }

        invoer.value = transcript; // Zet de herkende tekst in het invoerveld
    });

    // Event wanneer spraakherkenning stopt
    recognition.addEventListener('end', () => {
        isListening = false;
    });

    // Foutafhandelingsevent
    recognition.addEventListener('error', (event) => {
        console.log('Fout bij spraakherkenning: ', event.error);
    });
} else {
    console.log('Spraakherkenning wordt niet ondersteund door deze browser.');
}


updateTekst();