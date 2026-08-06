import membershipApplicationService from '../api/services/membershipApplication.js';
import loginService from '../api/services/login.js'; // side-effect: restaura el token de auth en apiClient
import { getPage, renderPagination } from './pagination.js';

const PAGE_SIZE = 5;
let currentPage = 1;

const applications = await membershipApplicationService.obtener();
const pendingApplications = applications.filter(application => application.estado === 'PENDIENTE');

const tbody = document.getElementById('membership_applications_body');
const paginationContainer = document.getElementById('applications-pagination');

function renderRows() {
    const pageItems = getPage(pendingApplications, currentPage, PAGE_SIZE);
    tbody.innerHTML = '';

    if (pageItems.length === 0) {
        tbody.innerHTML = `
          <tr>
            <td class="empty-row" colspan="5" data-translate="applications_empty">No hay solicitudes de membresía nuevas</td>
          </tr>`;
        return;
    }

    pageItems.forEach(application => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td><label class="name">${application.nombre_usuario}</label><br><label class="email">${application.email_usuario}</label></td>
          <td><label class="membership">${application.membresia}</label></td>
          <td><label class="status" data-translate="applications_status_${application.estado.toLowerCase()}">${application.estado}</label></td>
          <td><label>${new Date(application.fecha_solicitud).toLocaleDateString()}</label></td>
          <td>
            <button class="evaluate"><i class="fa-solid fa-file-fragment"></i><a href="application_info.html?application_id=${application.id}">
              <span data-translate="applications_evaluate">Evaluar</span>
              </a></button>
          </td>`;
        tbody.appendChild(tr);
    });
}

function goToPage(page) {
    currentPage = page;
    renderRows();
    renderPagination(paginationContainer, {
        totalItems: pendingApplications.length,
        pageSize: PAGE_SIZE,
        currentPage,
        onPageChange: goToPage
    });
}

goToPage(1);
