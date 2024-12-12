-- Table users
CREATE TABLE users (
    id SERIAL PRIMARY KEY,  -- Changed from user_id
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(15),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table patients
CREATE TABLE patients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),  -- Updated reference
    pseudonymized_id UUID NOT NULL,
    name VARCHAR(20) NOT NULL,  -- Changed from BYTEA
    address VARCHAR(255),  -- Changed from BYTEA
    medical_history TEXT,  -- Changed from BYTEA
    allergies TEXT,  -- Changed from BYTEA
    emergency_contact VARCHAR(100),  -- Changed from BYTEA
    phone VARCHAR(20),  -- Added
    email VARCHAR(100),  -- Added
    date_of_birth DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table practitioners
CREATE TABLE practitioners (
    id SERIAL PRIMARY KEY,  -- Changed from practitioner_id
    user_id INTEGER NOT NULL REFERENCES users(id),  -- Updated reference
    specialty VARCHAR(100),
    location VARCHAR(255),
    bio TEXT,
    experience_years INTEGER,
    consultation_fee NUMERIC(10, 2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table intervention_types
CREATE TABLE intervention_types (
    id SERIAL PRIMARY KEY,  -- Changed from intervention_type_id
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table practitioner_interventions
CREATE TABLE practitioner_interventions (
    id SERIAL PRIMARY KEY,  -- Changed from practitioner_intervention_id
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),  -- Updated reference
    intervention_type_id INTEGER NOT NULL REFERENCES intervention_types(id),  -- Updated reference
    duration_minutes INTEGER NOT NULL,
    fees NUMERIC(10, 2) NOT NULL,  -- Renamed from cost
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table schedules
CREATE TABLE schedules (
    id SERIAL PRIMARY KEY,  -- Changed from schedule_id
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),  -- Updated reference
    unavailable_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table appointments
CREATE TABLE appointments (
    id SERIAL PRIMARY KEY,  -- Changed from appointment_id
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),  -- Updated reference
    intervention_type_id INTEGER NOT NULL REFERENCES intervention_types(id),  -- Updated reference
    appointment_date TIMESTAMP NOT NULL,
    duration INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    notes TEXT,  -- Changed type specification
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table invoices
CREATE TABLE invoices (
    id SERIAL PRIMARY KEY,  -- Changed from invoice_id
    appointment_id INTEGER NOT NULL REFERENCES appointments(id),  -- Updated reference
    amount NUMERIC(10, 2) NOT NULL,
    status VARCHAR(20) DEFAULT 'unpaid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table payments
CREATE TABLE payments (
    id SERIAL PRIMARY KEY,  -- Changed from payment_id
    invoice_id INTEGER NOT NULL REFERENCES invoices(id),  -- Updated reference
    payment_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    amount NUMERIC(10, 2) NOT NULL,
    payment_method VARCHAR(20),
    status VARCHAR(20) DEFAULT 'completed',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table prescriptions
CREATE TABLE prescriptions (
    id SERIAL PRIMARY KEY,
    appointment_id INTEGER NOT NULL REFERENCES appointments(id),  -- Updated reference
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
    id SERIAL PRIMARY KEY,  -- Changed from medication_id
    prescription_id INTEGER NOT NULL REFERENCES prescriptions(id),
    name VARCHAR(100) NOT NULL,  -- Renamed from drug_name
    dosage VARCHAR(50),
    frequency VARCHAR(50),
    duration VARCHAR(50),
    instructions TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Table medical_documents
CREATE TABLE medical_documents (
    id SERIAL PRIMARY KEY,  -- Changed from document_id
    patient_id INTEGER NOT NULL REFERENCES patients(id),
    appointment_id INTEGER REFERENCES appointments(id),  -- Updated reference
    document_type VARCHAR(50),
    file_path VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

-- Tables with composite keys - Added new id field
-- Table practitioners_assistants
CREATE TABLE practitioners_assistants (
    id SERIAL PRIMARY KEY,  -- Added new PK
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),
    assistant_id INTEGER NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (practitioner_id, assistant_id)
);

-- Table assistants_practitioners
CREATE TABLE assistants_practitioners (
    id SERIAL PRIMARY KEY,  -- Added new PK
    assistant_id INTEGER NOT NULL REFERENCES users(id),
    practitioner_id INTEGER NOT NULL REFERENCES practitioners(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL,
    UNIQUE (assistant_id, practitioner_id)
);

-- Table notifications
CREATE TABLE notifications (
    id SERIAL PRIMARY KEY,  -- Changed from notification_id
    user_id INTEGER NOT NULL REFERENCES users(id),  -- Updated reference
    message BYTEA NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT NULL
);

