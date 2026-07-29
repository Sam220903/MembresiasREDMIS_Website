import membersService from '../api/services/members.js';
  import loginService from '../api/services/login.js';

  const members = await membersService.get();
  

  const acceptedMembers = members.filter(member => member.estado === 'APROBADA');

  const acceptedTable = document.getElementById('tabla-miembros-aceptados').getElementsByClassName('tabla-body')[0];

  acceptedMembers.forEach(member => {
    const row = document.createElement('div');
    row.className = 'fila';
    row.innerHTML = `
      <span>${member.nombre_completo}</span>
      <span>${member.membresia}</span>
      <span>${new Date(member.fecha_solicitud).toLocaleDateString()}</span>
      <button class="btn-editar"><i class="fas fa-edit"></i>
        <a href="member_info.html?memberID=${member.usuario_id}">
          <span data-translate="members_edit">Editar</span>
        </a>
        </button>
    `;
    acceptedTable.appendChild(row);
  });