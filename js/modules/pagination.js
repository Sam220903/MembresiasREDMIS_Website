// Utilidad de paginación reutilizable para tablas renderizadas en el cliente
// (sin depender de jQuery/DataTables). Se usa en applications.js y member.js.

/**
 * Devuelve el subconjunto de "items" correspondiente a una página.
 */
export function getPage(items, page, pageSize) {
    const start = (page - 1) * pageSize;
    return items.slice(start, start + pageSize);
}

/**
 * Dibuja los controles de paginación (« 1 2 3 »).
 * @param {HTMLElement} container - Contenedor donde se dibujan los botones.
 * @param {Object} options
 * @param {number} options.totalItems
 * @param {number} options.pageSize
 * @param {number} options.currentPage
 * @param {(page: number) => void} options.onPageChange
 * @param {number} [options.maxVisiblePages=5]
 */
export function renderPagination(container, { totalItems, pageSize, currentPage, onPageChange, maxVisiblePages = 5 }) {
    container.innerHTML = '';

    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

    // Si todo cabe en una sola página, no se muestran controles
    if (totalPages <= 1) return;

    const makeButton = (label, page, { disabled = false, active = false, ariaLabel = null } = {}) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'page-btn' + (active ? ' active' : '');
        btn.textContent = label;
        btn.disabled = disabled;
        if (ariaLabel) btn.setAttribute('aria-label', ariaLabel);
        if (!disabled) {
            btn.addEventListener('click', () => onPageChange(page));
        }
        return btn;
    };

    container.appendChild(makeButton('«', currentPage - 1, {
        disabled: currentPage === 1,
        ariaLabel: 'Página anterior'
    }));

    let start = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let end = Math.min(totalPages, start + maxVisiblePages - 1);
    start = Math.max(1, end - maxVisiblePages + 1);

    if (start > 1) {
        container.appendChild(makeButton('1', 1));
        if (start > 2) container.appendChild(makeButton('…', currentPage, { disabled: true }));
    }

    for (let p = start; p <= end; p++) {
        container.appendChild(makeButton(String(p), p, { active: p === currentPage }));
    }

    if (end < totalPages) {
        if (end < totalPages - 1) container.appendChild(makeButton('…', currentPage, { disabled: true }));
        container.appendChild(makeButton(String(totalPages), totalPages));
    }

    container.appendChild(makeButton('»', currentPage + 1, {
        disabled: currentPage === totalPages,
        ariaLabel: 'Página siguiente'
    }));
}
