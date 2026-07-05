import membresiasService from "../api/services/membresias.js";


const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back());


// Ajusta esta lista a los campos reales que tu tabla/servicio de membresías espera.
// Cada campo se renderiza automáticamente en el modal de agregar.
const membershipFields = [
    { key: 'nombre', label: 'Nombre de la membresía', type: 'text', required: true },
    { key: 'descripcion', label: 'Descripción', type: 'textarea', required: false },
    { key: 'precio', label: 'Precio (MXN)', type: 'number', required: true },
    { key: 'duracion', label: 'Duración', type: 'select', options: ['Mensual', 'Anual'], required: true }
];


let membershipsList = await membresiasService.get();

const searchInput = document.getElementById('searchMembership');
const listEl = document.getElementById('memberships-list');
const countEl = document.getElementById('memberships-count');
const emptyEl = document.getElementById('memberships-empty');

const formatSubtitle = (item) => {
    const parts = [];
    if (item.precio !== undefined && item.precio !== null && item.precio !== '') {
        parts.push(`$${item.precio}`);
    }
    if (item.duracion) {
        parts.push(item.duracion);
    }
    return parts.join(' · ');
};

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
        filtered.forEach(item => {
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

            const subtitle = formatSubtitle(item);
            if (subtitle) {
                const subSpan = document.createElement('span');
                subSpan.className = 'entity-sub';
                subSpan.textContent = subtitle;
                info.appendChild(subSpan);
            }

            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-entity-btn';
            deleteBtn.title = 'Eliminar';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash"></i>';
            deleteBtn.addEventListener('click', () => openDeleteModal(item.id, item.nombre));

            li.appendChild(info);
            li.appendChild(deleteBtn);
            listEl.appendChild(li);
        });
    }

    countEl.textContent = membershipsList.length;
};

searchInput.addEventListener('keyup', renderMemberships);
renderMemberships();


// ------------- Modal de agregar (campos generados desde membershipFields) ------------- //

const addModal = document.getElementById('addMembershipModal');
const formFieldsContainer = document.getElementById('membershipFormFields');
const acceptAddBtn = document.getElementById('acceptAddMembershipBtn');
const closeAddBtn = document.getElementById('close-add-membership-btn');

const buildFormFields = () => {
    formFieldsContainer.innerHTML = '';

    membershipFields.forEach(field => {
        const label = document.createElement('label');
        label.setAttribute('for', `field-${field.key}`);
        label.textContent = field.label;
        formFieldsContainer.appendChild(label);

        let input;
        if (field.type === 'textarea') {
            input = document.createElement('textarea');
        } else if (field.type === 'select') {
            input = document.createElement('select');
            field.options.forEach(optionValue => {
                const option = document.createElement('option');
                option.value = optionValue;
                option.textContent = optionValue;
                input.appendChild(option);
            });
        } else {
            input = document.createElement('input');
            input.type = field.type;
        }

        input.id = `field-${field.key}`;
        formFieldsContainer.appendChild(input);
    });
};

const openAddModal = () => {
    buildFormFields();
    addModal.style.display = 'block';
};

const closeAddModal = () => {
    addModal.style.display = 'none';
};

document.getElementById('add-membership-btn').addEventListener('click', openAddModal);
closeAddBtn.addEventListener('click', closeAddModal);
addModal.addEventListener('click', (e) => {
    if (e.target === addModal) closeAddModal();
});

acceptAddBtn.addEventListener('click', async () => {
    const data = {};

    for (const field of membershipFields) {
        const input = document.getElementById(`field-${field.key}`);
        const value = input.value.trim();

        if (field.required && !value) {
            alert(`Por favor, completa el campo "${field.label}".`);
            return;
        }

        data[field.key] = value;
    }

    try {
        // Consumo de API para agregar la membresía.
        // El endpoint no soporta editar, solo agregar, consultar y eliminar.
        const response = await membresiasService.add(data);
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
});


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

confirmDeleteBtn.addEventListener('click', async () => {
    if (!membershipToDelete) return;

    try {
        const response = await membresiasService.remove(membershipToDelete);
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
});