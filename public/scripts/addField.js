document.querySelector('#add-time')
.addEventListener('click', addTimeFields);

// It adds a new set of schedule fields only if the last set is completely filled out
function addTimeFields() {
  const arrayTimeFields = document.querySelectorAll('.schedule-item');
  const lastTimeFields = arrayTimeFields[arrayTimeFields.length - 1]; // Getting the last element

  const fields = lastTimeFields.querySelectorAll('input');
  
  // Verify if each field is empty or not.
  // If all fields is not empty then I can copy
  // Otherwise, do nothing
  let canIClone = true;
  
  // If at least one of the fields is empty, canIClone will be false
  fields.forEach( field => {
    if ( field.value === "") {
      canIClone = false;
    }
  } );
  
  if (canIClone) {
    cloneField(lastTimeFields);
  }
  else {
    alert("Não é permitido adicionar novos horários se os anteriores não forem totalmente preenchidos!");
  }


}

// It deletes a set of time fields
// "this" refers to the delete button element that was clicked
// The function deletes the row of inputs that the button belongs
function deleteTimeFields() {
  const parentElement = this.parentElement;

  parentElement.remove();
}

function cloneField(timeFields) {
  const newFieldContainer = timeFields.cloneNode(true);

  const fields = newFieldContainer.querySelectorAll('input');

  // It verifies if the container element already have a delete button element
  let deleteButtonEl = newFieldContainer.querySelector('.delete-time');

  fields.forEach(function(field) {
    field.value="";
  });

  // It creates a new delete button element and appends to the container if the container copied doesn't have this button
  // The first and default container doesn't have the delete button
  if ( deleteButtonEl === null) {
    deleteButtonEl = document.createElement('button');

    deleteButtonEl.setAttribute('type', 'button');
    deleteButtonEl.setAttribute('class', 'delete-time');

    deleteButtonEl.addEventListener('click', deleteTimeFields);

    deleteButtonEl.innerHTML = '<img src="/images/icons/delete.svg" alt="Delete">';

    newFieldContainer.appendChild(deleteButtonEl);

  }
  else {
    // the method cloneNode() doesn't copy the event handlers
    // This line adds an event listener to the delete button element
    // This event deletes the row of time inputs
    deleteButtonEl.addEventListener('click', deleteTimeFields);
  }

  document.querySelector('#schedule-items').appendChild(newFieldContainer);
}