import { setLanguage } from "./translate.js";
import { setTheme, getTheme } from "./theme.js";


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


// Selección de tema
const systemThemeBtn = document.getElementById('system-theme-btn');
const lightThemeBtn = document.getElementById('light-theme-btn');
const darkThemeBtn = document.getElementById('dark-theme-btn');

const themeButtons = {
    system: systemThemeBtn,
    light: lightThemeBtn,
    dark: darkThemeBtn,
};

const highlightActiveThemeButton = () => {
    const currentTheme = getTheme();
    Object.entries(themeButtons).forEach(([theme, button]) => {
        button.classList.toggle('active', theme === currentTheme);
    });
};

const selectTheme = (theme) => {
    setTheme(theme);
    highlightActiveThemeButton();
};

systemThemeBtn.addEventListener('click', () => selectTheme('system'));
lightThemeBtn.addEventListener('click', () => selectTheme('light'));
darkThemeBtn.addEventListener('click', () => selectTheme('dark'));

highlightActiveThemeButton();
