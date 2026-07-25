import investigationLinesService from "../api/services/investigationLines.js";


const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back());


let linesList = await investigationLinesService.get();

const searchInput = document.getElementById('searchLine');
const listEl = document.getElementById('lines-list');
const countEl = document.getElementById('lines-count');
const emptyEl = document.getElementById('lines-empty');


// ------------- Fila de entidad (nombre + eliminar) ------------- //

const createLineRow = (item) => {
    const li = document.createElement('li');
    li.className = 'entity-item';
    li.dataset.id = item.id;

    const nameSpan = document.createElement('span');
    nameSpan.className = 'entity-name';
    nameSpan.textContent = item.nombre;
    nameSpan.title = item.nombre;

    const actions = document.createElement('div');
    actions.className = 'entity-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-entity-btn';
    deleteBtn.title = 'Eliminar';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener('click', () => openDeleteModal(item.id, item.nombre));

    actions.appendChild(deleteBtn);
    li.appendChild(nameSpan);
    li.appendChild(actions);

    return li;
};


// ------------- Renderizado de la lista (con búsqueda y contador) ------------- //

const renderLines = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = term
        ? linesList.filter(item => (item.nombre || '').toLowerCase().includes(term))
        : linesList;

    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.textContent = term
            ? 'No se encontraron coincidencias.'
            : emptyEl.dataset.defaultText;
        emptyEl.style.visibility = 'visible';
    } else {
        emptyEl.style.visibility = 'hidden';
        filtered.forEach(item => listEl.appendChild(createLineRow(item)));
    }

    countEl.textContent = linesList.length;
};

searchInput.addEventListener('keyup', renderLines);
renderLines();


// ------------- Modal de agregar ------------- //

const addModal = document.getElementById('addLineModal');
const lineNameInput = document.getElementById('lineNameInput');
const acceptAddBtn = document.getElementById('acceptAddLineBtn');
const closeAddBtn = document.getElementById('close-add-line-btn');

const openAddModal = () => {
    lineNameInput.value = '';
    addModal.style.display = 'block';
    lineNameInput.focus();
};

const closeAddModal = () => {
    addModal.style.display = 'none';
};

document.getElementById('add-line-btn').addEventListener('click', openAddModal);
closeAddBtn.addEventListener('click', closeAddModal);
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeAddModal();
});


// ------------- Consumo de API: agregar ------------- //

const handleAddSubmit = async () => {
    const name = lineNameInput.value.trim();

    if (!name) {
        alert('Por favor, ingresa un nombre de línea de investigación válido.');
        return;
    }

    try {
        // apiClient.post puede no devolver un cuerpo útil aunque la creación sí ocurra,
        // así que el éxito se determina por no lanzar excepción, no por el valor de retorno.
        await investigationLinesService.add({ name });
        alert('Línea de investigación agregada exitosamente');
        location.reload();
    } catch (error) {
        console.error('Error al agregar la línea de investigación:', error);
        alert('Error al agregar la línea de investigación');
    } finally {
        closeAddModal();
    }
};

acceptAddBtn.addEventListener('click', handleAddSubmit);


// ------------- Modal de eliminación ------------- //

let lineToDelete = null;

const deleteModal = document.getElementById('deleteConfirmModal');
const deleteEntityNameEl = document.getElementById('delete-entity-name');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteBtn = document.getElementById('close-delete-btn');

const openDeleteModal = (id, name) => {
    lineToDelete = id;
    deleteEntityNameEl.textContent = name;
    deleteModal.style.display = 'block';
};

const closeDeleteModal = () => {
    deleteModal.style.display = 'none';
    lineToDelete = null;
};

cancelDeleteBtn.addEventListener('click', closeDeleteModal);
closeDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});


// ------------- Consumo de API: eliminar ------------- //

const handleDeleteSubmit = async () => {
    if (!lineToDelete) return;

    try {
        // apiClient.delete puede no devolver un cuerpo (ej. respuesta 204),
        // así que el éxito se determina por no lanzar excepción, no por el valor de retorno.
        await investigationLinesService.delete(lineToDelete);
        alert('Línea de investigación eliminada exitosamente');
        location.reload();
    } catch (error) {
        console.error('Error al eliminar la línea de investigación:', error);
        alert('Error al eliminar la línea de investigación');
    } finally {
        closeDeleteModal();
    }
};

confirmDeleteBtn.addEventListener('click', handleDeleteSubmit);