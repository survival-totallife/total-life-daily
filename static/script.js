/**
 * Wellness Guide - Frontend JavaScript
 * Handles chat interactions with the FastAPI backend
 * 
 * TEMPORARY FRONTEND - For experimental use only
 */

// =============================================================================
// CONFIGURATION
// =============================================================================

const API_BASE_URL = window.location.origin;
const CHAT_ENDPOINT = `${API_BASE_URL}/chat/debug`;

// =============================================================================
// DOM ELEMENTS
// =============================================================================

const elements = {
    searchForm: document.getElementById('search-form'),
    searchInput: document.getElementById('search-input'),
    welcomeState: document.getElementById('welcome-state'),
    loadingState: document.getElementById('loading-state'),
    resultsState: document.getElementById('results-state'),
    errorState: document.getElementById('error-state'),
    answerContent: document.getElementById('answer-content'),
    referencesToggle: document.getElementById('references-toggle'),
    referencesList: document.getElementById('references-list'),
    errorMessage: document.getElementById('error-message'),
    retryBtn: document.getElementById('retry-btn'),
    exampleBtns: document.querySelectorAll('.example-btn')
};

// =============================================================================
// STATE MANAGEMENT
// =============================================================================

let currentQuery = '';

function showState(stateName) {
    // Hide all states
    elements.welcomeState.classList.add('hidden');
    elements.loadingState.classList.add('hidden');
    elements.resultsState.classList.add('hidden');
    elements.errorState.classList.add('hidden');

    // Show requested state
    switch (stateName) {
        case 'welcome':
            elements.welcomeState.classList.remove('hidden');
            break;
        case 'loading':
            elements.loadingState.classList.remove('hidden');
            break;
        case 'results':
            elements.resultsState.classList.remove('hidden');
            break;
        case 'error':
            elements.errorState.classList.remove('hidden');
            break;
    }
}

// =============================================================================
// CITATION PARSING
// =============================================================================

/**
 * Parses the answer text and converts [Source: N] citations to clickable superscripts
 * @param {string} text - The raw answer text from the API
 * @param {Array} articles - The retrieved articles array
 * @returns {string} HTML with parsed citations
 */
function parseCitations(text, articles) {
    // Create a map of article IDs for quick lookup (convert to string for consistent matching)
    const articleMap = new Map(articles.map(a => [String(a.id), a]));
    
    // Track which sources are actually cited (in order of appearance)
    const citedSources = [];
    
    // First pass: collect all cited sources in order (handles both numeric and string IDs like PMIDs)
    const citationRegex = /\[Source:\s*([^\]]+)\]/g;
    let match;
    while ((match = citationRegex.exec(text)) !== null) {
        const sourceId = match[1].trim();
        if (!citedSources.includes(sourceId) && articleMap.has(sourceId)) {
            citedSources.push(sourceId);
        }
    }
    
    // Create display number mapping (1-indexed based on order of appearance)
    const displayNumberMap = new Map();
    citedSources.forEach((sourceId, index) => {
        displayNumberMap.set(sourceId, index + 1);
    });
    
    // Second pass: replace citations with superscript links
    const parsedText = text.replace(citationRegex, (match, sourceIdStr) => {
        const sourceId = sourceIdStr.trim();
        const displayNum = displayNumberMap.get(sourceId);
        
        if (displayNum) {
            return `<a href="#ref-${sourceId}" class="citation" data-source-id="${sourceId}" onclick="scrollToReference('${sourceId}'); return false;">[${displayNum}]</a>`;
        }
        return match; // Keep original if not found
    });
    
    // Convert newlines to paragraphs for better formatting
    const paragraphs = parsedText
        .split(/\n\n+/)
        .filter(p => p.trim())
        .map(p => `<p>${p.replace(/\n/g, '<br>')}</p>`)
        .join('');
    
    return paragraphs || `<p>${parsedText}</p>`;
}

/**
 * Renders the references list from retrieved articles
 * @param {Array} articles - The retrieved articles array  
 * @param {string} answerText - The answer text to check which sources were cited
 */
function renderReferences(articles, answerText) {
    // Extract cited source IDs from the answer (now handles both numeric and string IDs like PMIDs)
    const citationRegex = /\[Source:\s*([^\]]+)\]/g;
    const citedIds = [];
    let match;
    while ((match = citationRegex.exec(answerText)) !== null) {
        const id = match[1].trim();
        if (!citedIds.includes(id)) {
            citedIds.push(id);
        }
    }
    
    // Filter to only show cited articles, in citation order
    const citedArticles = citedIds
        .map(id => articles.find(a => String(a.id) === String(id)))
        .filter(Boolean);
    
    // If no citations found in text, show all retrieved articles
    const articlesToShow = citedArticles.length > 0 ? citedArticles : articles;
    
    if (articlesToShow.length === 0) {
        elements.referencesList.innerHTML = '<p style="color: var(--text-muted); font-style: italic;">No sources found.</p>';
        return;
    }
    
    const referencesHTML = articlesToShow.map((article, index) => {
        // Build the metadata line with available fields
        const metaParts = [];
        if (article.authors) metaParts.push(article.authors);
        if (article.journal) metaParts.push(article.journal);
        if (article.year) metaParts.push(article.year);
        const metaLine = metaParts.join(' • ') || `PMID: ${article.id}`;
        
        // Make title a clickable link if URL is available
        const titleHtml = article.url && article.url !== '#' 
            ? `<a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="reference-title-link">${escapeHtml(article.title)}</a>`
            : `<span class="reference-title">${escapeHtml(article.title)}</span>`;
        
        return `
            <div class="reference-item" id="ref-${article.id}" data-ref-id="${article.id}">
                <span class="reference-number">${index + 1}.</span>
                <div class="reference-content">
                    ${titleHtml}
                    <div class="reference-meta">${escapeHtml(metaLine)}</div>
                </div>
            </div>
        `;
    }).join('');
    
    elements.referencesList.innerHTML = referencesHTML;
}

/**
 * Scrolls to a reference and highlights it
 * @param {string|number} sourceId - The source ID (PMID) to scroll to
 */
function scrollToReference(sourceId) {
    const refElement = document.getElementById(`ref-${sourceId}`);
    if (!refElement) return;
    
    // Scroll to reference
    refElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Highlight effect
    refElement.classList.add('highlighted');
    setTimeout(() => {
        refElement.classList.remove('highlighted');
    }, 2000);
}

// Make scrollToReference globally accessible
window.scrollToReference = scrollToReference;

// =============================================================================
// TYPEWRITER ANIMATION
// =============================================================================

/**
 * Animates text with a typewriter effect, revealing references as citations appear
 * @param {HTMLElement} element - The element to animate text into
 * @param {string} html - The HTML content to animate
 * @param {Array} articles - The articles array for reference rendering
 * @param {number} speed - Milliseconds per character (default: 15)
 * @returns {Promise} Resolves when animation completes
 */
function typewriterEffect(element, html, articles, speed = 15) {
    return new Promise((resolve) => {
        element.innerHTML = '';
        element.classList.add('typing');
        
        // Track revealed references
        const revealedRefs = new Set();
        let refDisplayIndex = 0;
        
        // Create a temporary container to parse HTML
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        // Get all text nodes and elements
        const nodes = [];
        function extractNodes(parent) {
            parent.childNodes.forEach(node => {
                if (node.nodeType === Node.TEXT_NODE) {
                    // Split text into characters
                    node.textContent.split('').forEach(char => {
                        nodes.push({ type: 'char', content: char });
                    });
                } else if (node.nodeType === Node.ELEMENT_NODE) {
                    // Check if this is a citation link
                    const isCitation = node.classList && node.classList.contains('citation');
                    const sourceId = isCitation ? node.getAttribute('data-source-id') : null;
                    
                    nodes.push({ type: 'openTag', element: node.cloneNode(false), isCitation, sourceId });
                    extractNodes(node);
                    nodes.push({ type: 'closeTag', tagName: node.tagName, isCitation, sourceId });
                }
            });
        }
        extractNodes(temp);
        
        // Build the content progressively
        let currentIndex = 0;
        const elementStack = [element];
        
        function addNextNode() {
            if (currentIndex >= nodes.length) {
                element.classList.remove('typing');
                resolve();
                return;
            }
            
            const node = nodes[currentIndex];
            const currentParent = elementStack[elementStack.length - 1];
            
            if (node.type === 'char') {
                const span = document.createElement('span');
                span.className = 'char';
                span.textContent = node.content;
                span.style.animationDelay = '0ms';
                currentParent.appendChild(span);
                currentIndex++;
                setTimeout(addNextNode, node.content === ' ' ? speed / 3 : speed);
            } else if (node.type === 'openTag') {
                const newElement = node.element;
                currentParent.appendChild(newElement);
                elementStack.push(newElement);
                currentIndex++;
                addNextNode(); // No delay for opening tags
            } else if (node.type === 'closeTag') {
                // When closing a citation tag, reveal the corresponding reference
                if (node.isCitation && node.sourceId && !revealedRefs.has(node.sourceId)) {
                    revealedRefs.add(node.sourceId);
                    revealReference(node.sourceId, articles, refDisplayIndex);
                    refDisplayIndex++;
                }
                elementStack.pop();
                currentIndex++;
                addNextNode(); // No delay for closing tags
            }
        }
        
        // Start the animation
        addNextNode();
    });
}

/**
 * Reveals a single reference with animation
 * @param {string} sourceId - The source ID (PMID) to reveal
 * @param {Array} articles - All retrieved articles
 * @param {number} displayIndex - The display number (0-indexed)
 */
function revealReference(sourceId, articles, displayIndex) {
    const article = articles.find(a => String(a.id) === String(sourceId));
    if (!article) return;
    
    // Check if already added
    if (document.getElementById(`ref-${sourceId}`)) return;
    
    // Build the metadata line with available fields
    const metaParts = [];
    if (article.authors) metaParts.push(article.authors);
    if (article.journal) metaParts.push(article.journal);
    if (article.year) metaParts.push(article.year);
    const metaLine = metaParts.join(' • ') || `PMID: ${article.id}`;
    
    // Make title a clickable link if URL is available
    const titleHtml = article.url && article.url !== '#' 
        ? `<a href="${escapeHtml(article.url)}" target="_blank" rel="noopener noreferrer" class="reference-title-link">${escapeHtml(article.title)}</a>`
        : `<span class="reference-title">${escapeHtml(article.title)}</span>`;
    
    // Create reference element
    const refItem = document.createElement('div');
    refItem.className = 'reference-item reference-item-animate';
    refItem.id = `ref-${article.id}`;
    refItem.setAttribute('data-ref-id', article.id);
    refItem.innerHTML = `
        <span class="reference-number">${displayIndex + 1}.</span>
        <div class="reference-content">
            ${titleHtml}
            <div class="reference-meta">${escapeHtml(metaLine)}</div>
        </div>
    `;
    
    elements.referencesList.appendChild(refItem);
}

// =============================================================================
// API INTERACTION
// =============================================================================

async function sendQuery(query) {
    currentQuery = query;
    showState('loading');
    elements.searchInput.value = query;
    
    try {
        const response = await fetch(CHAT_ENDPOINT, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: query })
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        displayResults(data);
        
    } catch (error) {
        console.error('Error fetching response:', error);
        showError(error.message);
    }
}

async function displayResults(data) {
    // Parse answer with citations
    const parsedAnswer = parseCitations(data.answer, data.retrieved_articles);
    
    // Clear previous content
    elements.answerContent.innerHTML = '';
    elements.referencesList.innerHTML = ''; // Clear references - they'll appear as citations are typed
    
    // Show results state first
    showState('results');
    
    // Then animate the answer text with typewriter effect, passing articles for reference reveal
    await typewriterEffect(elements.answerContent, parsedAnswer, data.retrieved_articles, 12);
}

function showError(message) {
    elements.errorMessage.textContent = message || 'Something went wrong. Please try again.';
    showState('error');
}

// =============================================================================
// EVENT HANDLERS
// =============================================================================

// Form submission
elements.searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const query = elements.searchInput.value.trim();
    if (query) {
        sendQuery(query);
    }
});

// Example query buttons
elements.exampleBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const query = btn.dataset.query;
        sendQuery(query);
    });
});

// References toggle (now toggles to collapse, since expanded by default)
function toggleReferences() {
    elements.referencesList.classList.toggle('collapsed');
    elements.referencesToggle.classList.toggle('collapsed');
}

elements.referencesToggle.addEventListener('click', toggleReferences);

// Retry button
elements.retryBtn.addEventListener('click', () => {
    if (currentQuery) {
        sendQuery(currentQuery);
    } else {
        showState('welcome');
    }
});

// =============================================================================
// UTILITY FUNCTIONS
// =============================================================================

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// =============================================================================
// INITIALIZATION
// =============================================================================

document.addEventListener('DOMContentLoaded', () => {
    showState('welcome');
    elements.searchInput.focus();
});
