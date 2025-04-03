import pool from '../config/database';

async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✅ Connexion à la base de données réussie');
    
    // Vérifier les tables
    const [tables] = await connection.query('SHOW TABLES');
    console.log('\n📋 Tables disponibles :');
    console.log(tables);
    
    connection.release();
  } catch (error) {
    console.error('❌ Erreur de connexion à la base de données :', error);
  } finally {
    await pool.end();
  }
}

testConnection(); 