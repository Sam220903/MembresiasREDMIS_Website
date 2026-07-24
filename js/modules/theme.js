// Módulo de gestión de tema visual (claro / oscuro / sistema)
// Se importa en todas las páginas para aplicar y mantener sincronizado el tema.

const STORAGE_KEY = 'theme'; // valores válidos: 'light' | 'dark' | 'system'
const VALID_THEMES = ['light', 'dark', 'system'];

const systemPrefersDark = () =>
    window.matchMedia('(prefers-color-scheme: dark)').matches;

// Devuelve la preferencia guardada, o 'system' si no hay ninguna o es inválida
const getStoredPreference = () => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return VALID_THEMES.includes(stored) ? stored : 'system';
};

// Resuelve la preferencia ('light' | 'dark' | 'system') al tema visual real a aplicar
const resolveTheme = (preference) => {
    if (preference === 'dark') return 'dark';
    if (preference === 'light') return 'light';
    return systemPrefersDark() ? 'dark' : 'light';
};

// Aplica el tema resuelto al documento
const applyResolvedTheme = (resolvedTheme) => {
    if (resolvedTheme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
    } else {
        document.documentElement.removeAttribute('data-theme');
    }
};

// Aplica la preferencia actual (guardada) al documento
const applyCurrentPreference = () => {
    const preference = getStoredPreference();
    applyResolvedTheme(resolveTheme(preference));
};

// Cambia y persiste la preferencia de tema, y la aplica de inmediato
const setTheme = (preference) => {
    if (!VALID_THEMES.includes(preference)) {
        console.error(`Tema inválido: ${preference}`);
        return;
    }
    localStorage.setItem(STORAGE_KEY, preference);
    applyResolvedTheme(resolveTheme(preference));
    document.dispatchEvent(new CustomEvent('themechange', { detail: { preference } }));
};

// Devuelve la preferencia de tema actualmente guardada
const getTheme = () => getStoredPreference();

// Aplicar el tema tan pronto como el módulo se carga (evita parpadeos al navegar)
applyCurrentPreference();

// Si la preferencia es 'system', reaccionar a cambios del sistema operativo en vivo
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredPreference() === 'system') {
        applyCurrentPreference();
    }
});

export { setTheme, getTheme };
