import investigationLinesService from "../api/services/investigationLines.js";


const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back());


let linesList = await investigationLinesService.get();

const searchInput = document.getElementById('searchLine');
const listEl = document.getElementById('lines-list');
const countEl = document.getElementById('lines-count');
const emptyEl = document.getElementById('lines-empty');

const renderLines = () => {
    const term = searchInput.value.toLowerCase();
    const filtered = term
        ? linesList.filter(line => line.name.toLowerCase().includes(term))
        : linesList;

    listEl.innerHTML = '';

    if (filtered.length === 0) {
        emptyEl.textContent = term
            ? 'No se encontraron coincidencias.'
            : emptyEl.dataset.defaultText;
        emptyEl.style.visibility = 'visible';
    } else {
        emptyEl.style.visibility = 'hidden';
        filtered.forEach(line => {
            const li = document.createElement('li');
            li.className = 'entity-item';
            li.dataset.id = line.id;

            const nameSpan = document.createElement('span');
            nameSpan.className = 'entity-name';
            nameSpan.textContent = line.name;
            nameSpan.title = line.name;

            li.appendChild(nameSpan);
            listEl.appendChild(li);
        });
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

acceptAddBtn.addEventListener('click', async () => {
    const name = lineNameInput.value.trim();

    if (!name) {
        alert('Por favor, ingresa un nombre válido.');
        return;
    }

    try {
        // Consumo de API para agregar la línea de investigación.
        // El endpoint solo soporta GET/POST; no hay editar ni eliminar todavía.
        const response = await investigationLinesService.add(name);
        if (response) {
            alert('Línea de investigación agregada exitosamente');
            location.reload();
        } else {
            alert('Error al agregar la línea de investigación');
        }
    } catch (error) {
        console.error('Error al agregar la línea de investigación:', error);
        alert('Error al agregar la línea de investigación');
    } finally {
        closeAddModal();
    }
});