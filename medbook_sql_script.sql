CREATE DATABASE theMedbookdb;

CREATE TABLE user (
    user_id INT NOT NULL AUTO_INCREMENT,
    user_name VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
	phone_number VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NULL,
    userStatus BOOLEAN DEFAULT TRUE,
	join_date DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id)
);

CREATE TABLE patient_profile (
    profile_id INT NOT NULL AUTO_INCREMENT,
    user_id INT NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    date_of_birth DATE NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    phone_number VARCHAR(255) NULL,
    address VARCHAR(255) NULL,
    occupation VARCHAR(255) NULL,
    ethnicity VARCHAR(255) NULL,
    PRIMARY KEY (profile_id),
    FOREIGN KEY (user_id) REFERENCES user (user_id)
);

CREATE TABLE doctor (
    doctor_id INT NOT NULL AUTO_INCREMENT,
    full_name VARCHAR(255) NOT NULL,
    gender ENUM('Male', 'Female', 'Other') NULL,
    room_id INT,
    PRIMARY KEY (doctor_id),
    FOREIGN KEY (room_id)
        REFERENCES room (room_id)
);

CREATE TABLE specialty (
    specialty_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    price DECIMAL(10,0),
    PRIMARY KEY (specialty_id)
);

CREATE TABLE doctor_specialty (
  doctor_id INT,
  specialty_id INT,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
  FOREIGN KEY (specialty_id) REFERENCES specialty(specialty_id),
  PRIMARY KEY (doctor_id, specialty_id)
);

CREATE TABLE doctor_schedule (
  schedule_id int AUTO_INCREMENT PRIMARY KEY,
  doctor_id int,
  specialty_id int,
  date_id int,
  start_timeslot_id int,
  end_timeslot_id int,
  FOREIGN KEY (doctor_id) REFERENCES doctor(doctor_id),
  FOREIGN KEY (specialty_id) REFERENCES specialty(specialty_id),
  FOREIGN KEY (date_id) REFERENCES date(date_id),
  FOREIGN KEY (start_timeslot_id) REFERENCES timeslot(timeslot_id),
  FOREIGN KEY (end_timeslot_id) REFERENCES timeslot(timeslot_id)
);

CREATE TABLE date (
  date_id INT NOT NULL AUTO_INCREMENT,
  date_value DATE,
  PRIMARY KEY (date_id)
);

CREATE TABLE timeslot (
  timeslot_id INT NOT NULL AUTO_INCREMENT,
  timeslot_name VARCHAR(255) NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  PRIMARY KEY (timeslot_id)
);

CREATE TABLE room (
    room_id INT NOT NULL,
    name VARCHAR(50) NOT NULL,
    description VARCHAR(255),
    PRIMARY KEY (room_id)
);

CREATE TABLE medical_ticket (
    ticket_id INT NOT NULL AUTO_INCREMENT,
    profile_id INT NOT NULL,
    schedule_id INT,
    doctor_id INT NOT NULL,
    specialty_id INT NOT NULL,
    room_id INT NOT NULL,
    date_id INT NOT NULL,
    timeslot_id INT NOT NULL,
    price DECIMAL(10,0),
    ticket_status ENUM('Pending', 'Confirmed', 'Cancelled', 'Completed') NOT NULL DEFAULT 'Pending',
    create_at DATETIME NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (ticket_id),
    FOREIGN KEY (profile_id) REFERENCES patient_profile (profile_id),
    FOREIGN KEY (schedule_id) REFERENCES doctor_schedule (schedule_id),
    FOREIGN KEY (doctor_id) REFERENCES doctor (doctor_id),
    FOREIGN KEY (specialty_id) REFERENCES specialty (specialty_id),
    FOREIGN KEY (room_id) REFERENCES room (room_id),
    FOREIGN KEY (date_id) REFERENCES date (date_id),
    FOREIGN KEY (timeslot_id) REFERENCES timeslot (timeslot_id)
);