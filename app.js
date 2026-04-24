document.addEventListener('DOMContentLoaded', () => {
    const navTree = document.getElementById('nav-tree');
    const contentArea = document.getElementById('content');
    const breadcrumb = document.getElementById('breadcrumb');
    const searchInput = document.querySelector('.search-bar input');
    const themeToggleBtn = document.getElementById('theme-toggle');
    const sidebar = document.getElementById('sidebar');
    const minimizeBtn = document.getElementById('sidebar-minimize-btn');

    // Theme Toggle Logic
    themeToggleBtn.addEventListener('click', () => {
        const html = document.documentElement;
        if (html.getAttribute('data-theme') === 'light') {
            html.removeAttribute('data-theme');
        } else {
            html.setAttribute('data-theme', 'light');
        }
    });

    // Sidebar Minimize Logic
    if (minimizeBtn) {
        minimizeBtn.addEventListener('click', () => {
            sidebar.classList.toggle('minimized');
        });
    }

    // Mobile Menu Toggle Logic
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const sidebarBackdrop = document.getElementById('sidebar-backdrop');

    if (mobileMenuToggle && sidebarBackdrop) {
        function toggleMobileMenu() {
            sidebar.classList.toggle('mobile-open');
            sidebarBackdrop.classList.toggle('show');
        }

        mobileMenuToggle.addEventListener('click', toggleMobileMenu);
        sidebarBackdrop.addEventListener('click', toggleMobileMenu);

        // Also close sidebar on mobile when a link is clicked
        document.addEventListener('click', (e) => {
            if (e.target.closest('.nav-item') && window.innerWidth <= 768) {
                sidebar.classList.remove('mobile-open');
                sidebarBackdrop.classList.remove('show');
            }
        });
    }

    // Bling Colors as requested
    const blingColors = [
        '#FFF59D', // Soft Yellow
        '#80CBC4', // Seafoam Green
        '#90CAF9', // Sky Blue
        '#CE93D8', // Light Purple
        '#F48FB1', // Rose Pink
        '#FFCC80'  // Peach
    ];
    let blingIndex = 0;

    // Setup Marked.js Options
    marked.use({
        breaks: true,
        gfm: true
    });

    // Handle Link Rewriting (Sphinx internal links like '../library/index.md#something')
    marked.use({
        renderer: {
            link(token) {
                // In newest marked, the token object itself is passed
                const href = token.href || "";
                const text = token.text || "";
                
                if (href && (href.endsWith('.md') || href.includes('.md#'))) {
                    // Clean up to load internally instead of page break
                    return `<a href="#${href}" class="internal-link" data-href="${href}">${text}</a>`;
                }
                return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
            }
        }
    });

    // Fetch and Build Sidebar
    fetch('catalog.json')
        .then(res => res.json())
        .then(data => {
            navTree.innerHTML = '';
            buildSidebar(data, navTree);
            restoreState();
        })
        .catch(err => {
            console.error(err);
            navTree.innerHTML = '<div style="color: red; padding: 10px;">Failed to load index.</div>';
        });

    function buildSidebar(items, container, currentPath = '') {
        items.forEach(item => {
            const currentColor = blingColors[blingIndex % blingColors.length];
            blingIndex++;

            if (item.type === 'directory') {
                const folderDiv = document.createElement('div');
                folderDiv.className = 'nav-folder';
                folderDiv.style.setProperty('--bling-color', currentColor);

                const titleDiv = document.createElement('div');
                titleDiv.className = 'folder-title';
                titleDiv.innerHTML = `
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                    <span>${item.title}</span>
                `;
                
                const contentDiv = document.createElement('div');
                contentDiv.className = 'folder-content';
                
                titleDiv.addEventListener('click', () => {
                    folderDiv.classList.toggle('open');
                });

                folderDiv.appendChild(titleDiv);
                folderDiv.appendChild(contentDiv);
                container.appendChild(folderDiv);

                // Recursively build children
                buildSidebar(item.children, contentDiv, currentPath + item.title + ' / ');
            } else {
                // File
                const link = document.createElement('a');
                link.className = 'nav-item';
                link.textContent = item.title;
                link.style.setProperty('--bling-color', currentColor);
                link.setAttribute('data-path', item.path);
                // Also store the actual path as data-href to match internal link logic
                link.setAttribute('data-href', item.path);
                link.setAttribute('data-breadcrumb', currentPath + item.title);
                
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    // Remove active from others
                    document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
                    link.classList.add('active');
                    
                    loadContent(item.path, currentPath + item.title);
                    window.location.hash = item.path;
                });

                container.appendChild(link);
            }
        });
    }

    function loadContent(path, breadcrumbText) {
        // Compute base directory of current path to resolve relative links
        const pathParts = path.split('/');
        pathParts.pop(); // Remove filename
        const baseDir = pathParts.length > 0 ? pathParts.join('/') + '/' : '';

        // Show loading state
        contentArea.innerHTML = '<div style="padding: 40px; text-align: center; color: var(--text-secondary);">Loading...</div>';
        contentArea.classList.remove('fade-enter');
        
        fetch('content/' + path)
            .then(res => {
                if (!res.ok) throw new Error('Network response was not ok');
                return res.text();
            })
            .then(text => {
                contentArea.innerHTML = marked.parse(text);
                
                // Trigger reflow to restart animation
                void contentArea.offsetWidth;
                contentArea.classList.add('fade-enter');
                
                // Highlight code blocks
                document.querySelectorAll('pre code').forEach((block) => {
                    if (!block.classList.length) {
                        // Some blocks might not have languages, fallback
                        hljs.highlightElement(block);
                    } else {
                        hljs.highlightElement(block);
                    }
                });
                
                // Update breadcrumb
                breadcrumb.textContent = breadcrumbText || path;
                
                // Main content area scroll to top
                document.querySelector('.content-area').scrollTop = 0;
                
                // Attach internal link handlers
                document.querySelectorAll('a.internal-link').forEach(a => {
                    a.addEventListener('click', (e) => {
                        e.preventDefault();
                        const href = a.getAttribute('data-href');
                        
                        let cleanPath = href.split('#')[0];
                        if (cleanPath) {
                             // Handle relative paths. If it starts with '../', resolve it. 
                             // If it doesn't start with '/' and doesn't contain '..', it's relative to current baseDir
                             if (cleanPath.startsWith('../')) {
                                 // Basic parsing for '../'
                                 let upCount = (cleanPath.match(/\.\.\//g) || []).length;
                                 let targetPathParts = baseDir.split('/').filter(p => p !== '');
                                 for(let i=0; i<upCount; i++) { targetPathParts.pop(); }
                                 let newBase = targetPathParts.length > 0 ? targetPathParts.join('/') + '/' : '';
                                 cleanPath = newBase + cleanPath.replace(/\.\.\//g, '');
                             } else if (!cleanPath.startsWith('/')) {
                                 cleanPath = baseDir + cleanPath;
                             } else if (cleanPath.startsWith('/')) {
                                 cleanPath = cleanPath.substring(1);
                             }
                             
                             loadContent(cleanPath, cleanPath);
                             window.location.hash = cleanPath;
                        } else {
                            // Anchor link on same page
                            const hash = href.split('#')[1];
                            if(hash) {
                                window.location.hash = path + '#' + hash;
                            }
                        }
                    });
                });
            })
            .catch(err => {
                console.error('Fetch error:', err);
                contentArea.innerHTML = `<div style="padding: 40px; color: red;">Error loading document: ${path}<br><br><small>Check console for details.</small></div>`;
            });
    }

    function restoreState() {
        const hash = window.location.hash.slice(1);
        if (hash) {
            const pathOnly = hash.split('#')[0];
            // Find the link
            const target = document.querySelector(`.nav-item[data-path="${pathOnly}"]`);
            if (target) {
                // Open parent folders
                let parent = target.parentElement;
                while (parent && parent.id !== 'nav-tree') {
                    if (parent.classList.contains('nav-folder')) {
                        parent.classList.add('open');
                    }
                    parent = parent.parentElement;
                }
                
                target.click();
                
                // If there's an anchor, try to scroll to it after loading
                const anchor = hash.split('#')[1];
                if(anchor) {
                    setTimeout(() => {
                        const el = document.getElementById(anchor);
                        if(el) el.scrollIntoView({behavior: 'smooth'});
                    }, 500); // Give it some time to render
                } else {
                    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }

            } else {
                loadContent(pathOnly, pathOnly);
            }
        }
    }

    // Sidebar search filter simple implementation
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase();
        const items = document.querySelectorAll('.nav-item');
        
        items.forEach(item => {
            const text = item.textContent.toLowerCase();
            if (text.includes(query)) {
                item.style.display = 'block';
                // Open parent
                let parent = item.parentElement;
                while(parent && parent.classList && parent.classList.contains('folder-content')){
                    parent.parentElement.classList.add('open');
                    parent = parent.parentElement.parentElement;
                }
            } else {
                item.style.display = 'none';
            }
        });
    });
    searchInput.removeAttribute('disabled');
    searchInput.placeholder = 'Search topics...';
});
