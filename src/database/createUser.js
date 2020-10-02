module.exports = async function(db, {userValue}) {
  // inserir dados na table de users

  const insertedUser = await db.run(`
    INSERT INTO users (
      email,
      password,
      createdAt
    ) VALUES (
      "${userValue.email}",
      "${userValue.password}",
      "${userValue.createdAt}"
    );
  `);

  const user_id = insertedUser.lastID;

  return user_id;

};