import membersService from '../api/services/members.js';
import loginService from '../api/services/login.js'; // side-effect: restaura el token de auth en apiClient
import { getPage, renderPagination } from './pagination.js';

const goBackBtn = document.getElementById("go-back-btn");
goBackBtn.addEventListener('click', () => window.history.back());

const PAGE_SIZE = 5;
let currentPage = 1;

// GET api/miembros devuelve: usuario_id, nombre_completo, rol, membresia, estado, fecha_solicitud
const members = await membersService.get();

const tbody = document.getElementById('members_body');
const paginationContainer = document.getElementById('members-pagination');

function renderRows() {
    const pageItems = getPage(members, currentPage, PAGE_SIZE);
    tbody.innerHTML = '';

    if (pageItems.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td class="empty-row" colspan="6" data-translate="members_empty">No hay miembros registrados</td>
          </tr>`;
        return;
    }

    pageItems.forEach(member => {
        const tr = document.createElement('tr');
        const membresiaTexto = member.membership || '—';
        const email = member.email;
        const rolTexto = member.role === 1 ? 'Administrador' : 'Usuario';

        tr.innerHTML = `
          <td><label class="name">${member.name}</label></td>
          <td><label class="membership">${membresiaTexto}</label></td>
          <td><label >${email}</label></td>
          <td><label class="role">${rolTexto}</label></td>
          <td>
            <button class="evaluate"><i class="fas fa-edit"></i><a href="member_info.html?memberID=${member.user_id}">
              <span data-translate="members_edit">Editar</span>
              </a></button>
          </td>`;
        tbody.appendChild(tr);
    });
}

function goToPage(page) {
    currentPage = page;
    renderRows();
    renderPagination(paginationContainer, {
        totalItems: members.length,
        pageSize: PAGE_SIZE,
        currentPage,
        onPageChange: goToPage
    });
}

goToPage(1);
