class Vault{

	constructor(dao){
		this.dao = dao;
		console.log('2. vault')
	}

	createTables ()  {
		const table1 = `CREATE TABLE IF NOT EXISTS passwordvault (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name VARCHAR,
      username VARCHAR,
      password VARCHAR);    
      `;
    const table2 = `CREATE TABLE IF NOT EXISTS userpassword(
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      password VARCHAR
      );`;
		console.log('3. create')
     this.dao.run(table1);
		 this.dao.run(table2);
	}

	create(name, username, password) {
    	return this.dao.run(
      'INSERT INTO passwordvault (name, username, password) VALUES (?,? , ?)',
      [name, username, password]);
 	}

 	update(id, name, username, password) {
    return this.dao.run(
      `UPDATE passwordvault SET name = ? , username = ? , password = ?  WHERE id = ?`,
      [name, username, password , id]
    );
  }

  delete(id) {
    return this.dao.run(
      `DELETE FROM passwordvault WHERE id = ?`,
      [id]
    )
  }

  getById(id) {
    return this.dao.get(
      `SELECT * FROM passwordvault WHERE id = ?`,
      [id])
  }

  getAll() {
    return this.dao.all(`SELECT * FROM passwordvault`)
  }
}

module.exports = Vault;