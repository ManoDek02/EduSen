// config/database.ts
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
  host: 'localhost', // ou 127.0.0.1
  user: 'root',      // ton utilisateur MySQL
  password: 'D@kar2015', // ton mot de passe
  database: 'school_management', // nom de ta base
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

export default pool;
