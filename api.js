let currentPets = [];
document.querySelector('.sort-btn').addEventListener('click', () => {
    const sortedPets = [...currentPets].sort((a, b) => b.price - a.price);
    displayPets(sortedPets);
});

const fetchPetCategories = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
        .then(res => res.json())
        .then(data => displayCategories(data.categories))
        .catch(error => console.log(error));
}

function displayCategories(categories) {
    const categoryContainer = document.querySelector('.category');
    categoryContainer.innerHTML = '';

    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'card bg-base-100 shadow-md flex flex-row gap-2 items-center justify-center category-card';
        categoryCard.setAttribute('data-category', category.category);

        categoryCard.innerHTML = `
            <img src="${category.category_icon}" alt="${category.category}" class="sm:w-16 w-8 sm:h-16 h-8 mb-2">
            <h3 class="sm:text-2xl text-xl font-bold">${category.category}</h3>
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
        .then(data => displayPets(data.data, true))
        .catch(error => console.log(error));
}

function displayPets(pets, cate = false) {
    currentPets = pets;
    const showDiv = document.querySelector('.show');

    if (cate) {
        showDiv.classList.add('sm:w-[880px]', 'sm:h-[480px]');
        showDiv.innerHTML = `<span class="loading loading-bars loading-lg sm:p-[25px] sm:mx-[700px] mx-[120px] my-[100px] sm:my-[150px]"></span>`;
        setTimeout(() => {

            showDiv.classList.remove('sm:w-[880px]', 'sm:h-[480px]');
            showDiv.innerHTML = "";


            renderPets(pets, showDiv);

        }, 2000);
    } else {
        renderPets(pets, showDiv);
    }
}


function renderPets(pets, showDiv) {

    showDiv.innerHTML = "";

    if (pets.length <= 0) {

        const petCard = document.createElement('div');
        petCard.classList.add('sm:pl-[500px]', 'text-center');
        petCard.innerHTML = `
            <div class="hero  h-fit sm:pr-[100px]">
            <div class="hero-content flex-col">
                <img
                src="images/error.webp"
                class="w-[50%] rounded-lg shadow-2xl" />
                <div>
                <h1 class="sm:text-5xl text-2xl font-bold">No Information Available</h1>
                <p class="py-6">
                    Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda excepturi exercitationem
                    quasi. In deleniti eaque aut repudiandae et a id nisi.
                </p>
                </div>
            </div>
            </div>
            `;
        showDiv.appendChild(petCard);
    }
    else {
        pets.forEach(pet => {
            const petCard = document.createElement('div');
            petCard.classList.add('card', 'bg-base-100', 'shadow-xl', 'p-6', 'rounded-[12px]');

            petCard.innerHTML = `
                <figure>
                    <img src="${pet.image}" alt="${pet.pet_name}" class="w-full h-48 object-cover pet-image rounded-[8px]">
                </figure>
                <div class="card-body px-0">
                    <h2 class="card-title text-[20px] font-bold">${pet.pet_name || 'Not Available'}</h2>
                    <p> <img src="images/i1.png" alt="" class='w-[20px] h-[20px] inline'> Breed: ${pet.breed || 'Not Available'}</p>
                    <p><img src="images/i2.png" alt="" class='w-[20px] h-[20px] inline'> Birth: ${pet.date_of_birth || 'Not Available'}</p>
                    <p><img src="images/i3.png" alt="" class='w-[20px] h-[23px] inline'> Gender: ${pet.gender || 'Not Available'}</p>
                    <p><img src="images/i4.png" alt="" class='w-[20px] h-[23px] inline'> Price: $${pet.price || 'Not Available'}</p>
                    <div class="flex sm:items-stretch justify-between ">
                        <button class="btn btn-ghost like-btn sm:px-3 px-0" data-image="${pet.image}"><img src="images/like.png" alt="" class='w-[20px] h-[20px]'></button>
                        <button class="btn btn-ghost adopt-btn text-[#0E7A81]">Adopt</button>
                        <button class="btn btn-ghost details-btn text-[#0E7A81]" data-pet-id="${pet.petId}">Details</button>
                        
                    </div>
                </div>
            `;

            showDiv.appendChild(petCard);
        });
    }

    setupEventListeners();
}


function setupEventListeners() {
    const likeButtons = document.querySelectorAll('.like-btn');
    const detailsButtons = document.querySelectorAll('.details-btn');
    const adoptButtons = document.querySelectorAll('.adopt-btn');

    likeButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const imageSrc = this.getAttribute('data-image');
            addLikedPet(imageSrc);
        });
    });

    detailsButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            const petId = this.getAttribute('data-pet-id');
            fetchPetDetailsById(petId);
        });
    });

    adoptButtons.forEach(btn => {
        btn.addEventListener('click', function () {
            showCongratsModal(btn);
        });
    });
    
}


function showCongratsModal(adoptButton) {
    const modal = document.getElementById('adopt-modal');
    const countdownTimer = document.getElementById('countdown1-timer');

    modal.classList.remove('hidden');

    let time = 3;
    const intervalId = setInterval(updateCountdown, 1000);

    function updateCountdown() {
        time--;
        countdownTimer.innerHTML = time;

        if (time <= 0) {
            countdownTimer.innerHTML = 3
            clearInterval(intervalId);
            closeModal();
            adoptButton.classList.add('disabled');
            adoptButton.disabled = true;
        }
    }
}




function closeModal() {
    const modal = document.getElementById('adopt-modal');
    modal.classList.add('hidden');
}



function addLikedPet(imageSrc) {
    const likedDiv = document.querySelector('.liked-grid');
    const likedCard = document.createElement('div');
    likedCard.classList.add('card', 'bg-base-100', 'shadow-xl', 'sm:mb-2', 'mb-2', 'sm:w-[124px]', 'sm:h-[124px]', 'w-[60px]', 'h-[60px]');

    likedCard.innerHTML = `
        <figure>
            <img src="${imageSrc}" class="w-full sm:h-[124px] h-[60px] object-cover rounded-[20px]">
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
        <div class='card-body p-0'>
        <img src="${pet.image}" alt="Not Available" class="w-full sm:h-[400px] object-cover rounded-[12px]">
        <h2 class="text-2xl font-bold">${pet.pet_name || 'Not Available'}</h2>
        <div class="flex items-center gap-[50px]">
            <div class='card-body p-0'>
                <p> <img src="images/i1.png" alt="" class='w-[20px] h-[20px] inline'> Breed: ${pet.breed || 'Not Available'}</p>
                <p><img src="images/i2.png" alt="" class='w-[20px] h-[20px] inline'> Birth: ${pet.date_of_birth|| 'Not Available'}</p>
                </div>
                <div class='card-body p-0'>
                    <p><img src="images/i3.png" alt="" class='w-[20px] h-[23px] inline'> Gender: ${pet.gender  || 'Not Available'}</p>
                <p><img src="images/i4.png" alt="" class='w-[20px] h-[23px] inline'> Price: $${pet.price || 'Not Available'}</p>
                </div>
            </div>
        <p><strong>Vaccination Status:</strong> ${pet.vaccinated_status || 'Not Available'}</p>
        <p><strong>Details:</strong> ${pet.pet_details || 'Not Available'}</p>
        </div>

    `;

    modal.classList.remove('hidden');
}

document.getElementById('close-modal').addEventListener('click', function () {
    document.getElementById('pet-modal').classList.add('hidden');
});


document.addEventListener("DOMContentLoaded", load);
