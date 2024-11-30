-- Base de données PostgreSQL pour une application de type Doctolib

-- Table des utilisateurs (patients, praticiens, et personnel)
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(100) NOT NULL,
    role VARCHAR(20) CHECK (role IN ('patient', 'praticien', 'admin', 'assistant')) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table des praticiens
CREATE TABLE practitioners (
    practitioner_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    specialty VARCHAR(100) NOT NULL,
    location VARCHAR(100),
    bio TEXT,
    experience_years INT CHECK (experience_years >= 0),
    consultation_fee DECIMAL(10, 2)
);

-- Table des patients
CREATE TABLE patients (
    patient_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    medical_history TEXT,
    allergies TEXT,
    emergency_contact VARCHAR(20)
);

-- Table des types d'intervention (consultation, chirurgie, suivi, etc.)
CREATE TABLE intervention_types (
    intervention_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table associant chaque praticien avec un type d'intervention et une durée spécifique
CREATE TABLE practitioner_interventions (
    practitioner_intervention_id SERIAL PRIMARY KEY,
    practitioner_id INT REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    intervention_type_id INT REFERENCES intervention_types(intervention_type_id) ON DELETE CASCADE,
    duration_minutes INT CHECK (duration_minutes > 0), -- Durée spécifique de l'intervention pour ce praticien en minutes
    cost DECIMAL(10, 2) -- Optionnel : Coût spécifique de l'intervention pour ce praticien
);

-- Modification de la table des rendez-vous pour inclure le type d'intervention et la durée
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id) ON DELETE CASCADE,
    practitioner_id INT REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    intervention_type_id INT REFERENCES intervention_types(intervention_type_id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    duration_minutes INT CHECK (duration_minutes > 0), -- Durée de l'intervention pour cet appointement
    status VARCHAR(20) CHECK (status IN ('scheduled', 'cancelled', 'completed', 'missed')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


-- Table pour la facturation
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    appointment_id INT REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(20) CHECK (status IN ('paid', 'pending', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table pour les paiements
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INT REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20) CHECK (status IN ('success', 'failed'))
);

-- Table des notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id) ON DELETE CASCADE,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de l’agenda des praticiens
CREATE TABLE schedules (
    schedule_id SERIAL PRIMARY KEY,
    practitioner_id INT REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    unavailable_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- Table des documents médicaux
CREATE TABLE medical_documents (
    document_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id) ON DELETE CASCADE,
    appointment_id INT REFERENCES appointments(appointment_id),
    document_type VARCHAR(50),
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table de recherche des praticiens (historique de recherche)
CREATE TABLE practitioner_search (
    search_id SERIAL PRIMARY KEY,
    patient_id INT REFERENCES patients(patient_id),
    search_term VARCHAR(100),
    search_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table d'analytique (rapports et statistiques)
CREATE TABLE analytics (
    analytic_id SERIAL PRIMARY KEY,
    metric VARCHAR(50) NOT NULL,
    value INT NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE practitioners_assistants (
    practitioner_id INT NOT NULL,
    assistant_id INT NOT NULL,
    PRIMARY KEY (practitioner_id, assistant_id),
    FOREIGN KEY (practitioner_id) REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    FOREIGN KEY (assistant_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Indexation pour optimiser les recherches
CREATE INDEX idx_practitioner_specialty ON practitioners(specialty);
CREATE INDEX idx_appointment_date ON appointments(appointment_date);
CREATE INDEX idx_user_role ON users(role);
