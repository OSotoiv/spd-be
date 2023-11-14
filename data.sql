-- Insert sample data
INSERT INTO tech (username, password)
VALUES
    ('tech1', 'password1'),
    ('tech2', 'password2');

INSERT INTO manufacturer (name, description, phone)
VALUES
    ('Manufacturer A', 'Description of Manufacturer A', '123-456-7890'),
    ('Manufacturer B', 'Description of Manufacturer B', '987-654-3210');

INSERT INTO instrument (name, manufacturer, mfg_number, description, ifu, size, length)
VALUES
    ('Instrument 1', 1, 'MFG123', 'Description of Instrument 1', 'IFU123', 'Small', '10 cm'),
    ('Instrument 2', 2, 'MFG456', 'Description of Instrument 2', 'IFU456', 'Medium', '15 cm'),
    ('Instrument 3', 1, 'MFG789', 'Description of Instrument 3', 'IFU789', 'Large', '20 cm');

INSERT INTO tech_instruments (tech_id, instrument_id)
VALUES
    (1, 1),
    (1, 2),
    (2, 1),
    (2, 3);
