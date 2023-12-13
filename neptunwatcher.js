// ==UserScript==
// @name     NeptunWatcher
// @version  1
// @grant    none
// @author MasterBread:))
// @include  https://neptun.bme.hu/hallgatoi/main.aspx*
// ==/UserScript==

console.log('sajtmalac')
const vizsgatargy = 'Mobil- és webes szoftverek';
const vizsgadatum = '2023. 12. 20. 10:00:00';



const targetRows = document.querySelectorAll('#h_exams_gridExamList_bodytable > tbody > tr');

const config = { childList: true, subtree: true };

const audio = new Audio('https://www.myinstants.com/media/sounds/huh-cat.mp3');

const callback = function(mutationsList, observer) {
    targetRows.forEach(row => {
        const cells = row.querySelectorAll('td');
        const courseName = cells[1].textContent;
        if (courseName.includes(vizsgatargy)) {
            const textContent = cells[7].textContent;
            const [availableSpaces, totalSpaces] = textContent.split('/').map(Number);
            const date = cells[5].textContent;

            if (availableSpaces < totalSpaces && vizsgadatum == date) {
                // Play the sound
                audio.play();
                console.log('Felszabadult egy hely:', vizsgatargy);
            }
        }
    });
};

callback();

const observer = new MutationObserver(callback);

targetRows.forEach(row => observer.observe(row, config));