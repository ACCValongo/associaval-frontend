// AssociaVal - JavaScript Principal

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar componentes
    initMobileMenu();
    initCalendar();
    initSearch();
    initSmoothScroll();
});

// === MENU MÓVEL === 
function initMobileMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            const isExpanded = this.getAttribute('aria-expanded') === 'true';
            
            this.setAttribute('aria-expanded', !isExpanded);
            navLinks.classList.toggle('active');
            
            // Animação do ícone do menu
            const menuIcons = this.querySelectorAll('.menu-icon');
            menuIcons.forEach((icon, index) => {
                if (navLinks.classList.contains('active')) {
                    if (index === 0) icon.style.transform = 'rotate(45deg) translate(6px, 6px)';
                    if (index === 1) icon.style.opacity = '0';
                    if (index === 2) icon.style.transform = 'rotate(-45deg) translate(6px, -6px)';
                } else {
                    icon.style.transform = '';
                    icon.style.opacity = '';
                }
            });
        });
        
        // Fechar menu ao clicar num link
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.setAttribute('aria-expanded', 'false');
                
                const menuIcons = menuToggle.querySelectorAll('.menu-icon');
                menuIcons.forEach(icon => {
                    icon.style.transform = '';
                    icon.style.opacity = '';
                });
            });
        });
    }
}

// === CALENDÁRIO ===
function initCalendar() {
    const calendarGrid = document.getElementById('calendar-grid');
    const calendarTitle = document.getElementById('calendar-title');
    const prevButton = document.getElementById('prev-month');
    const nextButton = document.getElementById('next-month');
    
    if (!calendarGrid || !calendarTitle) return;
    
    let currentDate = new Date();
    
    // Eventos de exemplo
    const events = {
        '2024-12-15': [{ name: 'Concerto de Natal', type: 'music' }],
        '2024-12-18': [{ name: 'Torneio de Karaté', type: 'sport' }],
        '2024-12-22': [{ name: 'Peça de Teatro', type: 'theater' }],
        '2024-12-28': [{ name: 'Baile de Fim de Ano', type: 'culture' }],
        '2025-01-05': [{ name: 'Aula de Dança', type: 'culture' }],
        '2025-01-12': [{ name: 'Jogo de Futebol', type: 'sport' }],
        '2025-01-19': [{ name: 'Concerto de Fado', type: 'music' }],
        '2025-01-26': [{ name: 'Workshop de Teatro', type: 'theater' }]
    };
    
    function renderCalendar(date) {
        const year = date.getFullYear();
        const month = date.getMonth();
        
        // Atualizar título
        const monthNames = [
            'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
            'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
        ];
        calendarTitle.textContent = `${monthNames[month]} ${year}`;
        
        // Limpar calendário
        calendarGrid.innerHTML = '';
        
        // Adicionar cabeçalhos dos dias da semana
        const dayHeaders = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        dayHeaders.forEach(day => {
            const dayHeader = document.createElement('div');
            dayHeader.className = 'calendar-day-header';
            dayHeader.textContent = day;
            dayHeader.style.cssText = `
                background-color: var(--primary-light);
                color: var(--white);
                padding: var(--spacing-sm);
                text-align: center;
                font-weight: 600;
                font-size: var(--font-size-sm);
            `;
            calendarGrid.appendChild(dayHeader);
        });
        
        // Primeiro dia do mês e último dia do mês anterior
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const startDate = new Date(firstDay);
        startDate.setDate(startDate.getDate() - firstDay.getDay());
        
        // Gerar dias do calendário
        const today = new Date();
        for (let i = 0; i < 42; i++) {
            const currentDay = new Date(startDate);
            currentDay.setDate(startDate.getDate() + i);
            
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            
            // Verificar se é do mês atual
            if (currentDay.getMonth() !== month) {
                dayElement.classList.add('other-month');
            }
            
            // Verificar se é hoje
            if (currentDay.toDateString() === today.toDateString()) {
                dayElement.classList.add('today');
            }
            
            // Número do dia
            const dayNumber = document.createElement('div');
            dayNumber.className = 'calendar-day-number';
            dayNumber.textContent = currentDay.getDate();
            dayElement.appendChild(dayNumber);
            
            // Verificar eventos
            const dateKey = currentDay.toISOString().split('T')[0];
            if (events[dateKey]) {
                dayElement.classList.add('has-event');
                events[dateKey].forEach(event => {
                    const eventElement = document.createElement('div');
                    eventElement.className = `calendar-event ${event.type}`;
                    eventElement.textContent = event.name;
                    eventElement.title = event.name;
                    dayElement.appendChild(eventElement);
                });
            }
            
            // Adicionar evento de clique
            dayElement.addEventListener('click', () => {
                if (events[dateKey]) {
                    showEventDetails(currentDay, events[dateKey]);
                }
            });
            
            calendarGrid.appendChild(dayElement);
        }
    }
    
    function showEventDetails(date, dayEvents) {
        const dateStr = date.toLocaleDateString('pt-PT', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        let eventsList = dayEvents.map(event => `• ${event.name}`).join('\n');
        
        alert(`Eventos para ${dateStr}:\n\n${eventsList}\n\nClique em "Ver Todas as Atividades" para mais detalhes.`);
    }
    
    // Event listeners para navegação
    if (prevButton) {
        prevButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() - 1);
            renderCalendar(currentDate);
        });
    }
    
    if (nextButton) {
        nextButton.addEventListener('click', () => {
            currentDate.setMonth(currentDate.getMonth() + 1);
            renderCalendar(currentDate);
        });
    }
    
    // Renderizar calendário inicial
    renderCalendar(currentDate);
}

// === PESQUISA ===
function initSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.querySelector('.search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            
            if (query) {
                // Simular pesquisa
                performSearch(query);
            }
        });
        
        // Pesquisa em tempo real (opcional)
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 3) {
                searchTimeout = setTimeout(() => {
                    showSearchSuggestions(query);
                }, 300);
            } else {
                hideSearchSuggestions();
            }
        });
    }
}

function performSearch(query) {
    // Dados de exemplo para pesquisa
    const searchData = [
        { type: 'associacao', name: 'Grupo Folclórico de Valongo', url: 'pages/associacoes/grupo-folclorico-valongo.html' },
        { type: 'associacao', name: 'Clube Desportivo de Ermesinde', url: 'pages/associacoes/clube-desportivo-ermesinde.html' },
        { type: 'atividade', name: 'Concerto de Natal', url: 'pages/atividades.html#concerto-natal' },
        { type: 'atividade', name: 'Torneio de Karaté', url: 'pages/atividades.html#torneio-karate' },
        { type: 'atividade', name: 'Teatro', url: 'pages/atividades.html?tipo=teatro' },
        { type: 'atividade', name: 'Música', url: 'pages/atividades.html?tipo=musica' }
    ];
    
    const results = searchData.filter(item => 
        item.name.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length > 0) {
        // Redirecionar para o primeiro resultado ou mostrar lista
        if (results.length === 1) {
            window.location.href = results[0].url;
        } else {
            // Redirecionar para página de atividades com filtro
            window.location.href = `pages/atividades.html?pesquisa=${encodeURIComponent(query)}`;
        }
    } else {
        alert(`Nenhum resultado encontrado para "${query}". Tente pesquisar por:\n• Nome de associação\n• Tipo de atividade (teatro, música, desporto)\n• Nome de evento`);
    }
}

function showSearchSuggestions(query) {
    // Implementar sugestões de pesquisa (opcional)
    // Por agora, apenas um placeholder
    console.log(`Sugestões para: ${query}`);
}

function hideSearchSuggestions() {
    // Esconder sugestões de pesquisa
    console.log('Esconder sugestões');
}

// === SCROLL SUAVE ===
function initSmoothScroll() {
    // Scroll suave para links âncora
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.offsetTop - headerHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// === UTILITÁRIOS ===
// Função para animar elementos quando entram na viewport
function observeElements() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });
    
    // Observar cards
    document.querySelectorAll('.card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}

// Inicializar animações quando a página carregar
window.addEventListener('load', observeElements);

// === ACESSIBILIDADE ===
// Melhorar navegação por teclado
document.addEventListener('keydown', function(e) {
    // Escape para fechar menu móvel
    if (e.key === 'Escape') {
        const navLinks = document.querySelector('.nav-links');
        const menuToggle = document.querySelector('.menu-toggle');
        
        if (navLinks && navLinks.classList.contains('active')) {
            navLinks.classList.remove('active');
            menuToggle.setAttribute('aria-expanded', 'false');
            menuToggle.focus();
        }
    }
});

// === PERFORMANCE ===
// Lazy loading para imagens (se houver)
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

