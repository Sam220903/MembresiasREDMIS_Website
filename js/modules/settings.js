import countryService from "../api/services/country.js";
import stateService from "../api/services/states.js";
import universityService from "../api/services/universities.js";
import { setLanguage } from "./translate.js";

const countriesList = await countryService.get();
const statesList = await stateService.get();
const universitiesList = await universityService.get();

// Selección dinámica de países, estados y universidades
const countrySearchInput = document.getElementById('searchCountry');
const stateSearchInput = document.getElementById('searchState');
const universitySearchInput = document.getElementById('searchUniversity');

countrySearchInput.onkeyup = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let suggestions = [];

    if (searchTerm) {
        suggestions = countriesList.filter(country => country.nombre.toLowerCase().includes(searchTerm));
    }

    displaySuggestions(suggestions, 'countries-list');

    
}

stateSearchInput.onkeyup = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let suggestions = [];

    if (searchTerm) {
        suggestions = statesList.filter(state => state.nombre.toLowerCase().includes(searchTerm));
    }

    displaySuggestions(suggestions, 'states-list');
}

universitySearchInput.onkeyup = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    let suggestions = [];

    if (searchTerm) {
        suggestions = universitiesList.filter(university => university.nombre.toLowerCase().includes(searchTerm));
    }

    displaySuggestions(suggestions, 'universities-list');
}

const displaySuggestions = (suggestions, listId) => {
    const suggestionsContainer = document.getElementById(listId);
    suggestionsContainer.innerHTML = '';

    if (suggestions.length > 0) {
        suggestions.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item.nombre;
            suggestionsContainer.appendChild(li);
        });
        suggestionsContainer.classList.add('active');
    } else {
        suggestionsContainer.classList.remove('active');
    }
}


// Carga de modales para agregar país, estado y universidad, con sus respectivos eventos de aceptación y cierre.

const loadCountryModal = () => {
    let countryModalPath = '../partials/addCountry.html';
    const modalContainer = document.getElementById('addCountryModal');

    fetch(countryModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptCountryBtn = document.getElementById('acceptCountryBtn');
            acceptCountryBtn.addEventListener('click', async () => {
                const paisInput = document.getElementById('pais');
                const pais = paisInput.value.trim();

                // Consumo de API para agregar el país

                if (!pais && pais === '') {
                    alert('Por favor, ingresa un país válido.');
                    return;
                } 

                try {
                    const response = await countryService.add(pais);
                    if (response) {
                        alert('País agregado exitosamente');
                        paisInput.value = '';
                        location.reload();
                    } else {
                        alert('Error al agregar el país');
                    }
                } catch (error) {
                    console.error('Error al agregar el país:', error);
                    alert('Error al agregar el país');
                } finally {
                    closeCountryModal();
                    // 
                }
                    
            });

            const closeCountryBtn = document.getElementById('close-country-btn');
            closeCountryBtn.addEventListener('click', closeCountryModal);

        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openCountryModal = () => {
    const modal = document.getElementById('add-country-modal-form');
    modal.style.display = 'block';
}

const closeCountryModal = () => {
    const modal = document.getElementById('add-country-modal-form');
    modal.style.display = 'none';
}




const loadStateModal = () => {
    let stateModalPath = '../partials/addState.html';
    const modalContainer = document.getElementById('addStateModal');

    fetch(stateModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptStateBtn = document.getElementById('acceptStateBtn');

            const s_countrySelector = document.getElementById('s_countrySelector');
            countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.id;
                option.textContent = country.nombre;
                s_countrySelector.appendChild(option);
            });


            acceptStateBtn.addEventListener('click', async () => {
                const estadoInput = document.getElementById('estado');
                const estado = estadoInput.value.trim();
                const selectedCountryId = s_countrySelector.value;

                // Consumo de API para agregar el estado
                
                if (!estado && estado === '') {
                    alert('Por favor, ingresa un estado válido.');
                    return;
                }

                try {
                    const response = await stateService.add(estado, selectedCountryId);
                    if (response) {
                        alert('Estado agregado exitosamente');
                        estadoInput.value = '';
                        location.reload();
                    } else {
                        alert('Error al agregar el estado');
                    }
                } catch (error) {
                    console.error('Error al agregar el estado:', error);
                    alert('Error al agregar el estado');
                } finally {
                    closeStateModal();
                }   

            });

            const closeStateBtn = document.getElementById('close-state-btn');
            closeStateBtn.addEventListener('click', closeStateModal);
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openStateModal = () => {
    const modal = document.getElementById('add-state-modal-form');
    modal.style.display = 'block';
}

const closeStateModal = () => {
    const modal = document.getElementById('add-state-modal-form');
    modal.style.display = 'none';
}



const loadUniversityModal = () => {
    let universityModalPath = '../partials/addUniversity.html';
    const modalContainer = document.getElementById('addUniversityModal');

    fetch(universityModalPath)
        .then(response => response.text())
        .then(html => {
            modalContainer.innerHTML = html;
            const acceptUniversityBtn = document.getElementById('acceptUniversityBtn');
            const u_countrySelector = document.getElementById('u_countrySelector');
            countriesList.forEach(country => {
                const option = document.createElement('option');
                option.value = country.id;
                option.textContent = country.nombre;
                u_countrySelector.appendChild(option);
            });

            acceptUniversityBtn.addEventListener('click', async () => {
                const universidadInput = document.getElementById('universidad');
                const universidad = universidadInput.value.trim();
                const selectedCountryId = u_countrySelector.value;


                // Consumo de API para agregar la universidad
                
                if (!universidad && universidad === '') {
                    alert('Por favor, ingresa una universidad válida.');
                    return;
                }

                try {
                    const response = await universityService.add(universidad, selectedCountryId);
                    if (response) {
                        alert('Universidad agregada exitosamente');
                        universidadInput.value = '';
                        location.reload();
                    } else {
                        alert('Error al agregar la universidad');
                    }
                } catch (error) {
                    console.error('Error al agregar la universidad:', error);
                    alert('Error al agregar la universidad');
                } finally {
                    closeUniversityModal();
                }

            });

            const closeUniversityBtn = document.getElementById('close-university-btn');
            closeUniversityBtn.addEventListener('click', closeUniversityModal);
        })
        .catch(error => {
            console.error('Error al cargar el modal:', error);
        });

}

const openUniversityModal = () => {
    const modal = document.getElementById('add-university-modal-form');
    modal.style.display = 'block';
}

const closeUniversityModal = () => {
    const modal = document.getElementById('add-university-modal-form');
    modal.style.display = 'none';
}

loadCountryModal();
loadStateModal();
loadUniversityModal();


const openAddCountryBtn = document.getElementById('add-country-btn');
openAddCountryBtn.addEventListener('click', openCountryModal);

const openAddStateBtn = document.getElementById('add-state-btn');
openAddStateBtn.addEventListener('click', openStateModal);

const openAddUniversityBtn = document.getElementById('add-university-btn');
openAddUniversityBtn.addEventListener('click', openUniversityModal);


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












