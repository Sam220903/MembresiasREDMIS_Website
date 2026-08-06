import membershipApplicationService from '../api/services/membershipApplication.js';
import loginService from '../api/services/login.js';
import { getPDF } from './../modules/pdfProcessor.js';


// Calcula el prefijo según la profundidad de la ruta actual
const getBasePath = () => {
    const parts = window.location.pathname.split('/').filter(Boolean);
    const rootIndex = parts.indexOf('pages');
    const endsWithSlash = window.location.pathname.endsWith('/');
    const depth = parts.length - rootIndex - 1 + (endsWithSlash ? 1 : 0);
    return '../'.repeat(depth);
}

const basePath = getBasePath();

const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => history.back())

// Obtener el ID de la solicitud de membresía desde la URL
const urlParams = new URLSearchParams(window.location.search);
const applicationId = urlParams.get('application_id');
if (!applicationId) {
    alert('No se ha proporcionado un ID de solicitud de membresía.');
    window.location.href = 'applications.html'; // Redirigir a la página de solicitudes si no hay ID
}


document.addEventListener('DOMContentLoaded', async() => {

    const application = await membershipApplicationService.obtenerPorID(applicationId);
    console.log(application);

    const applicantName = document.getElementById('applicant-name');
    applicantName.textContent = application.nombre;


    const applicationDate = document.getElementById('application-date');
    const date = new Date(application.fecha_solicitud);
    applicationDate.textContent = date.toLocaleDateString('es-MX', {
        day: '2-digit',
        month: '2-digit',
        year: '2-digit'
    });

    const requestedMembership = document.getElementById('requested-membership');
    requestedMembership.textContent = application.membresia.split(' ').slice(1).join(' ');

    const applicationStatus = document.getElementById('application-status');
    applicationStatus.textContent = application.estado;
    applicationStatus.classList.add('pending');

    const applicantEmail = document.getElementById('applicant-email');
    applicantEmail.textContent = application.email;

    const applicantCountry = document.getElementById('applicant-country');
    applicantCountry.textContent = application.pais;

    const applicantState = document.getElementById('applicant-state');
    applicantState.textContent = application.entidad;

    const applicantUniversity = document.getElementById('applicant-university');
    applicantUniversity.textContent = application.universidad;

    const applicantLine = document.getElementById('applicant-investigation-line');
    applicantLine.textContent = application.linea_investigacion;

    const applicantComments = document.getElementById('applicant-comments');
    applicantComments.textContent = application.comentarios;

    const iframe = document.getElementById("iframe-cv");
    const pdfURL = getPDF(application.cv_base64);
    iframe.contentWindow.location.replace(pdfURL); // en vez de iframe.src = pdfUrl

    const downloadCVBtn = document.getElementById('download-cv').querySelector('a');
    downloadCVBtn.href = pdfURL;




    const acceptApprovement = document.getElementById('accept-approvement');
    const acceptRejection = document.getElementById('accept-rejection');


    const openApproveModal = document.getElementById('open-approve-modal');
    openApproveModal.addEventListener('click', () => {
        const approveModal = document.getElementById('accept-application-modal');
        approveModal.style.display = 'block';
    });


    const openRejectModal = document.getElementById('open-reject-modal');
    openRejectModal.addEventListener('click', () => {
        const rejectModal = document.getElementById('reject-application-modal');
        rejectModal.style.display = 'block';
    });



    const cancelRejection = document.getElementById('cancel-rejection');
    const cancelApprovement = document.getElementById('cancel-approvement');
    const closeRejectBtn = document.getElementById('close-reject-btn');
    const closeApproveBtn = document.getElementById('close-approve-btn');

    cancelRejection.addEventListener('click', () => {
        document.getElementById('reject-application-modal').style.display = 'none';
    });

    cancelApprovement.addEventListener('click', () => {
        document.getElementById('accept-application-modal').style.display = 'none';
    });

    closeRejectBtn.addEventListener('click', () => {
        document.getElementById('reject-application-modal').style.display = 'none';
    });

    closeApproveBtn.addEventListener('click', () => {
        document.getElementById('accept-application-modal').style.display = 'none';
    });

    acceptApprovement.addEventListener('click', acceptApplication);
    acceptRejection.addEventListener('click', rejectApplication);


})



const rejectApplication = async() => {
    try {
        const reason = document.getElementById('rejection-reason').value.trim();

        if(!reason) {
            alert('Debes escribir el motivo de rechazo de la solicitud');
            return;
        }

        const response = await membershipApplicationService.rechazar(applicationId, {reason});

        if (response) {
            alert("La solicitud ha sido rechazada, se notificará al aplicante por correo");
            window.location.href = `${basePath}pages/applications.html`;
        } else {
            alert("Ha ocurrido un error al rechazar la solicitud, por favor, intente de nuevo");
        }
    } catch (error) {
        console.error("Error al rechazar la solicitud:", error);
        alert("Ha ocurrido un error al rechazar la solicitud, por favor, intente de nuevo");
    }
}

const acceptApplication = async() => {
    try {
        const reason = document.getElementById('accept-comments').value.trim();

        const response = await membershipApplicationService.aceptar(applicationId, {reason});
        if(response) {
            alert("La solicitud ha sido aprobada, se notificará al aplicante mediante correo electrónico");
            window.location.href = `${basePath}pages/applications.html`;
        } else {
            alert("Ha ocurrido un error al aceptar la solicitud, por favor, inténtelo de nuevo");
        }
    } catch (error){
        console.error('Error al aprobar la solicitud, por favor:', error);
        alert("Ha ocurrido un error al aceptar la solicitud, por favor, inténtelo de nuevo");
    }
}
// const application = await membershipApplicationService.obtenerPorID(applicationId);


// const applicatorName = document.getElementById('applicator_name');
// const applicatorEmail = document.getElementById('applicator_email');
// const applicationStatus = document.getElementById('application_status');
// const applicantComments = document.getElementById('applicant-comments');

// const cvIframe = document.querySelector('.cv-viewer iframe');
// const downloadLink = document.getElementById('download-cv');

// applicatorName.innerHTML = `${application.nombre}`;
// applicatorEmail.innerHTML = `${application.email}`;
// applicationStatus.innerHTML = `${application.estado}`;
// applicantComments.innerHTML = `${application.comentarios}`;

// const pdfURL = getPDF(application.cv_base64); // Obtener la URL del PDF

// cvIframe.src = pdfURL; // Establecer la fuente del iframe al PDF del CV

// downloadLink.href = pdfURL; // Establecer el enlace de descarga al blob creado


// const confirmAction = async (action) => {
//     let confirmation = confirm(`¿Estás seguro de que deseas ${action} esta solicitud?`);
//     if (!confirmation) return;
// };

// const acceptButton = document.getElementById('accept-application');
// const rejectButton = document.getElementById('reject-application');

// const showRejectModal = document.getElementById('show-reject-modal');
// const rejectModal = document.getElementById('modal-reject');
// const closeRejectModal = document.getElementById('close-reject-modal');

// const showAcceptModal = document.getElementById('show-accept-modal');
// const acceptModal = document.getElementById('modal-accept');
// const closeAcceptModal = document.getElementById('close-accept-modal');


// acceptButton.addEventListener('click', async() => {
//     try {
//         const reason = document.getElementById('acceptation-comments').value.trim();
//         console.log(reason);

//         const response = await membershipApplicationService.aceptar(applicationId, {reason});
//         if (response) {
//             alert("Solicitud aceptada correctamente.");
//             window.location.href = 'applications.html'; 
//         } else {
//             alert("Error al aceptar la solicitud. Inténtalo de nuevo.");
//         }
//     } catch (error) {
//         console.error('Error al aprobar la solicitud:', error);
//         alert('Error al aprobar la solicitud. Inténtalo de nuevo.');
        
//     }
// });
// rejectButton.addEventListener('click', async() => {
//     try {
//         const reason = document.getElementById('rejection-reason').value.trim();
//             if (!reason) {
//                 alert('Debes escribir el motivo de rechazo de la solicitud.');
//                 return;
//             }
//             const response = await membershipApplicationService.rechazar(applicationId, {reason});
//             if (response) {
//                 alert("Solicitud rechazada correctamente.");
//                 window.location.href = 'applications.html'; 
//             } else {
//                 alert("Error al rechazar la solicitud. Inténtalo de nuevo.");
//             }
        
//     } catch (error) {
//         console.error('Error al rechazar la solicitud:', error);
//         alert('Error al rechazar la solicitud. Inténtalo de nuevo.');
//     }
// });
// showRejectModal.addEventListener('click', () => rejectModal.style.display = 'block');
// closeRejectModal.addEventListener('click', () => rejectModal.style.display = 'none');

// showAcceptModal.addEventListener('click', () => acceptModal.style.display = 'block');
// closeAcceptModal.addEventListener('click', () => acceptModal.style.display = 'none');
