export async function fetchEvents() {
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
  
 export const addEvents = (events) => {
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

  
  
  