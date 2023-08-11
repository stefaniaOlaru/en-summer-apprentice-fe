import { data } from "autoprefixer";

// Navigate to a specific URL
function navigateTo(url) {
  history.pushState(null, null, url);
  renderContent(url);
}
// HTML templates
function getHomePageTemplate() {
  return `
   <div id="content">
      <h1 class = "color: text-white">WELCOME</h1>
      <div class="events flex items-center justify-center flex-wrap">
      </div>
    </div>
  `;
}

function getOrdersPageTemplate() {
  return `
    <div id="content">
    <h1 class="text-2xl mb-4 mt-8 text-center">Purchased Tickets</h1>
    </div>
  `;
}

function setupNavigationEvents() {
  console.log("setupNavigationEvents");
  const navLinks = document.querySelectorAll('nav a');
  navLinks.forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      const href = link.getAttribute('href');
      navigateTo(href);
    });
  });
}

function setupMobileMenuEvent() {
  console.log("setupMobileMenuEvent");
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileMenu = document.getElementById('mobileMenu');

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

function setupPopstateEvent() {
  console.log("setupPopstateEvent");
  window.addEventListener('popstate', () => {
    const currentUrl = window.location.pathname;
    renderContent(currentUrl);
  });
}

function setupInitialPage() {
  console
  const initialUrl = window.location.pathname;
  renderContent(initialUrl);
}

function renderHomePage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getHomePageTemplate();
 
  fetchEvents().then((data) =>{
    addEvents(data);
  });
  
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();
}

async function fetchEvents() {
  const response = await fetch('http://localhost:8080/api/allEvents');
 // const response = await fetch('/api/Event/GetAll');
  const data = await response.json();
  console.log(data);
  return data;
}

const addEvents = (events) =>{
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events found';
  if(events.length){
    eventsDiv.innerHTML = '';
    events.forEach((event) => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};

const createEvent = (eventData) =>{
  const eventDiv = document.createElement('div');
  const eventElement = `
  <div class ="container">
  <div class = "flip-card">
    <div class = "flip-card-inner">
      <div class = "flip-card-front">
        <img src = "./src/assets/${eventData.name}.jpeg">
      </div>

      <div class = "flip-card-back">
        <p class = "title">${eventData.name}</p>
        <div class="separator"></div>
        <p class="type">${eventData.eventType.name}</p>
        <p class="price">Free</p>

        <p class="info">
          <i class = "fas fa-map-marker-alt"></i>
            ${eventData.venue.location}
        </p>
       <p class="info">
          <i class = "fas fa-calendar-alt"></i>
            ${eventData.startDate}
        </p>

        <p class="info description">
          ${eventData.description}
       </p>
      </div>
    </div>
  </div>  
  </div>    
  `;
  eventDiv.innerHTML = eventElement;
  return eventDiv;
};

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
