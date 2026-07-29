import membersService from '../api/services/members.js';
import loginService from '../api/services/login.js';
import membresiaUsuarioService from '../api/services/membresiaUsuario.js';
import { getPDF } from './pdfProcessor.js';

const urlParams = new URLSearchParams(window.location.search);
const memberID = urlParams.get('memberID');

if(!memberID) {
    alert('No se ha proporcionado un ID de miembro válido.');
    window.location.href = 'members.html';
}

const member = await membersService.getbyID(memberID);
const membershipResponse = await membresiaUsuarioService.getByUserId(memberID);
// La API devuelve { success, data: [...] } — un arreglo de membresías del
// miembro (en la práctica, a lo más una activa a la vez). Se toma la más
// reciente; si no tiene ninguna, se considera sin membresía registrada.
const membershipRecords = membershipResponse?.data || [];
const currentMembership = membershipRecords[membershipRecords.length - 1] || null;
const membershipStatus = currentMembership ? currentMembership.estado : 'NO REGISTRADO';

const changeMembershipStatus = document.getElementById('change-membership-status');


const memberId = document.getElementById('member-id');
const memberName = document.getElementById('member-name');
const memberGender = document.getElementById('member-gender');
const memberUserType = document.getElementById('member-usertype');
const memberStatus = document.getElementById('member-status');
const memberCountry = document.getElementById('member-country');
const memberState = document.getElementById('member-state');
const memberUniversity = document.getElementById('member-university');
const memberRegisterDate = document.getElementById('member-register-date');
const memberLastAccess = document.getElementById('member-last-access');
const memberLastUpdate = document.getElementById('member-last-update');

memberId.value = member.id;
memberName.value = member.nombre + ' ' + member.apellidos;
memberGender.value = member.genero;
memberUserType.value = member.tipo_usuario;
memberStatus.value = member.estatus;
memberCountry.value = member.pais;
memberState.value = member.estado;
memberUniversity.value = member.universidad;
memberRegisterDate.value = member.fecha_registro;
memberLastAccess.value = member.ultimo_acceso;
memberLastUpdate.value = member.ultima_actualizacion;

const deleteUserButton = document.getElementById('delete-user');
deleteUserButton.addEventListener('click', async () => {
    const confirmation = confirm('¿Estás seguro de que deseas eliminar este usuario? Esta acción no se puede deshacer.');
    if (confirmation) {
        await membersService.deleteMember(memberID);
        alert('Usuario eliminado exitosamente.');
        window.location.href = 'members.html';
    }
});

const pdfURL = getPDF(member.cv_base64); // Obtener la URL del PDF
const downloadCVButton = document.getElementById('download-cv');
downloadCVButton.href = pdfURL; // Establecer el enlace de descarga al blob creado

if (membershipStatus === 'ACTIVA') {
    changeMembershipStatus.innerHTML = '<i class="fas fa-times"></i> Revocar Membresía';
    changeMembershipStatus.classList.add('btn-danger');
    changeMembershipStatus.addEventListener('click', async () => {
        const confirmation = confirm('¿Estás seguro de que deseas revocar la membresía de este usuario?');
        if (confirmation) {
            await membresiaUsuarioService.updateMembershipStatus(memberID, {estado: 2});
            alert('Membresía revocada exitosamente.');
            window.location.href = 'members.html';
        }
    });
} else if (membershipStatus === 'INACTIVA') {
    changeMembershipStatus.innerHTML = '<i class="fas fa-check"></i> Reactivar Membresía';
    changeMembershipStatus.classList.add('btn-secondary');
    changeMembershipStatus.addEventListener('click', async () => {
        const confirmation = confirm('¿Estás seguro de que deseas reactivar la membresía de este usuario?');
        if (confirmation) {
            await membresiaUsuarioService.updateMembershipStatus(memberID, {estado: 1});
            alert('Membresía reactivada exitosamente.');
            window.location.href = 'members.html';
        }
    });
} else {
    changeMembershipStatus.innerHTML = '<i class="fas fa-exclamation-triangle"></i> Estado Desconocido';
    changeMembershipStatus.classList.add('btn-warning');
    changeMembershipStatus.disabled = true;

}
