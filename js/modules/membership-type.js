import membershipsService from "../api/services/memberships.js";


const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back());


let membershipsList = await membershipsService.get();

const searchInput = document.getElementById('searchMembership');
const listEl = document.getElementById('memberships-list');
const countEl = document.getElementById('memberships-count');
const emptyEl = document.getElementById('memberships-empty');


// ------------- Fila de entidad (nombre + tipo + eliminar) ------------- //

const createMembershipRow = (item) => {
    const li = document.createElement('li');
    li.className = 'entity-item';
    li.dataset.id = item.id;

    const info = document.createElement('div');
    info.className = 'entity-info';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'entity-name';
    nameSpan.textContent = item.nombre;
    nameSpan.title = item.nombre;
    info.appendChild(nameSpan);

    const typeSpan = document.createElement('span');
    typeSpan.className = 'entity-sub';
    typeSpan.textContent = item.tipo;
    info.appendChild(typeSpan);

    const actions = document.createElement('div');
    actions.className = 'entity-actions';

    const deleteBtn = document.createElement('button');
    deleteBtn.className = 'delete-entity-btn';
    deleteBtn.title = 'Eliminar';
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
    deleteBtn.addEventListener('click', () => openDeleteModal(item.id, item.nombre));

    actions.appendChild(deleteBtn);
    li.appendChild(info);
    li.appendChild(actions);

    return li;
};


// ------------- Renderizado de la lista (con búsqueda y contador) ------------- //

const renderMemberships = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = term
        ? membershipsList.filter(item => (item.nombre || '').toLowerCase().includes(term))
        : membershipsList;

    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.textContent = term
            ? 'No se encontraron coincidencias.'
            : emptyEl.dataset.defaultText;
        emptyEl.style.visibility = 'visible';
    } else {
        emptyEl.style.visibility = 'hidden';
        filtered.forEach(item => listEl.appendChild(createMembershipRow(item)));
    }

    countEl.textContent = membershipsList.length;
};

searchInput.addEventListener('keyup', renderMemberships);
renderMemberships();


// ------------- Modal de agregar ------------- //

const addModal = document.getElementById('addMembershipModal');
const membershipNameInput = document.getElementById('membershipNameInput');
const membershipTypeInput = document.getElementById('membershipTypeInput');
const acceptAddBtn = document.getElementById('acceptAddMembershipBtn');
const closeAddBtn = document.getElementById('close-add-membership-btn');

const openAddModal = () => {
    membershipNameInput.value = '';
    membershipTypeInput.value = '';
    addModal.style.display = 'block';
    membershipNameInput.focus();
};

const closeAddModal = () => {
    addModal.style.display = 'none';
};

document.getElementById('add-membership-btn').addEventListener('click', openAddModal);
closeAddBtn.addEventListener('click', closeAddModal);
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeAddModal();
});


// ------------- Consumo de API: agregar ------------- //

const handleAddSubmit = async () => {
    const nombre = membershipNameInput.value.trim();
    const tipo = membershipTypeInput.value.trim();

    if (!nombre) {
        alert('Por favor, ingresa un nombre de membresía válido.');
        return;
    }

    if (!tipo) {
        alert('Por favor, ingresa un tipo de membresía válido.');
        return;
    }

    try {
        // El endpoint no soporta editar, solo agregar, consultar y eliminar.
        const response = await membershipsService.add({ nombre, tipo });

        if (response) {
            alert('Membresía agregada exitosamente');
            location.reload();
        } else {
            alert('Error al agregar la membresía');
        }
    } catch (error) {
        console.error('Error al agregar la membresía:', error);
        alert('Error al agregar la membresía');
    } finally {
        closeAddModal();
    }
};

acceptAddBtn.addEventListener('click', handleAddSubmit);


// ------------- Modal de eliminación ------------- //

let membershipToDelete = null;

const deleteModal = document.getElementById('deleteConfirmModal');
const deleteEntityNameEl = document.getElementById('delete-entity-name');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const closeDeleteBtn = document.getElementById('close-delete-btn');

const openDeleteModal = (id, nombre) => {
    membershipToDelete = id;
    deleteEntityNameEl.textContent = nombre;
    deleteModal.style.display = 'block';
};

const closeDeleteModal = () => {
    deleteModal.style.display = 'none';
    membershipToDelete = null;
};

cancelDeleteBtn.addEventListener('click', closeDeleteModal);
closeDeleteBtn.addEventListener('click', closeDeleteModal);
deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) closeDeleteModal();
});


// ------------- Consumo de API: eliminar ------------- //

const handleDeleteSubmit = async () => {
    if (!membershipToDelete) return;

    try {
        const response = await membershipsService.delete(membershipToDelete);

        if (response) {
            alert('Membresía eliminada exitosamente');
            location.reload();
        } else {
            alert('Error al eliminar la membresía');
        }
    } catch (error) {
        console.error('Error al eliminar la membresía:', error);
        alert('Error al eliminar la membresía');
    } finally {
        closeDeleteModal();
    }
};

confirmDeleteBtn.addEventListener('click', handleDeleteSubmit);