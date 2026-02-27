import membersService from '../../js/api/services/members.js';
import loginService from '../../js/api/services/login.js';
import rolesService from '../../js/api/services/roles.js';

const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back())

const members = await membersService.get();


const changeRole = async (event) => {
    const confirmacion = confirm("¿Deseas cambiar el rol de este usuario?");

    if (confirmacion) {
        const turnToAdmin = event.target;
        
        const memberId = turnToAdmin.closest('tr').querySelector('.id').textContent;
        const newRole = turnToAdmin.checked ? 1 : 2; 
        
        try {
            await rolesService.changeRole(memberId, { role : newRole });
            alert("El rol del miembro ha sido actualizado correctamente.");
            // Actualiza la tabla para reflejar el cambio
            const roleLabel = turnToAdmin.closest('tr').querySelector('.role');
            roleLabel.textContent = newRole === 1 ? 'Administrador' : 'Usuario';
        } catch (error) {
            console.error("Error al actualizar el rol:", error);
            alert("Hubo un error al actualizar el rol del miembro.");
        }
    } else {
        event.preventDefault();
        const turnToAdmin = event.target;
        turnToAdmin.checked = !turnToAdmin.checked;
    }
}


const table = document.getElementById('members-per-role-body');
table.innerHTML = '';
members.forEach(member =>{
const tr = document.createElement('tr');
let role = member.rol === 1 ? 'Administrador' : 'Usuario';
tr.innerHTML = `
    <td><label class="id">${member.usuario_id}</label></td>
    <td><label class="name">${member.nombre_completo}</label></td>
    <td><label class="membership">${member.membresia}</label></td>
    <td><label class="role" data-translate="admin_registration_role_${member.rol}"></label></td>
    <td>
    <div class="toggle-container">
        <label class="toggle-switch">
            <input type="checkbox" class="turn-to-admin" ${member.rol === 1 ? 'checked' : ''}>
            <span class="slider"></span>
        </label>
    </div>
    </td>`;
table.appendChild(tr);
const toggle = tr.querySelector('.turn-to-admin');
toggle.addEventListener('change', changeRole);
}); 


$(document).ready(function() {
    $('#members-per-role').DataTable({
        paging: true,       
        searching: true,    
        ordering: true,
        pageLength: 5,      
        lengthMenu: [5, 7, 10],   
        language: {
            lengthMenu: "Mostrar _MENU_ registros por página",
            zeroRecords: "No hay solicitudes de membresía nuevas",
            info: "Mostrando página _PAGE_ de _PAGES_",
            infoEmpty: "No hay registros disponibles",
            infoFiltered: "(filtrado de _MAX_ registros en total)",
            search: "Buscar:",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        }
    });
});