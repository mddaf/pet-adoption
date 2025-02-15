
const fetchPetCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.log(error));
}

function displayCategories(categories) {
    const categoryContainer = document.querySelector('.categorey');
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'card bg-base-100 shadow-md p-4 m-2 flex flex-row gap-[10px] items-center category-card';
        categoryCard.setAttribute('data-category', category.category);

        categoryCard.innerHTML = `
            <img src="${category.category_icon}" alt="${category.category}" class="w-16 h-16 mb-2">
            <h3 class="text-xl font-bold">${category.category}</h3>
        `;


        categoryCard.addEventListener('click', () => {
            setActiveCategory(categoryCard);
            fetchPetsByCategory(category.category);
        });

        categoryContainer.appendChild(categoryCard);
    });
}

function setActiveCategory(selectedCategory) {

    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.classList.remove('active');
    });


    selectedCategory.classList.add('active');
}


fetchPetCategories();


const load = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => displayPets(data.pets))
        .catch(error => console.log(error));
}


function fetchPetsByCategory(categoryName) {
    fetch(`https://openapi.programming-hero.com/api/peddy/category/${categoryName}`)
        .then(res => res.json())
        .then(data => displayPets(data.data))
        .catch(error => console.log(error));
}

function displayPets(pets) {
    const showDiv = document.querySelector('.show');
    showDiv.classList.add('grid', 'grid-cols-3', 'gap-4');

    showDiv.innerHTML = "";

    pets.forEach(pet => {
        const petCard = document.createElement('div');
        petCard.classList.add('card', 'bg-base-100', 'shadow-xl', 'p-4');

        petCard.innerHTML = `
            <figure>
                <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover pet-image">
            </figure>
            <div class="card-body">
                <h2 class="card-title">${pet.pet_name}</h2>
                <p>Breed: ${pet.breed || 'Unknown'}</p>
                <p>Gender: ${pet.gender}</p>
                <p>Price: $${pet.price}</p>
                <p>Vaccination Status: ${pet.vaccinated_status}</p>
                <div class="card-actions justify-end">
                    <button class="btn btn-primary like-btn" data-image="${pet.image}">Like</button>
                    <button class="btn btn-secondary details-btn" data-pet-id="${pet.petId}">Details</button>
                </div>
            </div>
        `;

        showDiv.appendChild(petCard);
    });

    setupEventListeners();
}

function setupEventListeners() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const detailsButtons = document.querySelectorAll('.details-btn');

    likeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const imageSrc = this.getAttribute('data-image');
            addLikedPet(imageSrc);
        });
    });

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const petId = this.getAttribute('data-pet-id');
            fetchPetDetailsById(petId);
        });
    });
}

function addLikedPet(imageSrc) {
    const likedDiv = document.querySelector('.liked-grid');
    const likedCard = document.createElement('div');
    likedCard.classList.add('card', 'bg-base-100', 'shadow-xl');  

    likedCard.innerHTML = `
        <figure>
            <img src="${imageSrc}" class="w-full h-48 object-cover">
        </figure>
    `;

    likedDiv.appendChild(likedCard);  
}

function fetchPetDetailsById(petId) {
    fetch(`https://openapi.programming-hero.com/api/peddy/pet/${petId}`)
        .then(res => res.json())
        .then(data => {
            if (data.status) {
                showPetDetails(data.petData);
            } else {
                console.log("Error fetching pet details.");
            }
        })
        .catch(error => console.log(error));
}

function showPetDetails(pet) {
    const modal = document.getElementById('pet-modal');
    const modalBody = document.getElementById('modal-body');

    modalBody.innerHTML = `
        <h2 class="text-2xl font-bold">${pet.pet_name}</h2>
        <img src="${pet.image}" class="w-full h-48 object-cover my-4">
        <p><strong>Breed:</strong> ${pet.breed || 'Unknown'}</p>
        <p><strong>Category:</strong> ${pet.category}</p>
        <p><strong>Date of Birth:</strong> ${pet.date_of_birth || 'N/A'}</p>
        <p><strong>Price:</strong> $${pet.price}</p>
        <p><strong>Gender:</strong> ${pet.gender}</p>
        <p><strong>Vaccination Status:</strong> ${pet.vaccinated_status}</p>
        <p><strong>Details:</strong> ${pet.pet_details}</p>
    `;

    modal.classList.remove('hidden');
}

document.getElementById('close-modal').addEventListener('click', function() {
    document.getElementById('pet-modal').classList.add('hidden');
});


document.addEventListener("DOMContentLoaded", load);
