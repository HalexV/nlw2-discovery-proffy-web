const subjects = [
  "Artes",
  "Biologia",
  "Ciências",
  "Educação Física",
  "Física",
  "Geografia",
  "História",
  "Matemática",
  "Português",
  "Química"
];

const weekdays = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado"
];

function getSubject(subjectNumber) {
  const position = +subjectNumber - 1; 
  return subjects[position];
}

function convertHoursToMinutes(time) {
  const [hour, minutes] = time.split(":");
  return Number((hour * 60) + Number(minutes));
}

function convertMinutesToHours(time) {
  let hour = Math.floor(time/60);
  let minutes = time%60;

  if (hour < 10) {
    hour = `0${hour}`;
  }
  
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  return `${hour}:${minutes}`;  
}

module.exports = {
  subjects,
  weekdays,
  getSubject,
  convertHoursToMinutes,
  convertMinutesToHours
};