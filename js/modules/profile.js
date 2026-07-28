import membersService from '../api/services/members.js';
import loginService from '../api/services/login.js';
import universitiesService from '../api/services/universities.js';
import statesService from '../api/services/states.js';
import countriesService from '../api/services/country.js';
import cvService from '../api/services/cv.js';
import { getPDF } from './pdfProcessor.js';

// Get user data from loginService instead of localStorage directly
const userData = loginService.getUserData();
const userId = userData?.userId;
const token = loginService.getToken();

const fields = ['nombre', 'apellidos', 'genero', 'universidad', 'pais', 'estado', 'email', 'password'];
let currentUniversidadId = null;
let currentEstadoId = null;
let currentPaisId = null;
let universidadesData = [];
let paisesData = [];
let estadosData = []; // Todos los estados, cargados una sola vez

const enableFields = (enabled) => {
  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) el.disabled = !enabled;
  });
};

const fileToBase64 = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });
};

// Pinta el estado actual del CV (si existe) usando la respuesta de GET /cv:
// { cvs: [...], latest: {...} | null }
let currentCvPdfUrl = null;

const renderCurrentCv = (latestCv) => {
  const statusText = document.getElementById('cv-status-text');
  const previewIframe = document.getElementById('cv-preview');

  if (currentCvPdfUrl) {
    URL.revokeObjectURL(currentCvPdfUrl);
    currentCvPdfUrl = null;
  }

  if (!latestCv || !latestCv.cv_base64) {
    statusText.style.display = '';
    statusText.textContent = 'Aún no has subido un CV.';
    previewIframe.style.display = 'none';
    previewIframe.src = '';
    return;
  }

  currentCvPdfUrl = getPDF(latestCv.cv_base64);
  statusText.style.display = 'none';
  previewIframe.style.display = 'block';
  previewIframe.src = currentCvPdfUrl;
};

const loadCurrentCv = async () => {
  try {
    const response = await cvService.get();
    const latestCv = response?.data?.latest || null;
    renderCurrentCv(latestCv);
    return latestCv;
  } catch (error) {
    console.error('Error al cargar el CV actual:', error);
    renderCurrentCv(null);
    return null;
  }
};

// Previsualización exclusiva del front: muestra el archivo recién elegido en el
// iframe al instante, sin subirlo todavía. Se sube de verdad hasta guardar el perfil.
const previewSelectedCvFile = (file) => {
  const statusText = document.getElementById('cv-status-text');
  const previewIframe = document.getElementById('cv-preview');

  if (currentCvPdfUrl) {
    URL.revokeObjectURL(currentCvPdfUrl);
    currentCvPdfUrl = null;
  }

  if (!file) return;

  currentCvPdfUrl = URL.createObjectURL(file);
  statusText.style.display = 'none';
  previewIframe.style.display = 'block';
  previewIframe.src = currentCvPdfUrl;
};

document.getElementById('cv-file').addEventListener('change', (event) => {
  previewSelectedCvFile(event.target.files[0]);
});

const toggleButtons = (editing) => {
  document.getElementById('editBtn').style.display = editing ? 'none' : 'inline-block';
  document.getElementById('acceptBtn').style.display = editing ? 'inline-block' : 'none';
  document.getElementById('cancelBtn').style.display = editing ? 'inline-block' : 'none';
};

// Convierte un input simple en un <select> poblado con dataArray ({id, <labelField>}).
// labelField permite usar 'nombre' (universidad, país) o 'name' (estado), según el esquema real de la API.
// Si se pasa disabledIfEmpty=true y dataArray está vacío, el select queda deshabilitado.
const buildSelect = (containerId, inputId, dataArray, currentText, disabledIfEmpty = false, labelField = 'nombre') => {
  const container = document.getElementById(containerId);

  const select = document.createElement('select');
  select.id = `${inputId}-select`;
  select.className = `${inputId}-select`;

  const emptyOption = document.createElement('option');
  emptyOption.value = '';
  emptyOption.textContent = 'Seleccione una opción';
  select.appendChild(emptyOption);

  let selectedId = null;

  dataArray.forEach(item => {
    const label = item[labelField];
    const option = document.createElement('option');
    option.value = item.id;
    option.textContent = label;

    if (label === currentText) {
      option.selected = true;
      selectedId = item.id;
    }

    select.appendChild(option);
  });

  if (disabledIfEmpty && dataArray.length === 0) {
    select.disabled = true;
  }

  container.innerHTML = '';
  container.appendChild(select);

  return { select, selectedId };
};

const convertToSelect = async (containerId, inputId, service, isUniversidad = false) => {
  try {
    const response = await service.get();
    const dataArray = response;

    const currentText = document.getElementById(inputId).value;
    const { selectedId } = buildSelect(containerId, inputId, dataArray, currentText);

    if (isUniversidad) currentUniversidadId = selectedId;
    else if (inputId === 'pais') currentPaisId = selectedId;

    return dataArray;
  } catch (error) {
    console.error(`Error al cargar ${inputId}:`, error);
    document.getElementById(containerId).innerHTML = `<input id="${inputId}" type="text" placeholder="${inputId.charAt(0).toUpperCase() + inputId.slice(1)}">`;
    return [];
  }
};

// El select de Estado depende del país elegido, pero NO vuelve a llamar a la API:
// filtra en frontend sobre el array completo de estados ya cargado (estadosData),
// usando el campo countryId de cada estado (la API de estados usa countryId/name,
// distinto al resto de entidades que usan id/nombre). Se deshabilita si no hay país elegido.
const refreshEstadoSelect = (paisId, currentText = '') => {
  if (!paisId) {
    buildSelect('estado-container', 'estado', [], '', true, 'name');
    currentEstadoId = null;
    return;
  }

  const relatedStates = estadosData.filter(state => state.countryId == paisId);
  const { selectedId } = buildSelect('estado-container', 'estado', relatedStates, currentText, true, 'name');
  currentEstadoId = selectedId;
};

const convertBackToInput = (containerId, inputId, selectId, assign) => {
  const container = document.getElementById(containerId);
  const select = document.getElementById(selectId);

  if (select) {
    const selectedOption = select.options[select.selectedIndex];
    const selectedText = selectedOption ? selectedOption.textContent : '';
    const selectedValue = selectedOption && selectedOption.value !== '' ? selectedOption.value : null;

    container.innerHTML = `<input id="${inputId}" type="text" placeholder="${inputId.charAt(0).toUpperCase() + inputId.slice(1)}" disabled>`;
    document.getElementById(inputId).value = selectedText;

    if (assign) assign(selectedValue);
  } else {
    // No había select (p.ej. estado deshabilitado sin país): deja el input vacío
    container.innerHTML = `<input id="${inputId}" type="text" placeholder="${inputId.charAt(0).toUpperCase() + inputId.slice(1)}" disabled>`;
  }
};

if (userId && token) {
  membersService.getbyID(userId)
    .then(user => {
      document.getElementById('nombre').value = user.nombre || '';
      document.getElementById('apellidos').value = user.apellidos || '';
      document.getElementById('genero').value = user.genero || '';
      document.getElementById('universidad').value = user.universidad || '';
      document.getElementById('pais').value = user.pais || '';
      document.getElementById('estado').value = user.estado || '';
      document.getElementById('email').value = user.email || '';
      document.getElementById('password').value = '********'; // Don't show real password
    })
    .catch(error => {
      console.error('Error al cargar el perfil:', error);
      alert('No se pudo cargar la información del usuario.');
    });

  loadCurrentCv();
} else {
  alert('Usuario no autenticado.');
  // Optional: redirect to login page
  // window.location.href = 'login.html';
}

document.getElementById('editBtn').addEventListener('click', async () => {
  enableFields(true);
  toggleButtons(true);
  // Clear password field when editing
  document.getElementById('password').value = '';

  // Mostrar el campo para reemplazar el CV (subir uno nuevo es opcional)
  document.getElementById('cv-file').style.display = 'block';

  // Universidad: select independiente
  universidadesData = await convertToSelect('universidad-container', 'universidad', universitiesService, true);

  // Estados: se cargan TODOS una sola vez (igual que en register.js)
  const estadoTextoActual = document.getElementById('estado').value;
  estadosData = await statesService.get();

  // País: select independiente
  paisesData = await convertToSelect('pais-container', 'pais', countriesService, false);

  // Estado: se filtra en frontend según el país ya resuelto arriba (currentPaisId)
  refreshEstadoSelect(currentPaisId, estadoTextoActual);

  // Si el usuario cambia el país, se filtra de nuevo sobre estadosData (sin llamar a la API)
  const paisSelect = document.getElementById('pais-select');
  if (paisSelect) {
    paisSelect.addEventListener('change', (e) => {
      const nuevoPaisId = e.target.value || null;
      currentPaisId = nuevoPaisId;
      // Al cambiar país se resetea el estado: no se puede mantener uno de otro país
      refreshEstadoSelect(nuevoPaisId, '');
    });
  }
});

document.getElementById('acceptBtn').addEventListener('click', async () => {
  let passwordInput = document.getElementById('password');

  // Convertir selects de vuelta a inputs antes de guardar
  convertBackToInput('universidad-container', 'universidad', 'universidad-select', (val) => currentUniversidadId = val);
  convertBackToInput('pais-container', 'pais', 'pais-select', (val) => currentPaisId = val);
  convertBackToInput('estado-container', 'estado', 'estado-select', (val) => currentEstadoId = val);

  const updatedUser = {
    nombre: document.getElementById('nombre').value,
    apellidos : document.getElementById('apellidos').value,
    genero: document.getElementById('genero').value,
    universidad: currentUniversidadId, // Usar el ID numérico
    pais: currentPaisId, // Usar el ID numérico
    estado: currentEstadoId, // Usar el ID numérico
    email: document.getElementById('email').value,
    password: passwordInput.value,
  };

  // Only include password if it was changed
  if (passwordInput.value === '') {
    delete updatedUser.password;
  }

  // El CV solo se envía si el usuario eligió un archivo nuevo; si no, se conserva el actual
  const cvFileInput = document.getElementById('cv-file');
  const selectedCvFile = cvFileInput.files[0];
  if (selectedCvFile) {
    try {
      updatedUser.cv_base64 = await fileToBase64(selectedCvFile);
    } catch (error) {
      console.error('Error al leer el archivo del CV:', error);
      alert('No se pudo leer el archivo del CV seleccionado.');
      return;
    }
  }

  membersService.updateMember(userId, updatedUser)
    .then(() => {
      alert('Perfil actualizado correctamente.');
      enableFields(false);
      toggleButtons(false);
      // Reset password display
      document.getElementById('password').value = '********';
      cvFileInput.value = '';
      cvFileInput.style.display = 'none';
      loadCurrentCv();
    })
    .catch(error => {
      console.error('Error al actualizar el perfil:', error);
      alert('No se pudo actualizar el perfil.');
    });
});

document.getElementById('cancelBtn').addEventListener('click', () => {
  location.reload();
});