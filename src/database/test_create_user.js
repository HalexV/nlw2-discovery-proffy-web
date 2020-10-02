const Database = require('./db');
const createUser = require('./createUser');

Database.then(async (db) => {
  // Inserir dados

  userValue = {
    email: 'halexx003@gmail.com',
    password: '123456',
    createdAt: Date.now()
  };

  
  /* try{
    await createUser(db, {userValue});
  } catch(err) {
    console.log(err);
  } */

  // Consultar os dados inseridos

  // todos os users
  const selectedUsers = await db.all("SELECT * FROM users");
  console.log(selectedUsers);

} );