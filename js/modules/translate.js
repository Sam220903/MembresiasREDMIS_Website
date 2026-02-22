const defaultLanguage = 'es';
const supportedLanguages = ['es', 'en'];
let currentLanguage = defaultLanguage;

const translations = {}


export async function setLanguage(lang) {
    if (!supportedLanguages.includes(lang)) {
        console.warn(`Idioma no soportado: ${lang}. Se usará el idioma por defecto: ${defaultLanguage}`);
        lang = defaultLanguage;
    }

    if (!translations[lang]) {
        try {
            const response = await fetch(`../assets/lang/${lang}.json`);
            translations[lang]  = await response.json();
        } catch (error) {
            console.error(`Error al cargar las traducciones para el idioma ${lang}:`, error);
            return;
        }
    }

    currentLanguage = lang;

    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang][key]) {
            element.textContent = translations[lang][key];
        } 
    });

    document.documentElement.lang = lang;
    localStorage.setItem('language', lang);
    
}


export function translate(lang) {
    const savedLanguage = localStorage.getItem('language');
    const browserLanguage = navigator.language.slice(0, 2);

    const currentLanguage = savedLanguage || (supportedLanguages.includes(browserLanguage) ? browserLanguage : defaultLanguage);

    setLanguage(currentLanguage);
}


