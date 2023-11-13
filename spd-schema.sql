CREATE TABLE manufacturer (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL, 
    description TEXT,
    phone TEXT
);

CREATE TABLE instrument (
    id SERIAL PRIMARY KEY, 
    name TEXT NOT NULL,
    manufacturer INT REFERENCES manufacturer(id),
    mfg_number TEXT NOT NULL,
    description TEXT NOT NULL,
    ifu TEXT,
    size TEXT,
    length TEXT
);

CREATE TABLE tech (
    id SERIAL PRIMARY KEY,
    username VARCHAR(20) NOT NULL,
    password TEXT NOT NULL
);

CREATE TABLE tech_instruments (
    tech_id INT REFERENCES tech(id),
    instrument_id INT REFERENCES instrument(id),
    PRIMARY KEY (tech_id, instrument_id)
);
