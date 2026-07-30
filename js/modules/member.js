import membersService from '../api/services/members.js';
  import loginService from '../api/services/login.js';

  const members = await membersService.get();
  console.log(members);
  

  const table = document.getElementById('tabla-miembros').getElementsByClassName('tabla-body')[0];

  members.forEach(member => {
    const row = document.createElement('div');
    row.className = 'fila';
    row.innerHTML = `
      <span>${member.name}</span>
      <span>${member.email}</span>
      <span>${member.role == 1 ? 'Administrador' : 'Usuario'}</span>
      <button class="btn-editar"><i class="fas fa-edit"></i>
        <a href="member_info.html?memberID=${member.user_id}">
          <span data-translate="members_edit">Editar</span>
        </a>
        </button>
    `;
    table.appendChild(row);
  });