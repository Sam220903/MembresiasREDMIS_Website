import countryService from "../api/services/country.js";
import stateService from "../api/services/states.js";
import universityService from "../api/services/universities.js";


const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back())


let countriesList = await countryService.get();
let statesList = await stateService.get();
let universitiesList = await universityService.get();




// País actualmente seleccionado; filtra qué estados y universidades se muestran.
let activeCountryId = countriesList.length ? countriesList[0].id : null;

const countrySearchInput = document.getElementById('searchCountry');
const stateSearchInput = document.getElementById('searchState');
const universitySearchInput = document.getElementById('searchUniversity');

const countriesListEl = document.getElementById('countries-list');
const statesListEl = document.getElementById('states-list');
const universitiesListEl = document.getElementById('universities-list');

const countriesCountEl = document.getElementById('countries-count');
const statesCountEl = document.getElementById('states-count');
const universitiesCountEl = document.getElementById('universities-count');

const countriesEmptyEl = document.getElementById('countries-empty');
const statesEmptyEl = document.getElementById('states-empty');
const universitiesEmptyEl = document.getElementById('universities-empty');

const statesContextEl = document.getElementById('states-context');
const universitiesContextEl = document.getElementById('universities-context');


// ------------- Fila genérica de entidad (nombre + editar + eliminar) ------------- //

const createEntityRow = (item, { type, active }) => {
    const li = document.createElement('li');
    li.className = 'entity-item' + (active ? ' active' : '');
    li.dataset.id = item.id;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'entity-name';
    nameSpan.textContent = item.name;
    nameSpan.title = item.name;

    const actions = document.createElement('div');
    actions.className = 'entity-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-entity-btn';
    editBtn.title = 'Editar';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEditForm(type, item);
    });

    actions.appendChild(editBtn);
    li.appendChild(nameSpan);
    li.appendChild(actions);

    return li;
};


// ------------- Países (panel principal, seleccionable) ------------- //

const renderCountries = () => {
    const term = countrySearchInput.value.toLowerCase();
    const filtered = term
        ? countriesList.filter(c => c.name.toLowerCase().includes(term))
        : countriesList;

    countriesListEl.innerHTML = '';

    if (filtered.length === 0) {
        countriesEmptyEl.textContent = term
            ? 'No se encontraron coincidencias.'
            : countriesEmptyEl.dataset.defaultText;
        countriesEmptyEl.style.visibility = 'visible';
    } else {
        countriesEmptyEl.style.visibility = 'hidden';
        filtered.forEach(country => {
            const row = createEntityRow(country, { type: 'country', active: country.id === activeCountryId });
            row.addEventListener('click', () => {
                activeCountryId = country.id;
                renderCountries();
                renderStates();
                renderUniversities();
            });
            countriesListEl.appendChild(row);
        });
    }

    countriesCountEl.textContent = countriesList.length;
};


// ------------- Estados y universidades (filtrados por país activo) ------------- //

const getActiveCountry = () => countriesList.find(c => c.id === activeCountryId) || null;

const renderFilteredList = ({ data, type, searchInput, listEl, countEl, emptyEl, contextEl, noCountryText, entityLabelPlural }) => {
    const activeCountry = getActiveCountry();

    if (contextEl) {
        contextEl.textContent = activeCountry
            ? `${entityLabelPlural} de ${activeCountry.name}`
            : noCountryText;
    }

    const byCountry = activeCountryId
        ? data.filter(item => item.countryId === activeCountryId)
        : [];

    const term = searchInput.value.toLowerCase();
    const filtered = term
        ? byCountry.filter(item => item.name.toLowerCase().includes(term))
        : byCountry;

    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.textContent = !activeCountryId
            ? noCountryText
            : term
                ? 'No se encontraron coincidencias.'
                : emptyEl.dataset.defaultText;
        emptyEl.style.visibility = 'visible';
    } else {
        emptyEl.style.visibility = 'hidden';
        filtered.forEach(item => listEl.appendChild(createEntityRow(item, { type, active: false })));
    }

    countEl.textContent = byCountry.length;
};

const renderStates = () => renderFilteredList({
    data: statesList,
    type: 'state',
    searchInput: stateSearchInput,
    listEl: statesListEl,
    countEl: statesCountEl,
    emptyEl: statesEmptyEl,
    contextEl: statesContextEl,
    noCountryText: 'Selecciona un país arriba para ver sus estados.',
    entityLabelPlural: 'Estados'
});

const renderUniversities = () => renderFilteredList({
    data: universitiesList,
    type: 'university',
    searchInput: universitySearchInput,
    listEl: universitiesListEl,
    countEl: universitiesCountEl,
    emptyEl: universitiesEmptyEl,
    contextEl: universitiesContextEl,
    noCountryText: 'Selecciona un país arriba para ver sus universidades.',
    entityLabelPlural: 'Universidades'
});

countrySearchInput.addEventListener('keyup', renderCountries);
stateSearchInput.addEventListener('keyup', renderStates);
universitySearchInput.addEventListener('keyup', renderUniversities);

renderCountries();
renderStates();
renderUniversities();


// ------------- Modal de agregar / editar ------------- //

const entityFormModal = document.getElementById('entityFormModal');
const entityFormTitle = document.getElementById('entityFormTitle');
const entityNameLabel = document.getElementById('entityNameLabel');
const entityNameInput = document.getElementById('entityNameInput');
const entityCountryField = document.getElementById('entityCountryField');
const entityCountrySelect = document.getElementById('entityCountrySelect');
const entityFormAcceptBtn = document.getElementById('entityFormAcceptBtn');
const closeEntityFormBtn = document.getElementById('close-entity-form-btn');

const entityTypeInfo = {
    country: {
        label: 'país',
        needsCountry: false,
        service: countryService,
        messages: {
            addOk: 'País agregado exitosamente', addErr: 'Error al agregar el país',
            editOk: 'País actualizado exitosamente', editErr: 'Error al actualizar el país',
            deleteOk: 'País eliminado exitosamente', deleteErr: 'Error al eliminar el país'
        }
    },
    state: {
        label: 'estado',
        needsCountry: true,
        service: stateService,
        messages: {
            addOk: 'Estado agregado exitosamente', addErr: 'Error al agregar el estado',
            editOk: 'Estado actualizado exitosamente', editErr: 'Error al actualizar el estado',
            deleteOk: 'Estado eliminado exitosamente', deleteErr: 'Error al eliminar el estado'
        }
    },
    university: {
        label: 'universidad',
        needsCountry: true,
        service: universityService,
        messages: {
            addOk: 'Universidad agregada exitosamente', addErr: 'Error al agregar la universidad',
            editOk: 'Universidad actualizada exitosamente', editErr: 'Error al actualizar la universidad',
            deleteOk: 'Universidad eliminada exitosamente', deleteErr: 'Error al eliminar la universidad'
        }
    }
};

// Guarda solo lo que cada consumo necesita para saber qué entidad está abierta en el modal.
let formContext = { type: null, id: null };

const openAddForm = (type) => {
    const info = entityTypeInfo[type];
    formContext = { type, id: null };

    entityFormTitle.textContent = 'Añadir ' + info.label;
    entityNameLabel.textContent = 'Nombre del ' + info.label;
    entityNameInput.value = '';
    entityFormAcceptBtn.textContent = 'Agregar';

    entityCountryField.style.display = info.needsCountry ? 'block' : 'none';
    if (info.needsCountry) {
        entityCountrySelect.innerHTML = '';
        countriesList.forEach(country => {
            const option = document.createElement('option');
            option.value = country.id;
            option.textContent = country.name;
            entityCountrySelect.appendChild(option);
        });
        if (activeCountryId) entityCountrySelect.value = activeCountryId;
    }

    // El botón de aceptar queda apuntando SOLO a la función de agregar.
    entityFormAcceptBtn.onclick = handleAddSubmit;

    entityFormModal.style.display = 'block';
    entityNameInput.focus();
};

const openEditForm = (type, entity) => {
    const info = entityTypeInfo[type];
    formContext = { type, id: entity.id };

    entityFormTitle.textContent = 'Editar ' + info.label;
    entityNameLabel.textContent = 'Nombre del ' + info.label;
    entityNameInput.value = entity.name;
    entityFormAcceptBtn.textContent = 'Guardar cambios';

    entityCountryField.style.display = info.needsCountry ? 'block' : 'none';
    if (info.needsCountry) {
        entityCountrySelect.innerHTML = '';
        countriesList.forEach(country => {
            const option = document.createElement('option');
            option.value = country.id;
            option.textContent = country.name;
            entityCountrySelect.appendChild(option);
        });
        if (entity.countryId) entityCountrySelect.value = entity.countryId;
    }

    // El botón de aceptar queda apuntando SOLO a la función de editar.
    entityFormAcceptBtn.onclick = handleEditSubmit;

    entityFormModal.style.display = 'block';
    entityNameInput.focus();
};

const closeEntityForm = () => {
    entityFormModal.style.display = 'none';
    formContext = { type: null, id: null };
};

closeEntityFormBtn.addEventListener('click', closeEntityForm);
entityFormModal.addEventListener('click', (e) => {
    if (e.target === entityFormModal) closeEntityForm();
});

// ------------- Consumo de API: agregar (independiente de editar) ------------- //

const handleAddSubmit = async () => {
    const { type } = formContext;
    const info = entityTypeInfo[type];
    const nombre = entityNameInput.value.trim();

    if (!nombre) {
        alert(`Por favor, ingresa un nombre de ${info.label} válido.`);
        return;
    }

    const countryId = info.needsCountry ? entityCountrySelect.value : null;
    if (info.needsCountry && !countryId) {
        alert('Por favor, selecciona un país.');
        return;
    }

    try {
        const response = info.needsCountry
            ? await info.service.add(nombre, countryId)
            : await info.service.add(nombre);

        if (response) {
            alert(info.messages.addOk);
            location.reload();
        } else {
            alert(info.messages.addErr);
        }
    } catch (error) {
        console.error(info.messages.addErr, error);
        alert(info.messages.addErr);
    } finally {
        closeEntityForm();
    }
};

// ------------- Consumo de API: editar (independiente de agregar) ------------- //

const handleEditSubmit = async () => {
    const { type, id } = formContext;
    const info = entityTypeInfo[type];
    const nombre = entityNameInput.value.trim();

    if (!nombre) {
        alert(`Por favor, ingresa un nombre de ${info.label} válido.`);
        return;
    }

    const countryId = info.needsCountry ? entityCountrySelect.value : null;
    if (info.needsCountry && !countryId) {
        alert('Por favor, selecciona un país.');
        return;
    }

    try {
        // Se asume un método update(id, nombre[, countryId]) simétrico a add().
        const response = info.needsCountry
            ? await info.service.update(id, nombre, countryId)
            : await info.service.update(id, nombre);

        if (response) {
            alert(info.messages.editOk);
            location.reload();
        } else {
            alert(info.messages.editErr);
        }
    } catch (error) {
        console.error(info.messages.editErr, error);
        alert(info.messages.editErr);
    } finally {
        closeEntityForm();
    }
};

document.getElementById('add-country-btn').addEventListener('click', () => openAddForm('country'));
document.getElementById('add-state-btn').addEventListener('click', () => openAddForm('state'));
document.getElementById('add-university-btn').addEventListener('click', () => openAddForm('university'));


