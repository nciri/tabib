-- Table users
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    pseudonymized_id UUID NOT NULL,
    name BYTEA NOT NULL,
    address BYTEA,
    medical_history BYTEA,
    allergies BYTEA,
    emergency_contact BYTEA,
    date_of_birth DATE
);

-- Table practitioners
CREATE TABLE practitioners (
    practitioner_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    specialty VARCHAR(100),
    location VARCHAR(255),
    bio TEXT,
    experience_years INTEGER,
    consultation_fee NUMERIC(10, 2)
);

-- Table intervention_types
CREATE TABLE intervention_types (
    intervention_type_id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT
);

-- Table practitioner_interventions
CREATE TABLE practitioner_interventions (
    practitioner_intervention_id SERIAL PRIMARY KEY,
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    intervention_type_id INTEGER NOT NULL REFERENCES intervention_types(intervention_type_id) ON DELETE CASCADE,
    duration_minutes INTEGER NOT NULL,
    cost NUMERIC(10, 2) NOT NULL
);

-- Table schedules
CREATE TABLE schedules (
    schedule_id SERIAL PRIMARY KEY,
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    unavailable_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

-- Table appointments
CREATE TABLE appointments (
    appointment_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    intervention_type_id INTEGER NOT NULL REFERENCES intervention_types(intervention_type_id) ON DELETE CASCADE,
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table invoices
CREATE TABLE invoices (
    invoice_id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table payments
CREATE TABLE payments (
    payment_id SERIAL PRIMARY KEY,
    invoice_id INTEGER NOT NULL REFERENCES invoices(invoice_id) ON DELETE CASCADE,
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'completed'
);

-- Table prescriptions
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_signed BOOLEAN NOT NULL DEFAULT FALSE,
    external_code VARCHAR(50),
    external_notes TEXT,
    external_stamp TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table prescription_medications
CREATE TABLE prescription_medications (
    medication_id SERIAL PRIMARY KEY,
    prescription_id INTEGER NOT NULL REFERENCES prescriptions(id) ON DELETE CASCADE,
    drug_name VARCHAR(100) NOT NULL,
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    instructions TEXT
);

-- Table medical_documents
CREATE TABLE medical_documents (
    document_id SERIAL PRIMARY KEY,
    patient_id INTEGER NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    appointment_id INTEGER REFERENCES appointments(appointment_id) ON DELETE CASCADE,
    document_type VARCHAR(50),
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table practitioners_assistants
CREATE TABLE practitioners_assistants (
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    assistant_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    PRIMARY KEY (practitioner_id, assistant_id)
);

-- Table assistants_practitioners
CREATE TABLE assistants_practitioners (
    assistant_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(practitioner_id) ON DELETE CASCADE,
    PRIMARY KEY (assistant_id, practitioner_id)
);

-- Table notifications
CREATE TABLE notifications (
    notification_id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
    message BYTEA NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);