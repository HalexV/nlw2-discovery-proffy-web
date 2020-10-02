const Database = require('./database/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authConfig = require("./config/auth.json");

const { subjects, weekdays, getSubject, convertHoursToMinutes, convertMinutesToHours } = require('./utils/format');

function generateToken(params = {}) {
  return jwt.sign(params, authConfig.secret, {
    expiresIn: 24 * 60 * 60,
  });
}

function pageLanding(req, res) {
  return res.render("index.html");
}

async function pageStudy(req, res) {
  const filters = req.query;

  if (!filters.subject || !filters.weekday || !filters.time) {
    return res.render("study.html", { filters, subjects, weekdays });
  }

  // converter horas em minutos
  const timeToMinutes = convertHoursToMinutes(filters.time);

  const query = `
    SELECT classes.*, proffys.*
    FROM proffys
    JOIN classes ON (classes.proffy_id = proffys.id)
    WHERE EXISTS (
      SELECT class_schedule.*
      FROM class_schedule
      WHERE class_schedule.class_id = classes.id
      AND class_schedule.weekday = ${filters.weekday}
      AND class_schedule.time_from <= ${timeToMinutes}
      AND class_schedule.time_to > ${timeToMinutes}
    )
    AND classes.subject = '${filters.subject}';
  `
  // caso haja erro na hora da consulta do banco de dados
  try {
    const db = await Database;
    const proffys = await db.all(query);

    proffys.map((proffy) => {
      proffy.subject = getSubject(proffy.subject);
    });

    return res.render('study.html', { proffys, subjects, filters, weekdays });

  } catch (error) {
    console.log(error);
  }

}

async function pageGiveClasses(req, res) {
  
  if ( req.query.getData ) {
    try {
      const db = await Database;
      const user_id = res.locals.user.id;
      
      const proffyValue = await db.get(`SELECT * FROM proffys WHERE user_id=${user_id};`);
      
      if (!proffyValue) {
        return res.json({status: null});
      }
      
      const classValue = await db.get(`SELECT * FROM classes WHERE proffy_id=${proffyValue.id};`);

      // It returns an array
      const classScheduleValues = await db.all(
        `SELECT * FROM class_schedule WHERE class_id=${classValue.id} ORDER BY weekday, time_from;`
        );
      
      classScheduleValues.map((scheduleValues) => {
        scheduleValues.time_from = convertMinutesToHours(scheduleValues.time_from);
        scheduleValues.time_to = convertMinutesToHours(scheduleValues.time_to);
      });
      
      
      
      res.json({status: "ok", proffyValue, classValue, classScheduleValues});
    } catch (err) {
      console.log(err);
    };
    
    
  } else {
    
    return res.render("give-classes.html", {subjects, weekdays});
  }

}

async function saveClasses(req, res) {
  const createProffy = require('./database/createProffy');
  
  const proffyValue = {
    name: req.body.name,
    avatar: req.body.avatar,
    whatsapp: req.body.whatsapp,
    bio: req.body.bio,
    user_id: res.locals.user.id
  }

  const classValue = {
    subject: req.body.subject,
    cost: req.body.cost
  }

  const classScheduleValues = req.body.weekday.map((weekday, index) => {

    return {
      weekday,
      time_from: convertHoursToMinutes(req.body.time_from[index]),
      time_to: convertHoursToMinutes(req.body.time_to[index])
    }

  });

  try {
    const db = await Database;
    const user_id = res.locals.user.id;

    const itHasProffy = await db.get(`SELECT * FROM proffys WHERE user_id=${user_id};`);

    if (!itHasProffy) {

      await createProffy(db, {proffyValue, classValue, classScheduleValues});
  
      let queryString = `?subject=${req.body.subject}&weekday=${req.body.weekday[0]}&time=${req.body.time_from[0]}`;
  
  
    
      return res.redirect("/success" + queryString);
    }

    const { id: classId } = await db.get(`SELECT id FROM classes WHERE proffy_id=${itHasProffy.id};`);

    // Let's deleting everything (updating)
    await db.run(`DELETE FROM class_schedule WHERE class_id=${classId}`);
    await db.run(`DELETE FROM classes WHERE proffy_id=${itHasProffy.id}`);
    await db.run(`DELETE FROM proffys WHERE user_id=${user_id}`);

    // Here's the update
    await createProffy(db, {proffyValue, classValue, classScheduleValues});
  
    let queryString = `?subject=${req.body.subject}&weekday=${req.body.weekday[0]}&time=${req.body.time_from[0]}`;
  
  
    
    return res.redirect("/success" + queryString);

    
  } catch (error) {
    console.log(error);
  }

}

function pageSuccess(req, res) {
  return res.render("success.html");
}

async function login(req, res) {
  if (req.method === "GET") {
    return res.render("login.html");
  } else if (req.method === "POST") {
    const { email, password } = req.body;
    const db = await Database;
    
    try {
      const user = await db.get(
        `SELECT * FROM users WHERE email="${email}";`
      );
      if (!user) {
        const errorMessage = "E-mail ou Senha incorretos!";
  
        return res.status(400).json({ errorMessage });
      }
      if (!await bcrypt.compare(password, user.password)) {
        const errorMessage = "E-mail ou Senha incorretos!";
  
        return res.status(400).json({ errorMessage });
      }

      // Gerando o token jwt
      const token = generateToken({ id: user.id });

      res.cookie('jwt', token, {
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000
      });
      
      return res.status(200).json({ user: user.id });
    } catch (err) {
      console.log(err);
    }
  }
  
}

function logout(req, res) {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}

async function createAccount(req, res) {
  if (req.method === 'GET') {
    return res.render("create-account.html");
  } else if (req.method === 'POST') {
    const { email, password, confirmPassword } = req.body;
    const db = await Database;
    const userValue = {};
    const createUser = require("./database/createUser");

    // Verifica se o email informado já foi cadastrado.
    try{
      const existUser = await db.get(
        `SELECT email FROM users WHERE email="${email}";`
      );
      if (existUser) {
        const errorMessage = "E-mail já cadastrado!";
  
        return res.status(400).json({ errorMessage });
      }
    } catch (err) {
      console.log(err);
    }

    // A senha deve ter no mínimo 8 caracteres
    if (password.length < 8) {
      const errorMessage = "A senha deve ter no mínimo 8 caracteres!";

      return res.status(400).json({ errorMessage });

    }

    // Verificando se a senha e a senha de confirmação são iguais
    if (password !== confirmPassword) {
      const errorMessage = "A senha e a confirmação da senha devem ser iguais!";

      return res.status(400).json({ errorMessage });

    }

    userValue.email = email;
    userValue.password = password;
    userValue.createdAt = Date.now();

    // Criptografando a senha
    const hash = await bcrypt.hash(userValue.password, 10);
    userValue.password = hash;

    const user_id = await createUser(db, {userValue});

    // Gerando o token jwt
    const token = generateToken({ id: user_id });

    res.cookie('jwt', token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(201).json({ user: user_id });
  }
}

module.exports = {
  pageLanding,
  pageStudy,
  pageGiveClasses,
  saveClasses,
  pageSuccess,
  login,
  logout,
  createAccount
};