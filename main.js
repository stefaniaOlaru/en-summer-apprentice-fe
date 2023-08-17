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
    <div class = "contentSearch">
    <div class = "filterBtn"> <i class="fa-solid fa-filter"></i> </div>
      <div class="search-box">
        <a class="search-btn" href="#">
         <i class="fas fa-search"></i>
       </a>
        <input class="search-txt" id="filter-name" type="text"  name="" placeholder="Search for events">
        <span class = "clear" />
      </div>
    </div>
    <div class="filtersWrapper">
      <div class="filters">
        <div class="venuesFilter filterSection"></div>
        <div class="eventTypesFilter filterSection"></div>
      </div>
    </div>
    <div class="events flex items-center justify-center flex-wrap">
    </div>
  </div>
  `;
}

function getOrdersPageTemplate() {
  return `
  <div id="content">
  <div class = "table">
    <div class = "tableHeader">
      <p>Order id</p>
      <p >Number of tickets</p>
      <p>Category</p>
      <p>Date</p>
      <p >Price</p>
      <p>Actions</p>
    </div>
  </div>
  <div class="orders "></div>
</div>
  `;
}

function getBuyPageTemplate(){
  return`
  <div>
    <h1>Hello</h1>
  </div>
  `;
}

const addOrder = (orders) => {
  const ordersDiv = document.querySelector('.orders');
  ordersDiv.innerHTML = 'No events found';
  if (orders.length) {
    ordersDiv.innerHTML = '';
    orders.forEach((order) => {
    ordersDiv.appendChild(createOrder(order));
    });
  }
};


const createOrder = (orderData) => {
  const orderDiv = document.createElement('div');
  const orderElement = `
  <div class="containerForOrders">
    <div class="createOrder">
      <p >${orderData.event.name}</p>
      <p >${orderData.numberOfTickets}</p>
      <p>${orderData.ticketCategory.description}</p>
      <p >${new Date(orderData.timestamp).toLocaleDateString()}</p>
      <p >${orderData.totalPrice}</p>
      <p class="actions">
      <i class="fa-solid fa-trash"></i>
        <i class="fa-regular fa-pen-to-square"></i>
      </p>
    </div>
   </div>
   <div class="separatorOrder"></div>
  `;
  orderDiv.innerHTML = orderElement;
  return orderDiv;
};


var selectedVenue = 0;
var selectedEventType = 0;

async function fetchOrders(){
  const response = await fetch('http://localhost:8080/api/getorders')
  const data = await response.json();
  console.log(data);
  return data;
}


async function fetchVenues() {
  const response = await fetch('http://localhost:8080/api/venues');
  const data = await response.json();
  return data;
}

async function fetchEventTypes() {
  const response = await fetch('http://localhost:8080/api/eventTypes');
  const data = await response.json();
  return data;
}

async function fetchEventsByVenueAndEventType(venueId, eventType) {
  const queryParams = [];
  if (venueId != 0) {
    queryParams.push(`venueId=${venueId}`);
  }
  if (eventType != 0) {
    queryParams.push(`eventType=${eventType}`);
  }
  const response = await fetch(`http://localhost:8080/api/events?${queryParams.join('&')}`);
  const data = await response.json();
  return data;
}

const createRadioForVenue = (venue) => {
  const vLabel = document.createElement('label');
  vLabel.innerHTML = `
  <input type="radio" name="venue" value="${venue.id}" />
    ${venue.location}
    `
  vLabel.addEventListener('click', () => {
    selectedVenue = venue.id;
    fetchEventsByVenueAndEventType(selectedVenue, selectedEventType).then((events) => {
      addEvents(events);
    });
  });
  return vLabel;
}

function addVenuesFilter(venues) {
  const venuesDiv = document.querySelector('.venuesFilter');
  venuesDiv.innerHTML = 'No venues found';
  if (venues.length) {
    venuesDiv.innerHTML = '';
    const noneOption = document.createElement('label');
    noneOption.innerHTML = `
    <input type="radio" name="venue" value="0" checked />
    None
    `
    noneOption.addEventListener('click', () => {
      selectedVenue = 0;
      fetchEventsByVenueAndEventType(selectedVenue, selectedEventType).then((events) => {
        addEvents(events);
      });
    });
    venuesDiv.appendChild(noneOption);
    venues.forEach((venue) => {
      venuesDiv.appendChild(createRadioForVenue(venue));
    });
  }
}

const createRadioForEventType = (eventType) => {
  const eLabel = document.createElement('label');
  eLabel.innerHTML = `
  <input type="radio" name="eventType" value="${eventType.id}" />
    ${eventType.name}
    `
  eLabel.addEventListener('click', () => {
    selectedEventType = eventType.name;
    fetchEventsByVenueAndEventType(selectedVenue, selectedEventType).then((events) => {
      addEvents(events);
    });
  });
  return eLabel;
}

function addEventTypesFilter(eventTypes) {
  const eventTypesDiv = document.querySelector('.eventTypesFilter');
  eventTypesDiv.innerHTML = 'No event types found';
  if (eventTypes.length) {
    eventTypesDiv.innerHTML = '';
    const noneOption = document.createElement('label');
    noneOption.innerHTML = `
    <input type="radio" name="eventType" value="0" checked />
    None
    `
    noneOption.addEventListener('click', () => {
      selectedEventType = 0;
      fetchEventsByVenueAndEventType(selectedVenue, selectedEventType).then((events) => {
        addEvents(events);
      });
    });
    eventTypesDiv.appendChild(noneOption);
    eventTypes.forEach((eventType) => {
      eventTypesDiv.appendChild(createRadioForEventType(eventType));
    });
  }
}

// events list
const eventsList = [];



function liveSearch() {
  const filterInput = document.querySelector('#filter-name');

  if (filterInput) {
    const searchValue = filterInput.value;
    console.log(searchValue);

    if (searchValue !== undefined) {
      const filteredEvents = eventsList.filter((event) =>
        event.name.toLowerCase().includes(searchValue.toLowerCase())
      );

      addEvents(filteredEvents);
    }
  }
}

function setupFilterEvents() {
  const nameFilterInput = document.querySelector('#filter-name');

  if (nameFilterInput) {
    const filterInterval = 500;
    nameFilterInput.addEventListener('keyup', () => {
      setTimeout(liveSearch, filterInterval);
    });
  }
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
  // search();

  fetchEvents().then((data) => {
    addEvents(data);
  });
  setupFilterEvents();
  

  fetchVenues().then((data) => {
    addVenuesFilter(data);
  });

  fetchEventTypes().then((data) => {
    addEventTypesFilter(data);
  }
  );
  openLogicForFilters();
}

function openLogicForFilters() {
  const filterBtn = document.querySelector('.filterBtn');
  filterBtn.addEventListener('click', () => {
    const filters = document.querySelector('.filters');
    if(filters.style.display === ''){
      filters.style.display = 'none';
    }
    filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
  });
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  fetchOrders().then((data) => {
    addOrder(data);
  });
}

function renderBuyPage(){
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getBuyPageTemplate();
}


async function fetchEvents() {
  const response = await fetch('http://localhost:8080/api/allEvents');
  // const response = await fetch('/api/Event/GetAll');
  const data = await response.json();
  console.log(data);
  // clear events list
  eventsList.splice(0, eventsList.length);
  // add events to list
  data.forEach((event) => {
    eventsList.push(event);
  });
  return data;
}

const addEvents = (events) => {
  const eventsDiv = document.querySelector('.events');
  eventsDiv.innerHTML = 'No events found';
  if (events.length) {
    eventsDiv.innerHTML = '';
    events.forEach((event) => {
      eventsDiv.appendChild(createEvent(event));
    });
  }
};

const createEvent = (eventData) => {
  const eventDiv = document.createElement('div');
  const eventElement = `
  <div class ="container">
  <div class = "flip-card">
    <div class = "flip-card-inner">
      <div class = "flip-card-front">
        <img src = "./src/assets/${eventData.name}.jpeg">
        <p class = "title">${eventData.name}</p>
      </div>

      <div class = "flip-card-back">
        <p class = "title">${eventData.name}</p>
        <div class="separator"></div>
        <p class="type">${eventData.type}</p>
        ${eventData.ticketCategories.map((category) => {
          return `<p class="priceDescription">${category.description}: ${category.price}</p>`;
        }).join('')}
        <p class="info">
          <i class = "fas fa-map-marker-alt"></i>
            ${eventData.venue.location}
        </p>
       <p class="info">
          <i class = "fas fa-calendar-alt"></i>
            ${new Date(eventData.startDate).toLocaleDateString()}
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
    renderOrdersPage();
  } else if(url === '/buy'){
    renderBuyPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
