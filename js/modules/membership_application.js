import membershipsService from '../api/services/memberships.js';
import membershipApplicationService from '../api/services/membershipApplication.js';
import cvService from '../api/services/cv.js';
import { getPDF } from './pdfProcessor.js';

// Estado del CV ya cargado por el usuario (si existe), para decidir si el
// archivo del formulario es obligatorio (no tiene CV) u opcional (ya tiene uno).
let hasExistingCv = false;
let currentCvId = null;
let currentCvPdfUrl = null;

// Cargar tipos de membresía
async function loadMemberships() {
    try {
        const response = await membershipsService.get();
        console.log('Respuesta del servicio:', response); // Para depuración
        
        // Manejar diferentes formatos de respuesta
        const memberships = Array.isArray(response) ? response : 
                            (response.data ? response.data : []);
        
        if (!memberships.length) {
            console.warn('No se recibieron membresías');
            return;
        }

        const select = document.getElementById('tipo-membresia');
        
        // Limpiar opciones excepto la primera
        while(select.options.length > 1) {
            select.remove(1);
        }

        // Agregar opciones de membresía
        memberships.forEach(membership => {
            const option = document.createElement('option');
            option.value = membership.id;
            option.textContent = membership.nombre;
            select.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar membresías:', error);
        alert('No se pudieron cargar los tipos de membresía');
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result.split(',')[1]);
        reader.onerror = error => reject(error);
    });
}

// Pinta el estado del CV actual del usuario (si tiene uno) y actualiza si el
// campo de archivo del formulario es obligatorio u opcional.
function renderCurrentCv(latestCv) {
    const statusText = document.getElementById('cv-status-text');
    const previewIframe = document.getElementById('cv-preview');
    const cvFileInput = document.getElementById('cv-file');
    const cvFileLabel = document.getElementById('cv-file-label');

    if (!statusText || !previewIframe || !cvFileInput || !cvFileLabel) {
        console.warn('renderCurrentCv: faltan elementos del CV en el HTML (cv-status-text, cv-preview, cv-file o cv-file-label). Verifica que membership_application.html esté actualizado.');
        return;
    }

    if (currentCvPdfUrl) {
        URL.revokeObjectURL(currentCvPdfUrl);
        currentCvPdfUrl = null;
    }

    if (!latestCv) {
        hasExistingCv = false;
        currentCvId = null;
        statusText.style.display = '';
        statusText.textContent = 'Aún no has subido un CV.';
        previewIframe.style.display = 'none';
        previewIframe.src = '';
        cvFileLabel.textContent = 'Sube tu CV (PDF)';
        cvFileInput.required = true;
        return;
    }

    hasExistingCv = true;
    currentCvId = latestCv.id;
    statusText.style.display = 'none';
    cvFileLabel.textContent = 'Subir un CV nuevo (opcional si ya tienes uno cargado)';
    cvFileInput.required = false;

    if (latestCv.cv_base64) {
        currentCvPdfUrl = getPDF(latestCv.cv_base64);
        previewIframe.style.display = 'block';
        previewIframe.src = currentCvPdfUrl;
    } else {
        previewIframe.style.display = 'none';
        previewIframe.src = '';
    }
}

async function loadCurrentCv() {
    try {
        const response = await cvService.get();
        const latestCv = response?.data?.latest || null;
        renderCurrentCv(latestCv);
    } catch (error) {
        console.error('Error al cargar el CV actual:', error);
        renderCurrentCv(null);
    }
}

// Previsualización exclusiva del front: muestra el archivo recién elegido en el
// iframe al instante, sin subirlo todavía. Se sube de verdad hasta enviar la solicitud.
function previewSelectedCvFile(file) {
    const statusText = document.getElementById('cv-status-text');
    const previewIframe = document.getElementById('cv-preview');

    if (!statusText || !previewIframe) {
        console.warn('previewSelectedCvFile: faltan elementos del CV en el HTML (cv-status-text o cv-preview).');
        return;
    }

    if (currentCvPdfUrl) {
        URL.revokeObjectURL(currentCvPdfUrl);
        currentCvPdfUrl = null;
    }

    if (!file) return;

    currentCvPdfUrl = URL.createObjectURL(file);
    statusText.style.display = 'none';
    previewIframe.style.display = 'block';
    previewIframe.src = currentCvPdfUrl;
}

function validateMembershipForm() {
const membershipId = document.getElementById('tipo-membresia').value;
const phone = document.getElementById('telefono').value.trim();
const comments = document.getElementById('comentarios').value.trim();
const cvFile = document.getElementById('cv-file').files[0];


if (!membershipId) {
    alert('Seleccione un tipo de membresía válido.');
    return false;
}


const phoneRegex = /^[0-9]{10}$/; // ajusta según país
if (!phoneRegex.test(phone)) {
    alert('Ingrese un número de teléfono válido (solo números, 7-15 dígitos).');
    return false;
}


if (comments.length > 500) {
    alert('Los comentarios no deben exceder los 500 caracteres.');
    return false;
}


// El CV solo es obligatorio si el usuario no tiene uno cargado todavía
if (!cvFile && !hasExistingCv) {
    alert('Debe seleccionar un archivo PDF.');
    return false;
}

if (cvFile) {
    const allowedTypes = ['application/pdf'];
    const maxSizeMB = 2;

    if (!allowedTypes.includes(cvFile.type)) {
        alert('El archivo debe ser un PDF.');
        return false;
    }

    if (cvFile.size > maxSizeMB * 1024 * 1024) {
        alert(`El archivo no debe superar los ${maxSizeMB} MB.`);
        return false;
    }
}

return true;
}

async function submitMembership() {
if (!validateMembershipForm()) return;
    try {
        const membershipId = document.getElementById('tipo-membresia').value;
        const phone = document.getElementById('telefono').value;
        const comments = document.getElementById('comentarios').value;
        const cvFile = document.getElementById('cv-file').files[0];

        if (!membershipId || !phone) {
            alert('Por favor complete todos los campos obligatorios');
            return;
        }

        // Si el usuario eligió un archivo nuevo, se sube/actualiza el CV primero;
        // si no eligió ninguno, se conserva el CV que ya tiene cargado.
        if (cvFile) {
            const cvBase64 = await fileToBase64(cvFile);

            if (hasExistingCv) {
                await cvService.update(currentCvId, cvBase64);
            } else {
                await cvService.upload(cvBase64);
            }
        }

        // Crear el objeto con la estructura requerida (el CV ya no viaja aquí)
        const requestData = {
            MR_Membresias_id: parseInt(membershipId),
            telefono: phone,
            comentarios: comments || ''
        };

        
        // Enviar la solicitud
        const response = await membershipApplicationService.solicitar(requestData);
        
        if (response.status === 'success') {
        alert('Solicitud enviada exitosamente');

        document.getElementById('tipo-membresia').value = '';
        document.getElementById('telefono').value = '';
        document.getElementById('comentarios').value = '';
        document.getElementById('cv-file').value = '';
        loadCurrentCv();

        } else {
            alert('Error al enviar la solicitud: ' + (response.message || 'Error desconocido'));
        }

    } catch (error) {
        console.error('Error al enviar solicitud:', error);
        const error_message = JSON.parse(error.rawResponse)
        alert('Ocurrió un error al enviar la solicitud: ' + (error_message.message || 'Error desconocido'));
    }
}

// Cargar membresías al iniciar la página
document.addEventListener('DOMContentLoaded', () => {
    loadMemberships();
    loadCurrentCv();
    document.getElementById('submit-membership').addEventListener('click', submitMembership);
    document.getElementById('cv-file').addEventListener('change', (event) => {
        previewSelectedCvFile(event.target.files[0]);
    });
});