
const load = () => {
    fetch("https://openapi.programming-hero.com/api/peddy/pets")
        .then(res => res.json())
        .then(data => displayPets(data.pets))  
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
    const likedImage = document.getElementById('liked-image');
    likedImage.src = imageSrc;
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
