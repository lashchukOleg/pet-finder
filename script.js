function clampNumber(value, min, max) {
    return Math.min(max, Math.max(min, value));
}

function applyTheme(theme) {
    if (theme === 'contrast') {
        document.documentElement.dataset.theme = 'contrast';
    } else {
        delete document.documentElement.dataset.theme;
    }

    const toggle = document.getElementById('contrast-toggle');
    if (toggle) {
        toggle.setAttribute('aria-pressed', theme === 'contrast' ? 'true' : 'false');
    }
}

function applyFontScale(scale) {
    const normalized = clampNumber(scale, 1, 1.6);
    document.documentElement.style.setProperty('--font-scale', String(normalized));
    localStorage.setItem('pf-font-scale', String(normalized));
}

function initAccessibilityControls() {
    const contrastToggle = document.getElementById('contrast-toggle');
    const decBtn = document.getElementById('text-decrease');
    const resetBtn = document.getElementById('text-reset');
    const incBtn = document.getElementById('text-increase');

    if (!contrastToggle && !decBtn && !resetBtn && !incBtn) return;

    const savedTheme = localStorage.getItem('pf-theme') || 'default';
    applyTheme(savedTheme);

    const savedScale = Number.parseFloat(localStorage.getItem('pf-font-scale') || '1');
    applyFontScale(Number.isFinite(savedScale) ? savedScale : 1);

    if (contrastToggle) {
        contrastToggle.addEventListener('click', () => {
            const current = document.documentElement.dataset.theme === 'contrast' ? 'contrast' : 'default';
            const next = current === 'contrast' ? 'default' : 'contrast';
            localStorage.setItem('pf-theme', next);
            applyTheme(next);
        });
    }

    const step = 0.1;

    if (decBtn) {
        decBtn.addEventListener('click', () => {
            const current = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale')) || 1;
            applyFontScale(current - step);
        });
    }

    if (incBtn) {
        incBtn.addEventListener('click', () => {
            const current = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--font-scale')) || 1;
            applyFontScale(current + step);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            applyFontScale(1);
        });
    }
}

function initMapSearch() {
    const searchBtn = document.getElementById('city-search-btn');
    const cityInput = document.getElementById('city-search');
    const shelters = Array.from(document.querySelectorAll('.shelter-item'));

    if (!searchBtn || !cityInput || shelters.length === 0) return;

    searchBtn.addEventListener('click', () => {
        const searchText = cityInput.value.toLowerCase().trim();

        if (searchText === "") {
            alert("ProszД™ wpisaД‡ nazwД™ miasta.");
            return;
        }

        let firstMatch = null;

        shelters.forEach((shelter) => {
            const shelterCity = shelter.textContent.toLowerCase();
            const matched = shelterCity.includes(searchText);

            shelter.classList.toggle('search-match', matched);
            if (matched && !firstMatch) firstMatch = shelter;
        });

        if (firstMatch) {
            firstMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else {
            alert("Niestety, nie znalezmy schroniska w tym miescie.");
        }
    });
}

function initShelterMap() {
    const mapFrame = document.getElementById('main-map');
    const shelters = Array.from(document.querySelectorAll('.shelter-item'));

    if (!mapFrame || shelters.length === 0) return;

    shelters.forEach((shelter) => {
        shelter.addEventListener('click', () => {
            const address = shelter.getAttribute('data-address');
            if (!address) return;

            const newMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            mapFrame.src = newMapUrl;

            shelters.forEach((s) => s.classList.remove('active-shelter'));
            shelter.classList.add('active-shelter');

            mapFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
}

function initContactForm() {
    const contactForm = document.getElementById('contact-form');
    if (!contactForm) return;

    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        let isValid = true;
        const fields = ['name', 'email', 'message'];

        fields.forEach((fieldId) => {
            const field = document.getElementById(fieldId);
            if (!field) return;

            const parent = field.parentElement;

            if (!field.value.trim() || (fieldId === 'email' && !field.value.includes('@'))) {
                parent.classList.add('invalid');
                isValid = false;
            } else {
                parent.classList.remove('invalid');
            }
        });

        if (isValid) {
            const success = document.getElementById('form-success');
            if (success) success.style.display = 'block';
            contactForm.reset();
        }
    });
}

function initResponsiveNavigation() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const navToggle = header.querySelector('.nav-toggle');
    const mainNav = header.querySelector('.main-nav');

    if (!navToggle || !mainNav) return;

    const mobileQuery = window.matchMedia('(max-width: 800px)');

    function setNavOpen(isOpen) {
        header.classList.toggle('nav-open', isOpen);
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    }

    function closeAllDropdowns() {
        header.querySelectorAll('.dropdown.open').forEach((dropdown) => {
            dropdown.classList.remove('open');
            const btn = dropdown.querySelector('.dropdown-toggle');
            if (btn) btn.setAttribute('aria-expanded', 'false');
        });
    }

    navToggle.addEventListener('click', () => {
        const isOpen = !header.classList.contains('nav-open');
        setNavOpen(isOpen);
        if (!isOpen) closeAllDropdowns();
    });

    header.querySelectorAll('.dropdown-toggle').forEach((button) => {
        const parent = button.closest('.dropdown');
        if (!parent) return;

        button.addEventListener('click', (event) => {
            event.preventDefault();

            const shouldOpen = !parent.classList.contains('open');
            closeAllDropdowns();
            parent.classList.toggle('open', shouldOpen);
            button.setAttribute('aria-expanded', shouldOpen ? 'true' : 'false');
        });
    });

    header.querySelectorAll('.main-nav a').forEach((link) => {
        link.addEventListener('click', () => {
            if (mobileQuery.matches) setNavOpen(false);
        });
    });

    document.addEventListener('click', (event) => {
        if (!header.contains(event.target)) closeAllDropdowns();
    });

    document.addEventListener('keydown', (event) => {
        if (event.key !== 'Escape') return;
        setNavOpen(false);
        closeAllDropdowns();
    });

    function syncOnResize() {
        if (!mobileQuery.matches) {
            setNavOpen(false);
        }
    }

    if (typeof mobileQuery.addEventListener === 'function') {
        mobileQuery.addEventListener('change', syncOnResize);
    } else if (typeof mobileQuery.addListener === 'function') {
        mobileQuery.addListener(syncOnResize);
    }

    syncOnResize();
}

document.addEventListener('DOMContentLoaded', () => {
    initAccessibilityControls();
    initMapSearch();
    initShelterMap();
    initContactForm();
    initResponsiveNavigation();
});
