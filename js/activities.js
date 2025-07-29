// JavaScript para a página de Atividades

document.addEventListener('DOMContentLoaded', function() {
    initActivityFilters();
    initActivitySearch();
    loadURLFilters();
});

// === FILTROS DE ATIVIDADES ===
function initActivityFilters() {
    const filterFreguesia = document.getElementById('filter-freguesia');
    const filterTipo = document.getElementById('filter-tipo');
    const filterData = document.getElementById('filter-data');
    const applyButton = document.getElementById('apply-filters');
    const clearButton = document.getElementById('clear-filters');
    const activitiesList = document.getElementById('activities-list');
    const activitiesCount = document.getElementById('activities-count');
    
    if (!activitiesList) return;
    
    // Aplicar filtros
    function applyFilters() {
        const freguesiaValue = filterFreguesia?.value || '';
        const tipoValue = filterTipo?.value || '';
        const dataValue = filterData?.value || '';
        
        const activities = activitiesList.querySelectorAll('.activity-item');
        let visibleCount = 0;
        
        activities.forEach(activity => {
            const freguesiaMatch = !freguesiaValue || activity.dataset.freguesia === freguesiaValue;
            const tipoMatch = !tipoValue || activity.dataset.tipo === tipoValue;
            const dataMatch = !dataValue || checkDateFilter(activity.dataset.data, dataValue);
            
            if (freguesiaMatch && tipoMatch && dataMatch) {
                activity.classList.remove('hidden');
                visibleCount++;
            } else {
                activity.classList.add('hidden');
            }
        });
        
        // Atualizar contador
        if (activitiesCount) {
            const totalText = visibleCount === 1 ? 'atividade' : 'atividades';
            activitiesCount.textContent = `Mostrando ${visibleCount} ${totalText}`;
        }
        
        // Mostrar mensagem se não houver resultados
        showNoResults(visibleCount === 0);
        
        // Atualizar URL
        updateURL(freguesiaValue, tipoValue, dataValue);
    }
    
    // Verificar filtro de data
    function checkDateFilter(activityDate, filterValue) {
        if (!filterValue) return true;
        
        const today = new Date();
        const activityDateObj = new Date(activityDate);
        
        switch (filterValue) {
            case 'hoje':
                return activityDateObj.toDateString() === today.toDateString();
            
            case 'semana':
                const weekFromNow = new Date(today);
                weekFromNow.setDate(today.getDate() + 7);
                return activityDateObj >= today && activityDateObj <= weekFromNow;
            
            case 'mes':
                return activityDateObj.getMonth() === today.getMonth() && 
                       activityDateObj.getFullYear() === today.getFullYear();
            
            case 'proximo-mes':
                const nextMonth = new Date(today);
                nextMonth.setMonth(today.getMonth() + 1);
                return activityDateObj.getMonth() === nextMonth.getMonth() && 
                       activityDateObj.getFullYear() === nextMonth.getFullYear();
            
            default:
                return true;
        }
    }
    
    // Mostrar/esconder mensagem de "sem resultados"
    function showNoResults(show) {
        let noResultsElement = document.querySelector('.no-results');
        
        if (show && !noResultsElement) {
            noResultsElement = document.createElement('div');
            noResultsElement.className = 'no-results';
            noResultsElement.innerHTML = `
                <h3>Nenhuma atividade encontrada</h3>
                <p>Tente ajustar os filtros ou pesquisar por outros termos.</p>
                <button class="btn btn-primary" onclick="clearAllFilters()">Limpar Filtros</button>
            `;
            activitiesList.appendChild(noResultsElement);
        } else if (!show && noResultsElement) {
            noResultsElement.remove();
        }
    }
    
    // Limpar todos os filtros
    function clearAllFilters() {
        if (filterFreguesia) filterFreguesia.value = '';
        if (filterTipo) filterTipo.value = '';
        if (filterData) filterData.value = '';
        
        applyFilters();
    }
    
    // Atualizar URL com filtros
    function updateURL(freguesia, tipo, data) {
        const url = new URL(window.location);
        
        if (freguesia) url.searchParams.set('freguesia', freguesia);
        else url.searchParams.delete('freguesia');
        
        if (tipo) url.searchParams.set('tipo', tipo);
        else url.searchParams.delete('tipo');
        
        if (data) url.searchParams.set('data', data);
        else url.searchParams.delete('data');
        
        window.history.replaceState({}, '', url);
    }
    
    // Event listeners
    if (applyButton) {
        applyButton.addEventListener('click', applyFilters);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearAllFilters);
    }
    
    // Aplicar filtros automaticamente quando mudar
    [filterFreguesia, filterTipo, filterData].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyFilters);
        }
    });
    
    // Tornar função global para uso no HTML
    window.clearAllFilters = clearAllFilters;
}

// === CARREGAR FILTROS DA URL ===
function loadURLFilters() {
    const urlParams = new URLSearchParams(window.location.search);
    
    const freguesia = urlParams.get('freguesia');
    const tipo = urlParams.get('tipo');
    const data = urlParams.get('data');
    const pesquisa = urlParams.get('pesquisa');
    
    // Aplicar filtros da URL
    if (freguesia) {
        const filterFreguesia = document.getElementById('filter-freguesia');
        if (filterFreguesia) filterFreguesia.value = freguesia;
    }
    
    if (tipo) {
        const filterTipo = document.getElementById('filter-tipo');
        if (filterTipo) filterTipo.value = tipo;
    }
    
    if (data) {
        const filterData = document.getElementById('filter-data');
        if (filterData) filterData.value = data;
    }
    
    // Aplicar pesquisa da URL
    if (pesquisa) {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.value = pesquisa;
            performActivitySearch(pesquisa);
        }
    }
    
    // Aplicar filtros se houver parâmetros
    if (freguesia || tipo || data) {
        // Aguardar um pouco para garantir que os elementos estão prontos
        setTimeout(() => {
            const applyButton = document.getElementById('apply-filters');
            if (applyButton) applyButton.click();
        }, 100);
    }
}

// === PESQUISA DE ATIVIDADES ===
function initActivitySearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performActivitySearch(query);
            }
        });
        
        // Pesquisa em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performActivitySearch(query);
                }, 300);
            } else if (query.length === 0) {
                clearActivitySearch();
            }
        });
    }
}

function performActivitySearch(query) {
    const activitiesList = document.getElementById('activities-list');
    const activitiesCount = document.getElementById('activities-count');
    
    if (!activitiesList) return;
    
    const activities = activitiesList.querySelectorAll('.activity-item');
    let visibleCount = 0;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    activities.forEach(activity => {
        const title = activity.querySelector('.activity-title')?.textContent.toLowerCase() || '';
        const description = activity.querySelector('.activity-description')?.textContent.toLowerCase() || '';
        const type = activity.querySelector('.activity-type')?.textContent.toLowerCase() || '';
        const meta = activity.querySelector('.activity-meta')?.textContent.toLowerCase() || '';
        
        const searchText = `${title} ${description} ${type} ${meta}`;
        
        const matches = searchTerms.every(term => searchText.includes(term));
        
        if (matches) {
            activity.classList.remove('hidden');
            visibleCount++;
            highlightSearchTerms(activity, searchTerms);
        } else {
            activity.classList.add('hidden');
            removeHighlights(activity);
        }
    });
    
    // Atualizar contador
    if (activitiesCount) {
        const totalText = visibleCount === 1 ? 'atividade' : 'atividades';
        activitiesCount.textContent = `${visibleCount} ${totalText} encontrada${visibleCount !== 1 ? 's' : ''} para "${query}"`;
    }
    
    // Mostrar mensagem se não houver resultados
    showSearchNoResults(visibleCount === 0, query);
}

function clearActivitySearch() {
    const activitiesList = document.getElementById('activities-list');
    const activitiesCount = document.getElementById('activities-count');
    
    if (!activitiesList) return;
    
    const activities = activitiesList.querySelectorAll('.activity-item');
    
    activities.forEach(activity => {
        activity.classList.remove('hidden');
        removeHighlights(activity);
    });
    
    // Restaurar contador original
    if (activitiesCount) {
        activitiesCount.textContent = `Mostrando ${activities.length} atividades`;
    }
    
    // Remover mensagem de sem resultados
    const noResultsElement = document.querySelector('.search-no-results');
    if (noResultsElement) {
        noResultsElement.remove();
    }
}

function highlightSearchTerms(activity, searchTerms) {
    const title = activity.querySelector('.activity-title');
    const description = activity.querySelector('.activity-description');
    
    [title, description].forEach(element => {
        if (element && !element.dataset.originalText) {
            element.dataset.originalText = element.textContent;
        }
        
        if (element && element.dataset.originalText) {
            let highlightedText = element.dataset.originalText;
            
            searchTerms.forEach(term => {
                const regex = new RegExp(`(${term})`, 'gi');
                highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
            });
            
            element.innerHTML = highlightedText;
        }
    });
}

function removeHighlights(activity) {
    const title = activity.querySelector('.activity-title');
    const description = activity.querySelector('.activity-description');
    
    [title, description].forEach(element => {
        if (element && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
        }
    });
}

function showSearchNoResults(show, query) {
    let noResultsElement = document.querySelector('.search-no-results');
    const activitiesList = document.getElementById('activities-list');
    
    if (show && !noResultsElement && activitiesList) {
        noResultsElement = document.createElement('div');
        noResultsElement.className = 'no-results search-no-results';
        noResultsElement.innerHTML = `
            <h3>Nenhuma atividade encontrada</h3>
            <p>Não foram encontradas atividades para "${query}".</p>
            <p>Sugestões:</p>
            <ul style="text-align: left; display: inline-block; margin: var(--spacing-md) 0;">
                <li>• Verifique a ortografia</li>
                <li>• Use termos mais gerais</li>
                <li>• Tente pesquisar por tipo de atividade</li>
                <li>• Procure pelo nome da associação</li>
            </ul>
            <button class="btn btn-primary" onclick="clearSearch()">Limpar Pesquisa</button>
        `;
        activitiesList.appendChild(noResultsElement);
    } else if (!show && noResultsElement) {
        noResultsElement.remove();
    }
}

function clearSearch() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        clearActivitySearch();
    }
}

// Tornar função global
window.clearSearch = clearSearch;

// === ANIMAÇÕES E INTERAÇÕES ===
document.addEventListener('DOMContentLoaded', function() {
    // Animação de entrada para os cards de atividades
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar cards de atividades
    document.querySelectorAll('.activity-item').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
});

// === UTILITÁRIOS ===
// Função para formatar datas
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Função para calcular dias até o evento
function getDaysUntilEvent(dateString) {
    const today = new Date();
    const eventDate = new Date(dateString);
    const diffTime = eventDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Amanhã';
    if (diffDays > 1) return `Em ${diffDays} dias`;
    if (diffDays === -1) return 'Ontem';
    if (diffDays < -1) return `Há ${Math.abs(diffDays)} dias`;
}

// Adicionar informação de tempo até o evento
document.addEventListener('DOMContentLoaded', function() {
    document.querySelectorAll('.activity-item').forEach(activity => {
        const dateString = activity.dataset.data;
        if (dateString) {
            const daysInfo = getDaysUntilEvent(dateString);
            const dateBadge = activity.querySelector('.activity-date-badge');
            
            if (dateBadge && daysInfo !== 'Hoje') {
                const daysElement = document.createElement('div');
                daysElement.className = 'date-days';
                daysElement.textContent = daysInfo;
                daysElement.style.cssText = `
                    font-size: var(--font-size-xs);
                    opacity: 0.8;
                    margin-top: var(--spacing-xs);
                `;
                dateBadge.appendChild(daysElement);
            }
        }
    });
});

