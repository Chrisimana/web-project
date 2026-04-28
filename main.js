// Fungsi untuk mengurutkan projects berdasarkan title (A-Z)
function sortProjectsByTitle(projectsArray) {
    return [...projectsArray].sort((a, b) => {
        // Bandingkan title secara case-insensitive
        return a.title.localeCompare(b.title, 'id', { sensitivity: 'base' });
    });
}

// Fungsi sederhana untuk menghindari XSS
function escapeHtml(str) {
    if (!str) return '';
    return str
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

// Fungsi untuk render projects
function renderProjects() {
    const projectsGrid = document.getElementById('projects-grid');
    
    // Kosongkan grid terlebih dahulu
    projectsGrid.innerHTML = '';
    
    // Urutkan projects berdasarkan abjad title A-Z
    const sortedProjects = sortProjectsByTitle(projects);
    
    sortedProjects.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'project-card';
        projectCard.style.animationDelay = `${index * 0.05}s`;
        
        const tagsHTML = project.tags
            .map(tag => `<span class="tag">${escapeHtml(tag)}</span>`)
            .join('');
        
        const imageHTML = project.image 
            ? `<img src="${project.image}" alt="${escapeHtml(project.title)}" class="project-image" onerror="this.style.display='none'">`
            : '';
        
        projectCard.innerHTML = `
            ${imageHTML}
            <div class="project-content">
                <h2 class="project-title">${escapeHtml(project.title)}</h2>
                <p class="project-description">
                    ${escapeHtml(project.description)}
                </p>
                <div class="project-tags">
                    ${tagsHTML}
                </div>
                <a href="${project.link}" class="project-button">
                    Buka Project →
                </a>
            </div>
        `;
        
        projectsGrid.appendChild(projectCard);
    });
    
    // Update counter
    document.getElementById('project-count').textContent = sortedProjects.length;
}

// Jalankan saat DOM siap
document.addEventListener('DOMContentLoaded', renderProjects);