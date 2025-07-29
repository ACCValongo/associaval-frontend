// JavaScript para a página de Documentos

document.addEventListener('DOMContentLoaded', function() {
    initDocumentFilters();
    initDocumentSearch();
    initContactForm();
});

// === FILTROS DE DOCUMENTOS ===
function initDocumentFilters() {
    const filterType = document.getElementById('filter-type');
    const filterYear = document.getElementById('filter-year');
    const applyButton = document.getElementById('apply-doc-filters');
    const clearButton = document.getElementById('clear-doc-filters');
    
    // Aplicar filtros
    function applyDocumentFilters() {
        const typeValue = filterType?.value || '';
        const yearValue = filterYear?.value || '';
        
        const documents = document.querySelectorAll('[data-type]');
        let visibleCount = 0;
        
        documents.forEach(document => {
            const typeMatch = !typeValue || document.dataset.type === typeValue;
            const yearMatch = !yearValue || document.dataset.year === yearValue;
            
            if (typeMatch && yearMatch) {
                document.style.display = '';
                visibleCount++;
            } else {
                document.style.display = 'none';
            }
        });
        
        // Mostrar/esconder secções vazias
        updateSectionVisibility();
        
        // Mostrar mensagem se não houver resultados
        showDocumentNoResults(visibleCount === 0);
    }
    
    // Atualizar visibilidade das secções
    function updateSectionVisibility() {
        const sections = document.querySelectorAll('.magazine-section, .official-documents, .reportages-section');
        
        sections.forEach(section => {
            const visibleItems = section.querySelectorAll('[data-type]:not([style*="display: none"])');
            
            if (visibleItems.length === 0) {
                section.style.display = 'none';
            } else {
                section.style.display = '';
            }
        });
    }
    
    // Limpar filtros
    function clearDocumentFilters() {
        if (filterType) filterType.value = '';
        if (filterYear) filterYear.value = '';
        
        const documents = document.querySelectorAll('[data-type]');
        documents.forEach(document => {
            document.style.display = '';
        });
        
        const sections = document.querySelectorAll('.magazine-section, .official-documents, .reportages-section');
        sections.forEach(section => {
            section.style.display = '';
        });
        
        hideDocumentNoResults();
    }
    
    // Mostrar mensagem de sem resultados
    function showDocumentNoResults(show) {
        let noResultsElement = document.querySelector('.documents-no-results');
        const mainContent = document.querySelector('.main');
        
        if (show && !noResultsElement && mainContent) {
            noResultsElement = document.createElement('section');
            noResultsElement.className = 'documents-no-results';
            noResultsElement.innerHTML = `
                <div class="container">
                    <div class="no-results">
                        <h3>Nenhum documento encontrado</h3>
                        <p>Não foram encontrados documentos com os filtros selecionados.</p>
                        <button class="btn btn-primary" onclick="clearDocumentFilters()">Limpar Filtros</button>
                    </div>
                </div>
            `;
            
            // Inserir após a secção de filtros
            const filtersSection = document.querySelector('.documents-filters');
            if (filtersSection) {
                filtersSection.insertAdjacentElement('afterend', noResultsElement);
            }
        } else if (!show && noResultsElement) {
            noResultsElement.remove();
        }
    }
    
    function hideDocumentNoResults() {
        const noResultsElement = document.querySelector('.documents-no-results');
        if (noResultsElement) {
            noResultsElement.remove();
        }
    }
    
    // Event listeners
    if (applyButton) {
        applyButton.addEventListener('click', applyDocumentFilters);
    }
    
    if (clearButton) {
        clearButton.addEventListener('click', clearDocumentFilters);
    }
    
    // Aplicar filtros automaticamente
    [filterType, filterYear].forEach(filter => {
        if (filter) {
            filter.addEventListener('change', applyDocumentFilters);
        }
    });
    
    // Tornar função global
    window.clearDocumentFilters = clearDocumentFilters;
}

// === PESQUISA DE DOCUMENTOS ===
function initDocumentSearch() {
    const searchForm = document.querySelector('.search-form');
    const searchInput = document.getElementById('search-input');
    
    if (searchForm && searchInput) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query) {
                performDocumentSearch(query);
            }
        });
        
        // Pesquisa em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const query = this.value.trim();
            
            if (query.length >= 2) {
                searchTimeout = setTimeout(() => {
                    performDocumentSearch(query);
                }, 300);
            } else if (query.length === 0) {
                clearDocumentSearch();
            }
        });
    }
}

function performDocumentSearch(query) {
    const documents = document.querySelectorAll('[data-type]');
    let visibleCount = 0;
    
    const searchTerms = query.toLowerCase().split(' ');
    
    documents.forEach(document => {
        const title = document.querySelector('.magazine-title, .document-title, .reportage-title')?.textContent.toLowerCase() || '';
        const description = document.querySelector('.magazine-description, .document-description, .reportage-description')?.textContent.toLowerCase() || '';
        const meta = document.querySelector('.magazine-meta, .document-meta, .reportage-meta')?.textContent.toLowerCase() || '';
        
        const searchText = `${title} ${description} ${meta}`;
        
        const matches = searchTerms.every(term => searchText.includes(term));
        
        if (matches) {
            document.style.display = '';
            visibleCount++;
            highlightDocumentSearchTerms(document, searchTerms);
        } else {
            document.style.display = 'none';
            removeDocumentHighlights(document);
        }
    });
    
    // Atualizar visibilidade das secções
    updateSectionVisibility();
    
    // Mostrar mensagem se não houver resultados
    showDocumentSearchNoResults(visibleCount === 0, query);
}

function clearDocumentSearch() {
    const documents = document.querySelectorAll('[data-type]');
    
    documents.forEach(document => {
        document.style.display = '';
        removeDocumentHighlights(document);
    });
    
    const sections = document.querySelectorAll('.magazine-section, .official-documents, .reportages-section');
    sections.forEach(section => {
        section.style.display = '';
    });
    
    hideDocumentSearchNoResults();
}

function highlightDocumentSearchTerms(document, searchTerms) {
    const title = document.querySelector('.magazine-title, .document-title, .reportage-title');
    const description = document.querySelector('.magazine-description, .document-description, .reportage-description');
    
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

function removeDocumentHighlights(document) {
    const title = document.querySelector('.magazine-title, .document-title, .reportage-title');
    const description = document.querySelector('.magazine-description, .document-description, .reportage-description');
    
    [title, description].forEach(element => {
        if (element && element.dataset.originalText) {
            element.textContent = element.dataset.originalText;
        }
    });
}

function showDocumentSearchNoResults(show, query) {
    let noResultsElement = document.querySelector('.document-search-no-results');
    const mainContent = document.querySelector('.main');
    
    if (show && !noResultsElement && mainContent) {
        noResultsElement = document.createElement('section');
        noResultsElement.className = 'document-search-no-results';
        noResultsElement.innerHTML = `
            <div class="container">
                <div class="no-results">
                    <h3>Nenhum documento encontrado</h3>
                    <p>Não foram encontrados documentos para "${query}".</p>
                    <p>Sugestões:</p>
                    <ul style="text-align: left; display: inline-block; margin: var(--spacing-md) 0;">
                        <li>• Verifique a ortografia</li>
                        <li>• Use termos mais gerais</li>
                        <li>• Tente pesquisar por tipo de documento</li>
                        <li>• Procure por ano de publicação</li>
                    </ul>
                    <button class="btn btn-primary" onclick="clearDocumentSearchFromButton()">Limpar Pesquisa</button>
                </div>
            </div>
        `;
        
        const filtersSection = document.querySelector('.documents-filters');
        if (filtersSection) {
            filtersSection.insertAdjacentElement('afterend', noResultsElement);
        }
    } else if (!show && noResultsElement) {
        noResultsElement.remove();
    }
}

function hideDocumentSearchNoResults() {
    const noResultsElement = document.querySelector('.document-search-no-results');
    if (noResultsElement) {
        noResultsElement.remove();
    }
}

function clearDocumentSearchFromButton() {
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.value = '';
        clearDocumentSearch();
    }
}

// Atualizar visibilidade das secções (função auxiliar)
function updateSectionVisibility() {
    const sections = document.querySelectorAll('.magazine-section, .official-documents, .reportages-section');
    
    sections.forEach(section => {
        const visibleItems = section.querySelectorAll('[data-type]:not([style*="display: none"])');
        
        if (visibleItems.length === 0) {
            section.style.display = 'none';
        } else {
            section.style.display = '';
        }
    });
}

// === PRÉ-VISUALIZAÇÃO DE DOCUMENTOS ===
function previewDocument(filename) {
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-frame');
    
    if (modal && iframe) {
        // Construir URL do documento
        const documentUrl = `../documents/${filename}`;
        
        // Configurar iframe
        iframe.src = documentUrl;
        
        // Mostrar modal
        modal.style.display = 'block';
        
        // Adicionar event listener para fechar com ESC
        document.addEventListener('keydown', handlePreviewKeydown);
        
        // Prevenir scroll do body
        document.body.style.overflow = 'hidden';
    }
}

function closePreview() {
    const modal = document.getElementById('preview-modal');
    const iframe = document.getElementById('preview-frame');
    
    if (modal && iframe) {
        modal.style.display = 'none';
        iframe.src = '';
        
        // Remover event listener
        document.removeEventListener('keydown', handlePreviewKeydown);
        
        // Restaurar scroll do body
        document.body.style.overflow = '';
    }
}

function handlePreviewKeydown(e) {
    if (e.key === 'Escape') {
        closePreview();
    }
}

// Fechar modal ao clicar fora
document.addEventListener('click', function(e) {
    const modal = document.getElementById('preview-modal');
    if (e.target === modal) {
        closePreview();
    }
});

// === FORMULÁRIO DE CONTACTO ===
function initContactForm() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Obter dados do formulário
            const formData = new FormData(this);
            const data = {
                name: formData.get('name'),
                email: formData.get('email'),
                subject: formData.get('subject'),
                message: formData.get('message')
            };
            
            // Validar dados
            if (validateContactForm(data)) {
                submitContactForm(data);
            }
        });
    }
}

function validateContactForm(data) {
    const errors = [];
    
    if (!data.name || data.name.trim().length < 2) {
        errors.push('Nome deve ter pelo menos 2 caracteres');
    }
    
    if (!data.email || !isValidEmail(data.email)) {
        errors.push('E-mail deve ter um formato válido');
    }
    
    if (!data.subject || data.subject.trim().length < 3) {
        errors.push('Assunto deve ter pelo menos 3 caracteres');
    }
    
    if (!data.message || data.message.trim().length < 10) {
        errors.push('Mensagem deve ter pelo menos 10 caracteres');
    }
    
    if (errors.length > 0) {
        alert('Por favor, corrija os seguintes erros:\n\n' + errors.join('\n'));
        return false;
    }
    
    return true;
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function submitContactForm(data) {
    // Simular envio do formulário
    const submitButton = document.querySelector('.contact-form button[type="submit"]');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Simular delay de envio
    setTimeout(() => {
        alert('Mensagem enviada com sucesso! Entraremos em contacto consigo brevemente.');
        
        // Limpar formulário
        document.querySelector('.contact-form').reset();
        
        // Restaurar botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// === ANIMAÇÕES ===
document.addEventListener('DOMContentLoaded', function() {
    // Animação de entrada para os cards
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
    
    // Observar elementos
    document.querySelectorAll('.magazine-item, .document-category, .reportage-item, .value-card, .objective-item').forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(element);
    });
});

// === UTILITÁRIOS ===
// Função para download de documentos com tracking
function trackDocumentDownload(filename, type) {
    // Aqui poderia ser implementado tracking de analytics
    console.log(`Download: ${filename} (${type})`);
}

// Função para partilhar documento
function shareDocument(title, url) {
    if (navigator.share) {
        navigator.share({
            title: title,
            url: url
        }).catch(console.error);
    } else {
        // Fallback para browsers sem suporte
        const shareUrl = `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent('Confira este documento: ' + url)}`;
        window.open(shareUrl);
    }
}

// Tornar funções globais
window.previewDocument = previewDocument;
window.closePreview = closePreview;
window.clearDocumentSearchFromButton = clearDocumentSearchFromButton;
window.trackDocumentDownload = trackDocumentDownload;
window.shareDocument = shareDocument;

