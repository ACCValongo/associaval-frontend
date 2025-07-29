// API para gestão de associações
const API_BASE_URL = 'https://associaval-backend.onrender.com';

// Função para fazer requisições à API
async function fetchAPI(endpoint) {
    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json();
    } catch (error) {
        console.error('Erro ao fazer requisição à API:', error);
        return null;
    }
}

// Função para carregar todas as associações
async function loadAllAssociations() {
    const data = await fetchAPI('/api/associations');
    if (!data || !data.associations) {
        console.error('Não foi possível carregar as associações');
        return;
    }

    const associationsContainer = document.querySelector('#associations-list');
    if (!associationsContainer) return;

    // Limpar conteúdo existente
    associationsContainer.innerHTML = '';

    if (data.associations.length === 0) {
        associationsContainer.innerHTML = `
            <div class="no-associations">
                <p>Ainda não há associações registadas.</p>
                <p>As associações podem registar-se através do sistema de gestão.</p>
            </div>
        `;
        return;
    }

    // Atualizar contador
    const countElement = document.querySelector('#count');
    if (countElement) {
        countElement.textContent = data.associations.length;
    }

    data.associations.forEach(association => {
        const associationCard = document.createElement('div');
        associationCard.className = 'association-card';
        associationCard.setAttribute('data-freguesia', extractFreguesia(association.address));
        associationCard.setAttribute('data-categories', JSON.stringify(association.activity_categories || []));
        
        // Processar categorias para exibição
        let categoriesText = '';
        if (association.activity_categories && association.activity_categories.length > 0) {
            const categoryLabels = association.activity_categories.map(cat => {
                // Extrair apenas o nome da categoria (após o emoji e hífen)
                return cat.split(' - ')[1] || cat;
            });
            categoriesText = categoryLabels.slice(0, 3).join(', ');
            if (categoryLabels.length > 3) {
                categoriesText += '...';
            }
        }

        associationCard.innerHTML = `
            <div class="association-header">
                <h3 class="association-title">${association.name}</h3>
            </div>
            <div class="association-content">
                <p class="association-description">${association.description || 'Descrição não disponível'}</p>
                ${categoriesText ? `<p class="association-categories"><strong>Atividades:</strong> ${categoriesText}</p>` : ''}
                <div class="association-details">
                    <p class="association-address">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                            <circle cx="12" cy="10" r="3"></circle>
                        </svg>
                        ${association.address}
                    </p>
                    ${association.phone ? `<p class="association-phone">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                        </svg>
                        ${association.phone}
                    </p>` : ''}
                    ${association.email ? `<p class="association-email">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                            <polyline points="22,6 12,13 2,6"></polyline>
                        </svg>
                        ${association.email}
                    </p>` : ''}
                </div>
            </div>
            <div class="association-footer">
                <a href="associacao-detalhes.html?id=${association.id}" class="btn btn-primary btn-sm">Ver Detalhes</a>
            </div>
        `;
        
        associationsContainer.appendChild(associationCard);
    });
}

// Função para extrair freguesia do endereço
function extractFreguesia(address) {
    if (!address) return '';
    
    const addressLower = address.toLowerCase();
    const freguesias = ['alfena', 'valongo', 'ermesinde', 'campo', 'sobrado'];
    
    for (const freguesia of freguesias) {
        if (addressLower.includes(freguesia)) {
            return freguesia;
        }
    }
    
    return '';
}

// Função para filtrar associações
function applyFilters() {
    const freguesiaFilter = document.querySelector('#filter-freguesia')?.value || 'todas';
    const tipoFilter = document.querySelector('#filter-tipo')?.value || 'todas';
    const searchTerm = document.querySelector('#search-input')?.value.toLowerCase() || '';

    const associationCards = document.querySelectorAll('.association-card');
    let visibleCount = 0;

    associationCards.forEach(card => {
        let showCard = true;

        // Filtro por freguesia
        if (freguesiaFilter !== 'todas') {
            const cardFreguesia = card.getAttribute('data-freguesia');
            if (cardFreguesia !== freguesiaFilter) {
                showCard = false;
            }
        }

        // Filtro por tipo de atividade
        if (tipoFilter !== 'todas') {
            const categories = JSON.parse(card.getAttribute('data-categories') || '[]');
            const hasMatchingCategory = categories.some(cat => 
                cat.toLowerCase().includes(tipoFilter.toLowerCase())
            );
            if (!hasMatchingCategory) {
                showCard = false;
            }
        }

        // Filtro por pesquisa
        if (searchTerm) {
            const title = card.querySelector('.association-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.association-description')?.textContent.toLowerCase() || '';
            const address = card.querySelector('.association-address')?.textContent.toLowerCase() || '';
            
            if (!title.includes(searchTerm) && !description.includes(searchTerm) && !address.includes(searchTerm)) {
                showCard = false;
            }
        }

        card.style.display = showCard ? 'block' : 'none';
        if (showCard) visibleCount++;
    });

    // Atualizar contador
    const countElement = document.querySelector('#count');
    if (countElement) {
        countElement.textContent = visibleCount;
    }

    // Mostrar mensagem se nenhuma associação for encontrada
    const associationsContainer = document.querySelector('#associations-list');
    let noResultsMessage = document.querySelector('.no-results-message');
    
    if (visibleCount === 0) {
        if (!noResultsMessage) {
            noResultsMessage = document.createElement('div');
            noResultsMessage.className = 'no-results-message';
            noResultsMessage.innerHTML = `
                <p>Nenhuma associação encontrada com os filtros aplicados.</p>
                <p>Tente ajustar os filtros ou limpar a pesquisa.</p>
            `;
            associationsContainer.appendChild(noResultsMessage);
        }
    } else {
        if (noResultsMessage) {
            noResultsMessage.remove();
        }
    }
}

// Função para limpar filtros
function clearFilters() {
    const freguesiaFilter = document.querySelector('#filter-freguesia');
    const tipoFilter = document.querySelector('#filter-tipo');
    const searchInput = document.querySelector('#search-input');

    if (freguesiaFilter) freguesiaFilter.value = 'todas';
    if (tipoFilter) tipoFilter.value = 'todas';
    if (searchInput) searchInput.value = '';

    applyFilters();
}

// Inicializar quando a página carregar
document.addEventListener('DOMContentLoaded', function() {
    loadAllAssociations();

    // Adicionar event listeners para filtros
    const freguesiaFilter = document.querySelector('#filter-freguesia');
    const tipoFilter = document.querySelector('#filter-tipo');
    const searchInput = document.querySelector('#search-input');

    if (freguesiaFilter) {
        freguesiaFilter.addEventListener('change', applyFilters);
    }

    if (tipoFilter) {
        tipoFilter.addEventListener('change', applyFilters);
    }

    if (searchInput) {
        searchInput.addEventListener('input', applyFilters);
    }
});

