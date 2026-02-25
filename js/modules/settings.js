import { setLanguage } from "./translate.js";


// Traducción de la página
const spanishBtn = document.getElementById('spanish-btn');
const englishBtn = document.getElementById('english-btn');

spanishBtn.addEventListener('click', () => {
    if (localStorage.getItem('language') !== 'es') {
        confirm('¿Deseas cambiar el idioma a español?') && setLanguage('es');
    } 
});

englishBtn.addEventListener('click', () => {
    if (localStorage.getItem('language') !== 'en') {
        confirm('Do you want to change the language to English?') && setLanguage('en');
    }
});












