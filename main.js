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
      <p>Event</p>
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

function getBuyPageTemplate() {
  return `
  <div class="buyContent">
    <div class="titleBuy">Place an order</div>
    <label for="eventName">Event Name:</label>
    <div class="customDropdown">
      <input class="dropbtn" type="text" placeholder="Search.." id="dropdownInput">
      <div id="myDropdown" class="dropdown-content">
      </div>
    </div>

    <label for="numberOfTickets">Number of tickets:</label>
    <input type="text" id="nrOfTickets" placeholder="Enter number of tickets"><br>

    <h2>Ticket Options:</h2>
    <div id="ticketOptions"></div>

    <button id="addOrderButton">Add Order</button>
  </div>
  `;
}

function showDropdown() {
  document.getElementById("myDropdown").classList.toggle("show");
}

function filterFunction() {
  var input, filter, ul, li, a, i, div, txtValue;
  input = document.getElementById("dropdownInput");
  filter = input.value.toUpperCase();
  div = document.getElementById("myDropdown");
  a = div.getElementsByTagName("a");
  for (i = 0; i < a.length; i++) {
    txtValue = a[i].textContent || a[i].innerText;
    if (txtValue.toUpperCase().indexOf(filter) > -1) {
      a[i].style.display = "";
    } else {
      a[i].style.display = "none";
    }
  }
}



var selectedEventId = -1;

function makeOrder() {
  const addOrderButton = document.getElementById('addOrderButton');
  const eventNameInput = document.getElementById('dropdownInput');
  const nrOfTicketsInput = document.getElementById('nrOfTickets');
  const ticketOptions = document.getElementById('ticketOptions');

  addOrderButton.addEventListener('click', () => {
    const eventName = eventNameInput.value;
    const nrOfTickets = nrOfTicketsInput.value;
    const ticketOption = document.querySelector('input[name="ticketOption"]:checked');

    if (selectedEventId != -1 && nrOfTickets && ticketOption) {
      const order = {
        eventId: selectedEventId,
        numberOfTickets: parseInt(nrOfTickets),
        ticketCategoryId: parseInt(ticketOption.value)
      };
      fetch('http://localhost:8080/api/saveorder', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(order)
      })
       
    }
  });

  const dropbtn = document.querySelector('.dropbtn');
  dropbtn.addEventListener('click', showDropdown);

  var dropdownInput = document.getElementById('dropdownInput');
  dropdownInput.addEventListener('keyup', filterFunction);

  const dropdownContent = document.getElementById('myDropdown');
  // get all events
  const myEvents = fetchEvents();
  myEvents.then((events) => {
    events.forEach((event) => {
      const eventLink = document.createElement('a');
      eventLink.href = '#';
      eventLink.textContent = event.name;
      eventLink.onclick = function () {return false;};
      eventLink.addEventListener('click', () => {
        dropdownInput = document.getElementById('dropdownInput');
        dropdownInput.value = event.name;
        console.log(dropdownInput, event.name);
        dropdownContent.classList.toggle('show');
        selectedEventId = event.id;
        // add the radio buttons for the ticket options
        ticketOptions.innerHTML = '';
        event.ticketCategories.forEach((ticketCategory) => {
          const ticketOptionLabel = document.createElement('label');
          ticketOptionLabel.innerHTML = `
          <input type="radio" name="ticketOption" value="${ticketCategory.id}" />
            ${ticketCategory.description} - ${ticketCategory.price}
          `;
          ticketOptions.appendChild(ticketOptionLabel);
        });
        return false;
      });
      dropdownContent.appendChild(eventLink);
    });
  });
}

function renderBuyPage() {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getBuyPageTemplate();
  makeOrder();
  
}



var selectedVenue = 0;
var selectedEventType = 0;

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
///////////////////////////////////////////////////////////////////////////EVENT////////////////////////////////////////////////////////

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


function openLogicForFilters() {
  const filterBtn = document.querySelector('.filterBtn');
  filterBtn.addEventListener('click', () => {
    const filters = document.querySelector('.filters');
    if (filters.style.display === '') {
      filters.style.display = 'none';
    }
    filters.style.display = filters.style.display === 'none' ? 'flex' : 'none';
  });
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

////////////////////////////////////////////////////////////////EVENT/////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////ORDER/////////////////////////////////////////////////////////////

const addOrder = (orders) => {
  const ordersDiv = document.querySelector('.orders');
  ordersDiv.innerHTML = 'No orders found';
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
    <div class="createOrder" id="purchase-${orderData.id}">
      <p >${orderData.event.name}</p>
      <p >${orderData.numberOfTickets}</p>
      <p>${orderData.ticketCategory.description}</p>
      <p >${new Date(orderData.timestamp).toLocaleDateString()}</p>
      <p >${orderData.totalPrice}</p>
      <p class="actions">
        <button id="deleteButton-${orderData.id}"><i class="fas fa-trash"></i></button>
        <button id="editButton-${orderData.id}"><i class="far fa-edit"></i></button> 
        <button id="saveButton-${orderData.id}"><i class="fas fa-check "></i></button> 
        <button id="cancelButton-${orderData.id}"><i class="fas fa-times"></i></button> 
      </p>
    </div>
   </div>
   <div class="separatorOrder"></div>
  `;

  orderDiv.innerHTML = orderElement;

  const editButton = orderDiv.querySelector(`#editButton-${orderData.id}`);
  const saveButton = orderDiv.querySelector(`#saveButton-${orderData.id}`);
  const cancelButton = orderDiv.querySelector(`#cancelButton-${orderData.id}`);
  const deleteButton = orderDiv.querySelector(`#deleteButton-${orderData.id}`);

  saveButton.classList.add('hidden-element');
  cancelButton.classList.add('hidden-element');

  editButton.addEventListener('click', () => {
    if (saveButton.classList.contains('hidden-element') && cancelButton.classList.contains('hidden-element')) {
      saveButton.classList.remove('hidden-element');
      cancelButton.classList.remove('hidden-element');
      deleteButton.classList.add('hidden-element');
    } else {
      saveButton.classList.add('hidden-element');
      cancelButton.classList.add('hidden-element');
      deleteButton.classList.remove('hidden-element');
    }
  });

  deleteButton.addEventListener('click', () => {
    fetch(`http://localhost:8080/api/deleteorder/${orderData.id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      }
    })
      .then(data => {
        const purchaseToBeRemoved = document.getElementById(`purchase-${orderData.id}`);
        purchaseToBeRemoved.remove();
        toastr.success('Success');
      })

  });

  return orderDiv;
}


async function fetchOrders() {
  const response = await fetch('http://localhost:8080/api/getorders')
  const data = await response.json();
  console.log(data);
  return data;
}

function renderOrdersPage(categories) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = getOrdersPageTemplate();

  fetchOrders().then((data) => {
    addOrder(data);
  });
}

//////////////////////////////////////////////////////////////////ORDER////////////////////////////////////////////////////////

// Render content based on URL
function renderContent(url) {
  const mainContentDiv = document.querySelector('.main-content-component');
  mainContentDiv.innerHTML = '';

  if (url === '/') {
    renderHomePage();
  } else if (url === '/orders') {
    renderOrdersPage();
  } else if (url === '/buy') {
    renderBuyPage()
  }
}

// Call the setup functions
setupNavigationEvents();
setupMobileMenuEvent();
setupPopstateEvent();
setupInitialPage();
