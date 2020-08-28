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


function cloneField(timeFields) {
  const newFieldContainer = timeFields.cloneNode(true);

  const fields = newFieldContainer.querySelectorAll('input');

  fields.forEach(function(field) {
    field.value="";
  });

  document.querySelector('#schedule-items').appendChild(newFieldContainer);
}