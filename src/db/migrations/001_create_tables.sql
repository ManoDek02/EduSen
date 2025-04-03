-- Création de la table users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    matricule VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    nom VARCHAR(100) NOT NULL,
    prenom VARCHAR(100) NOT NULL,
    role ENUM('admin', 'professeur', 'eleve', 'parent') NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Création de la table eleves
CREATE TABLE IF NOT EXISTS eleves (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    classe VARCHAR(50) NOT NULL,
    date_naissance DATE NOT NULL,
    responsable VARCHAR(100) NOT NULL,
    status ENUM('Actif', 'Inactif') NOT NULL DEFAULT 'Actif',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Création de la table professeurs
CREATE TABLE IF NOT EXISTS professeurs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    matiere VARCHAR(100) NOT NULL,
    telephone VARCHAR(20),
    status ENUM('Temps plein', 'Temps partiel', 'Vacataire') NOT NULL DEFAULT 'Temps plein',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Création de la table notes
CREATE TABLE IF NOT EXISTS notes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT,
    professeur_id INT,
    matiere VARCHAR(100) NOT NULL,
    note DECIMAL(4,2) NOT NULL CHECK (note >= 0 AND note <= 20),
    coefficient INT NOT NULL DEFAULT 1,
    trimestre INT NOT NULL CHECK (trimestre >= 1 AND trimestre <= 3),
    date_evaluation DATE NOT NULL,
    commentaire TEXT,
    type VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id),
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id)
);

-- Création de la table bulletins
CREATE TABLE IF NOT EXISTS bulletins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    eleve_id INT,
    trimestre INT NOT NULL CHECK (trimestre >= 1 AND trimestre <= 3),
    annee VARCHAR(9) NOT NULL,
    moyenne_generale DECIMAL(4,2) NOT NULL,
    moyenne_classe DECIMAL(4,2) NOT NULL,
    appreciation_generale TEXT,
    status ENUM('brouillon', 'publié', 'archivé') NOT NULL DEFAULT 'brouillon',
    date_printed TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (eleve_id) REFERENCES eleves(id)
);

-- Création de la table bulletin_matieres
CREATE TABLE IF NOT EXISTS bulletin_matieres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    bulletin_id INT,
    matiere VARCHAR(100) NOT NULL,
    moyenne DECIMAL(4,2) NOT NULL,
    moyenne_classe DECIMAL(4,2) NOT NULL,
    appreciation TEXT,
    professeur VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (bulletin_id) REFERENCES bulletins(id)
);

-- Création de la table cours
CREATE TABLE IF NOT EXISTS cours (
    id INT AUTO_INCREMENT PRIMARY KEY,
    classe VARCHAR(50) NOT NULL,
    matiere VARCHAR(100) NOT NULL,
    professeur_id INT,
    salle VARCHAR(50) NOT NULL,
    jour INT NOT NULL CHECK (jour >= 0 AND jour <= 4),
    debut INT NOT NULL CHECK (debut >= 0 AND debut <= 7),
    duree INT NOT NULL CHECK (duree >= 1 AND duree <= 4),
    couleur VARCHAR(7) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (professeur_id) REFERENCES professeurs(id)
);

-- Création de la table notifications
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'warning', 'success') NOT NULL,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
); 