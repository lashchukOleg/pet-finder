document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.querySelector('.btn-small');
    const cityInput = document.getElementById('city-search');
    const shelters = document.querySelectorAll('.shelter-item');

    searchBtn.addEventListener('click', () => {
        const searchText = cityInput.value.toLowerCase().trim();

        if (searchText === "") {
            alert("Proszę wpisać nazwę miasta.");
            return;
        }

        let found = false;

        shelters.forEach(shelter => {
            const shelterCity = shelter.textContent.toLowerCase();
            
            if (shelterCity.includes(searchText)) {
               
                shelter.style.border = "2px solid #e67e22";
                shelter.style.backgroundColor = "#fff3e0";
                found = true;
                
              
                shelter.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                
                shelter.style.border = "none";
                shelter.style.borderLeft = "4px solid #e67e22";
                shelter.style.backgroundColor = "#f4f7f6";
            }
        });

        if (!found) {
            alert("Niestety, nie znaleźliśmy schroniska w tym mieście.");
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mapFrame = document.getElementById('main-map');
    const shelters = document.querySelectorAll('.shelter-item');

    shelters.forEach(shelter => {
        shelter.addEventListener('click', () => {
           
            const address = shelter.getAttribute('data-address');
            
           
            const newMapUrl = `https://maps.google.com/maps?q=${encodeURIComponent(address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;
            
            
            mapFrame.src = newMapUrl;

            
            shelters.forEach(s => s.classList.remove('active-shelter'));
            shelter.classList.add('active-shelter');

           
            mapFrame.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
    });
});


const contactForm = document.getElementById('contact-form');

if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        const fields = ['name', 'email', 'message'];

        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            const parent = field.parentElement;
            
            if (!field.value.trim() || (fieldId === 'email' && !field.value.includes('@'))) {
                parent.classList.add('invalid');
                isValid = false;
            } else {
                parent.classList.remove('invalid');
            }
        });

        if (isValid) {
            document.getElementById('form-success').style.display = 'block';
            contactForm.reset();
            
        }
    });
}