// ==UserScript==
// @name     NeptunWatcher
// @version  1
// @grant    none
// @author Bread
// @include  https://neptun.bme.hu/hallgatoi/main.aspx*
// ==/UserScript==

//módosítsd a vizsgatargy és vizsgadatum változókat a kívánt vizsgaalkalomra
//ha látszik a konzolban a sajtmalac szó, akkor működik
//páro
console.log('**NeptunWatcher**')
const vizsgatargy = 'Mobil kommunikációs hálózatok'; // vizsgatárgy neve (neptunból másolva)
const vizsgadatum = '2024. 01. 12. 10:00:00'; //vizsgaalkalom időpontja (neptunból másolva)
const reloadtime = 10000; //újratöltés ennyi ms-onként


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
        const courseName = cells[1].textContent.replace("Már jelentkezett","");
        if (courseName.includes(vizsgatargy)) {
            // a cella ami a szabad helyeket tartalmazza
            const textContent = cells[7].textContent;
            //a szabad helyek feldolgozása
            const [availableSpaces, totalSpaces] = textContent.replace("Már jelentkezett","").split('/').map(Number);
            //a cella ami a vizsga időpontját tartalmazza
            const date = cells[5].textContent.replace("Már jelentkezett","");

            //ha legalább egy hely szabad, lejátszásra kerül a hang
            if (availableSpaces < totalSpaces && vizsgadatum == date) {
                // Hang lejátszása
                audio.play();
                console.log('Felszabadult legalább egy hely:', vizsgatargy);
            }
        }
    });
};
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const currentpage = document.querySelectorAll('h1#upMenuCaption_menucaption')[0].innerText;
//újratöltés után azonnal meghívjuk, mivel a neptun nem frissít dinamikusan
if(currentpage == "Vizsgajelentkezés"){
    callback();
console.log('Az oldal ',reloadtime/1000, ' másodperc múlva újratölt.');
sleep(reloadtime).then(() => { location.reload(); });

//observer példányosítása
const observer = new MutationObserver(callback);

targetRows.forEach(row => observer.observe(row, config));
}else{
    console.log("Nem a vizsgajelentkezés oldalon vagy.")
}