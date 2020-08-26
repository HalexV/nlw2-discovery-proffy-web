const counter = document.querySelector("#counter");
const queryParams = window.location.search; // It returns the query params from the URL.

let time = 3;

counter.innerHTML = time;

function countDown(){
  if (time === 0) {
    counter.innerHTML = time;
    clearInterval(myInterval);
    window.location.href = `/study${queryParams}`;
  }
  else{
    time--;
    counter.innerHTML = time;
  }
}

var myInterval = setInterval(() => {
  countDown();
}, 1000);