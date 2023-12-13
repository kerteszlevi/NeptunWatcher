// ==UserScript==
// @name     NeptunWatcher
// @version  1
// @grant    none
// @author MasterBread:))
// @include  https://neptun.bme.hu/hallgatoi/main.aspx*
// ==/UserScript==

//módosítsd a vizsgatargy és vizsgadatum változókat a kívánt vizsgaalkalomra
//ha látszik a konzolban a sajtmalac szó, akkor működik
console.log('sajtmalac')
const vizsgatargy = 'Mobil- és webes szoftverek';
const vizsgadatum = '2023. 12. 20. 10:00:00';


// a vizsgaalkalmak listája
const targetRows = document.querySelectorAll('#h_exams_gridExamList_bodytable > tbody > tr');

const config = { childList: true, subtree: true };

//bármilyen hangfájlt lejátszik, ha a linket átírod
const audio = new Audio('https://www.myinstants.com/media/sounds/huh-cat.mp3');

const callback = function(mutationsList, observer) {
    targetRows.forEach(row => {
        //a vizsgaalkalom sorának elemei
        const cells = row.querySelectorAll('td');
        //a cella ami a vizsgatárgy nevét tartalmazza
        const courseName = cells[1].textContent;
        if (courseName.includes(vizsgatargy)) {
            // a cella ami a szabad helyeket tartalmazza
            const textContent = cells[7].textContent;
            //a szabad helyek feldolgozása
            const [availableSpaces, totalSpaces] = textContent.split('/').map(Number);
            //a cella ami a vizsga időpontját tartalmazza
            const date = cells[5].textContent;

            //ha legalább egy hely szabad, lejátszásra kerül a hang
            if (availableSpaces < totalSpaces && vizsgadatum == date) {
                // Hang lejátszása
                audio.play();
                console.log('Felszabadult legalább egy hely:', vizsgatargy);
            }
        }
    });
};

//újratöltés után azonnal meghívjuk, mivel a neptun nem frissít dinamikusan
callback();

//observer példányosítása
const observer = new MutationObserver(callback);

targetRows.forEach(row => observer.observe(row, config));