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
    nameSpan.textContent = item.nombre;
    nameSpan.title = item.nombre;

    const actions = document.createElement('div');
    actions.className = 'entity-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'edit-entity-btn';
    editBtn.title = 'Editar';
    editBtn.innerHTML = '<i class="fa-solid fa-pen"></i>';
    editBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openEntityForm(type, 'edit', item);
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-entity-btn';
    deleteBtn.title = 'Eliminar';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        openDeleteModal(type, item.id, item.nombre);
    });

    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(nameSpan);
    li.appendChild(actions);

    return li;
};


// ------------- Países (panel principal, seleccionable) ------------- //

const renderCountries = () => {
    const term = countrySearchInput.value.toLowerCase();
    const filtered = term
        ? countriesList.filter(c => c.nombre.toLowerCase().includes(term))
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
            ? `${entityLabelPlural} de ${activeCountry.nombre}`
            : noCountryText;
    }

    const byCountry = activeCountryId
        ? data.filter(item => item.countryId === activeCountryId)
        : [];

    const term = searchInput.value.toLowerCase();
    const filtered = term
        ? byCountry.filter(item => item.nombre.toLowerCase().includes(term))
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


// ------------- Modal genérico de agregar / editar ------------- //

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

let formContext = { type: null, mode: null, id: null };

const openEntityForm = (type, mode, entity = null) => {
    const info = entityTypeInfo[type];
    formContext = { type, mode, id: entity ? entity.id : null };

    entityFormTitle.textContent = (mode === 'add' ? 'Añadir ' : 'Editar ') + info.label;
    entityNameLabel.textContent = 'Nombre del ' + info.label;
    entityNameInput.value = entity ? entity.nombre : '';
    entityFormAcceptBtn.textContent = mode === 'add' ? 'Agregar' : 'Guardar cambios';

    entityCountryField.style.display = info.needsCountry ? 'block' : 'none';
    if (info.needsCountry) {
        entityCountrySelect.innerHTML = '';
        countriesList.forEach(country => {
            const option = document.createElement('option');
            option.value = country.id;
            option.textContent = country.nombre;
            entityCountrySelect.appendChild(option);
        });
        const preselectId = entity ? entity.countryId : activeCountryId;
        if (preselectId) entityCountrySelect.value = preselectId;
    }

    entityFormModal.style.display = 'block';
    entityNameInput.focus();
};

const closeEntityForm = () => {
    entityFormModal.style.display = 'none';
    formContext = { type: null, mode: null, id: null };
};

closeEntityFormBtn.addEventListener('click', closeEntityForm);
entityFormModal.addEventListener('click', (e) => {
    if (e.target === entityFormModal) closeEntityForm();
});

entityFormAcceptBtn.addEventListener('click', async () => {
    const { type, mode, id } = formContext;
    if (!type) return;

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
        let response;
        if (mode === 'add') {
            // Consumo de API para agregar la entidad
            response = info.needsCountry
                ? await info.service.add(nombre, countryId)
                : await info.service.add(nombre);
        } else {
            // Consumo de API para actualizar la entidad.
            // Se asume un método update(id, nombre[, countryId]) simétrico a add().
            response = info.needsCountry
                ? await info.service.update(id, nombre, countryId)
                : await info.service.update(id, nombre);
        }

        if (response) {
            alert(info.messages[mode === 'add' ? 'addOk' : 'editOk']);
            location.reload();
        } else {
            alert(info.messages[mode === 'add' ? 'addErr' : 'editErr']);
        }
    } catch (error) {
        console.error(info.messages[mode === 'add' ? 'addErr' : 'editErr'], error);
        alert(info.messages[mode === 'add' ? 'addErr' : 'editErr']);
    } finally {
        closeEntityForm();
    }
});

document.getElementById('add-country-btn').addEventListener('click', () => openEntityForm('country', 'add'));
document.getElementById('add-state-btn').addEventListener('click', () => openEntityForm('state', 'add'));
document.getElementById('add-university-btn').addEventListener('click', () => openEntityForm('university', 'add'));


// ------------- Modal de eliminación ------------- //

let entityToDelete = { type: null, id: null };

const deleteModal = document.getElementById('deleteConfirmModal');
const deleteEntityNameEl = document.getElementById('delete-entity-name');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteBtn = document.getElementById('close-delete-btn');

const openDeleteModal = (type, id, nombre) => {
    entityToDelete = { type, id };
    deleteEntityNameEl.textContent = nombre;
    deleteModal.style.display = 'block';
};

const closeDeleteModal = () => {
    deleteModal.style.display = 'none';
    entityToDelete = { type: null, id: null };
};

cancelDeleteBtn.addEventListener('click', closeDeleteModal);
closeDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});

confirmDeleteBtn.addEventListener('click', async () => {
    const { type, id } = entityToDelete;
    if (!type || !id) return;

    const info = entityTypeInfo[type];

    try {
        // Se asume que cada servicio expone un método remove(id), igual que add().
        const response = await info.service.remove(id);
        if (response) {
            alert(info.messages.deleteOk);
            location.reload();
        } else {
            alert(info.messages.deleteErr);
        }
    } catch (error) {
        console.error(info.messages.deleteErr, error);
        alert(info.messages.deleteErr);
    } finally {
        closeDeleteModal();
    }
});