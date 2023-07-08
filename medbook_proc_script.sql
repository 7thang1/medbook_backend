DELIMITER //
CREATE PROCEDURE addDoctorSchedule(
    IN doctor_id INT,
    IN specialty_id INT,
    IN date_id INT,
    IN start_timeslot_id INT,
    IN end_timeslot_id INT
)
BEGIN
    DECLARE current_timeslot_id INT;
    
    SET current_timeslot_id = start_timeslot_id;
    
    WHILE current_timeslot_id <= end_timeslot_id DO
        INSERT INTO doctor_schedule (doctor_id, specialty_id, date_id, start_timeslot_id, end_timeslot_id)
        VALUES (doctor_id, specialty_id, date_id, current_timeslot_id, current_timeslot_id + 1);
        
        SET current_timeslot_id = current_timeslot_id + 1;
    END WHILE;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE addDoctorWithSpecialties(
    IN doctor_name VARCHAR(255),
    IN doctor_gender ENUM('Male', 'Female', 'Other'),
    IN doctor_room_id INT,
    IN specialties_list VARCHAR(255)
)
BEGIN
    -- Thêm thông tin bác sĩ vào bảng doctor
    INSERT INTO doctor (full_name, gender, room_id)
    VALUES (doctor_name, doctor_gender, doctor_room_id);
    
    -- Lấy ID của bác sĩ vừa được thêm
    SET @doctor_id = LAST_INSERT_ID();
    
    -- Tách danh sách các chuyên khoa thành các chuyên khoa riêng biệt
    SET @specialties = specialties_list;
    
    WHILE CHAR_LENGTH(@specialties) > 0 DO
        -- Lấy ID chuyên khoa đầu tiên trong danh sách
        SET @specialty_id = TRIM(SUBSTRING_INDEX(@specialties, ',', 1));
        
        -- Thêm quan hệ chuyên khoa của bác sĩ vào bảng doctor_specialty
        INSERT INTO doctor_specialty (doctor_id, specialty_id)
        VALUES (@doctor_id, @specialty_id);
        
        -- Loại bỏ ID chuyên khoa đã thêm khỏi danh sách
        SET @specialties = TRIM(SUBSTRING(@specialties, LENGTH(@specialty_id) + 2));
    END WHILE;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE addMedicalTicket(
    IN p_profile_id INT,
    IN p_doctor_id INT,
    IN p_specialty_id INT,
    IN p_room_id INT,
    IN p_date_id INT,
    IN p_timeslot_id INT
)
BEGIN
    -- Lấy giá khám từ bảng specialty
    DECLARE v_schedule_id INT;
    DECLARE v_price DECIMAL(10, 0);
    SELECT price INTO v_price FROM specialty WHERE specialty_id = p_specialty_id;
    
    -- Lấy schedule_id từ bảng doctor_schedule
    SELECT schedule_id INTO v_schedule_id
    FROM doctor_schedule
    WHERE doctor_id = p_doctor_id
    AND specialty_id = p_specialty_id
    AND date_id = p_date_id
    AND start_timeslot_id = p_timeslot_id;
    
    -- Thêm mới phiếu khám bệnh và lưu trữ giá khám và schedule_id
    INSERT INTO medical_ticket (profile_id, doctor_id, schedule_id, specialty_id, room_id, date_id, timeslot_id, price)
    VALUES (p_profile_id, p_doctor_id, v_schedule_id, p_specialty_id, p_room_id, p_date_id, p_timeslot_id, v_price);
    
    SELECT LAST_INSERT_ID() AS medical_ticket_id; -- Trả về ID của phiếu khám bệnh vừa thêm
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE createPatientProfile(
    IN p_user_id INT,
    IN p_full_name VARCHAR(255),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_phone_number VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_occupation VARCHAR(255),
    IN p_ethnicity VARCHAR(255)
)
BEGIN
    INSERT INTO patient_profile (user_id, full_name, date_of_birth, gender, phone_number, address, occupation, ethnicity)
    VALUES (p_user_id, p_full_name, p_date_of_birth, p_gender, p_phone_number, p_address, p_occupation, p_ethnicity);

END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE createUser(
    IN p_user_name VARCHAR(255),
    IN p_fullname VARCHAR(255),
    IN p_password VARCHAR(255)
)
BEGIN
    INSERT INTO user (user_name, full_name, password)
    VALUES (p_user_name, p_fullname, p_password);
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE deletePatientProfile(
    IN p_profile_id INT,
    IN p_user_id INT,
    OUT p_state INT
)
BEGIN
    DECLARE EXIT HANDLER FOR SQLEXCEPTION
    BEGIN
        SET p_state = 0; -- Xoá không thành công
    END;

    START TRANSACTION;
    
    DELETE FROM patient_profile
    WHERE user_id = p_user_id AND profile_id = p_profile_id;
    
    SET p_state = ROW_COUNT(); -- Số dòng bị ảnh hưởng (0 nếu xoá không thành công)
    
    COMMIT;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE deleteUser(
    IN p_user_id INT
)
BEGIN
    DELETE FROM user
    WHERE user_id = p_user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getAllPatientProfiles()
BEGIN
    SELECT *
    FROM patient_profile;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorBySpecialty(IN specialtyId INT)
BEGIN
    SELECT d.doctor_id, d.full_name
    FROM doctor d
    INNER JOIN doctor_specialty ds ON d.doctor_id = ds.doctor_id
    WHERE ds.specialty_id = specialtyId;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorsBySpecialtyAndDate(IN specialty_id INT, IN date_id INT)
BEGIN
    SELECT d.doctor_id as doctorID, d.full_name as doctorFullname, d.room_id as doctorRoomID, r.name as roomName
    FROM (
        SELECT DISTINCT d.doctor_id
        FROM doctor d
        JOIN doctor_specialty ds ON d.doctor_id = ds.doctor_id
        JOIN doctor_schedule sched ON d.doctor_id = sched.doctor_id
        WHERE ds.specialty_id = specialty_id
          AND sched.date_id = date_id
    ) t
    JOIN doctor d ON t.doctor_id = d.doctor_id
    JOIN room r ON d.room_id = r.room_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorSchedule(
    IN doctor_id INT,
    IN specialty_id INT,
    IN date_id INT
)
BEGIN
    SELECT
        dr.doctor_id AS doctorID,
        dr.full_name AS doctorName,
        dr.room_id AS roomID,
        r.name AS roomName,
        ds.date_id AS dateID,
        d.date_value AS date,
        t.timeslot_id AS timeslotID,
        t.timeslot_name AS timeslotName,
        IF(m.ticket_id IS NULL, 'Available', 'Occupied') AS slotStatus
    FROM doctor_schedule ds
    INNER JOIN date d ON ds.date_id = d.date_id
    INNER JOIN timeslot t ON ds.start_timeslot_id = t.timeslot_id
    INNER JOIN doctor dr ON ds.doctor_id = dr.doctor_id
    INNER JOIN room r ON dr.room_id = r.room_id
    LEFT JOIN medical_ticket m ON ds.doctor_id = m.doctor_id
        AND ds.specialty_id = m.specialty_id
        AND ds.date_id = m.date_id
        AND t.timeslot_id = m.timeslot_id
    WHERE ds.doctor_id = doctor_id
        AND ds.specialty_id = specialty_id
        AND ds.date_id = date_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorSpecialties()
BEGIN
    SELECT d.doctor_id as dID, d.full_name as dFullname, s.specialty_id as sID, s.name AS sName, s.price as sPrice
    FROM doctor d
    CROSS JOIN doctor_specialty ds
    JOIN specialty s ON ds.specialty_id = s.specialty_id
    WHERE d.doctor_id = ds.doctor_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorSpecialtiesPagination(
    IN start_index INT,
    IN page_size INT
)
BEGIN
    SELECT d.doctor_id AS doctorID, d.full_name AS doctorFullname, d.gender as doctorGender, s.specialty_id AS specialtyID, s.name AS specialtyName, DAYNAME(dt.date_value) AS workDay, s.price AS specialtyPrice, r.name as roomName, r.room_id as roomID
    FROM doctor d
    JOIN room r ON d.room_id = r.room_id
    JOIN doctor_specialty ds ON d.doctor_id = ds.doctor_id
    JOIN specialty s ON ds.specialty_id = s.specialty_id
    JOIN doctor_schedule sched ON d.doctor_id = sched.doctor_id AND ds.specialty_id = sched.specialty_id
    JOIN date dt ON sched.date_id = dt.date_id
    GROUP BY d.doctor_id, s.specialty_id, dt.date_value
    LIMIT start_index, page_size;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getDoctorWorkingDates(
    IN doctor_id INT,
    IN specialty_id INT
)
BEGIN
    SELECT DISTINCT  d.*
    FROM doctor_schedule ds
    JOIN date d ON ds.date_id = d.date_id
    WHERE ds.doctor_id = doctor_id
    AND ds.specialty_id = specialty_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getInforLoginUser()
BEGIN
	SELECT user_id ,user_name, userStatus, password
    FROM user;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getInforMedicalTicket()
BEGIN
    SELECT p.profile_id as patientID, p.full_name AS patientName, p.date_of_birth as DOB, p.gender as gender, p.phone_number as phoneNumber, p.address as address, p.occupation as occupation, p.ethnicity as ethnicity,
           t.ticket_id as ticketID, d.doctor_id as doctorID, d.full_name AS doctorName, s.specialty_id as specialtyID, s.name AS specialtyName, r.room_id as roomID, r.name AS roomName,
           dsc.date_id as placedDateID, dsc.date_value as placedDate, ts.timeslot_id as timeslotID, ts.timeslot_name as timeslotName, t.ticket_status as ticketStatus, t.price, t.create_at as createdDate
    FROM medical_ticket t
    JOIN patient_profile p ON t.profile_id = p.profile_id
    JOIN doctor d ON t.doctor_id = d.doctor_id
    JOIN specialty s ON t.specialty_id = s.specialty_id
    JOIN room r ON t.room_id = r.room_id
    JOIN date dsc ON t.date_id = dsc.date_id
    JOIN timeslot ts ON t.timeslot_id = ts.timeslot_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getListDate()
BEGIN
	SELECT *
	FROM date;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getMedicalTicketDetails(
    IN p_ticket_id INT
)
BEGIN
    SELECT t.ticket_id as ticketID, p.full_name AS patientName, d.full_name AS doctorName, s.name AS specialtyName,
           r.name AS roomName, dsc.date_value as placedDate, ts.timeslot_name as timeslot, t.ticket_status as ticketStatus, t.price as ticketPrice
    FROM medical_ticket t
    JOIN patient_profile p ON t.profile_id = p.profile_id
    JOIN doctor d ON t.doctor_id = d.doctor_id
    JOIN specialty s ON t.specialty_id = s.specialty_id
    JOIN room r ON t.room_id = r.room_id
    JOIN date dsc ON t.date_id = dsc.date_id
    JOIN timeslot ts ON t.timeslot_id = ts.timeslot_id
    WHERE t.ticket_id = p_ticket_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getMedicalTicketsByUserID(IN p_user_id INT)
BEGIN
SELECT t.ticket_id as ticketID, t.profile_id as patientprofileID, p.full_name AS patientFullname, d.full_name AS doctorName, s.name AS specialtyName,
           r.name AS roomName, dsc.date_value as placedDate, ts.timeslot_name as timeslot, t.ticket_status as ticketStatus, t.price as ticketPrice
    FROM medical_ticket t
    JOIN doctor d ON t.doctor_id = d.doctor_id
    JOIN patient_profile p ON t.profile_id = p.profile_id
    JOIN specialty s ON t.specialty_id = s.specialty_id
    JOIN room r ON t.room_id = r.room_id
    JOIN date dsc ON t.date_id = dsc.date_id
    JOIN timeslot ts ON t.timeslot_id = ts.timeslot_id
    JOIN user u ON p.user_id = u.user_id
    WHERE u.user_id = p_user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getSpecialtyList()
BEGIN
	SELECT *
    FROM specialty;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getUserbyUsername(IN p_username VARCHAR(255))
BEGIN
	SELECT*
    FROM user
    WHERE user_name = p_username;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getUserList()
BEGIN
	SELECT*
    FROM user;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE getUserPatientProfiles(IN p_user_id INT)
BEGIN
    SELECT *
    FROM patient_profile
    WHERE user_id = p_user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE resetPassword(
    IN p_user_id INT,
    IN p_new_password VARCHAR(255))
BEGIN
    -- Cập nhật mật khẩu mới vào cơ sở dữ liệu
    UPDATE user
    SET password = p_new_password
    WHERE user_id = p_user_id;
END //
 DELIMITER ;
 
 DELIMITER //
CREATE PROCEDURE updatePatientProfile(
    IN p_profile_id INT,
    IN p_full_name VARCHAR(255),
    IN p_date_of_birth DATE,
    IN p_gender ENUM('Male', 'Female', 'Other'),
    IN p_phone_number VARCHAR(255),
    IN p_address VARCHAR(255),
    IN p_occupation VARCHAR(255),
    IN p_ethnicity VARCHAR(255)
)
BEGIN
    UPDATE patient_profile
    SET full_name = p_full_name,
        date_of_birth = p_date_of_birth,
        gender = p_gender,
        phone_number = p_phone_number,
        address = p_address,
        occupation = p_occupation,
        ethnicity = p_ethnicity
    WHERE profile_id = p_profile_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE updateUserInfor(
    IN p_user_id INT,
    IN p_full_name VARCHAR(255),
    IN p_phone_number VARCHAR(255),
    IN p_email VARCHAR(255)
)
BEGIN
    UPDATE user
    SET full_name = p_full_name,
        phone_number = p_phone_number,
        email = p_email
    WHERE user_id = p_user_id;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE updateUserPassword(
    IN p_user_name VARCHAR(255),
    IN p_current_password VARCHAR(255),
    IN p_new_password VARCHAR(255))
BEGIN
    DECLARE v_current_password VARCHAR(255);

    -- Lấy mật khẩu hiện tại từ cơ sở dữ liệu
    SELECT password INTO v_current_password
    FROM user
    WHERE user_name = p_user_name;

    -- Kiểm tra tính trùng khớp của mật khẩu hiện tại nhập vào và mật khẩu hiện tại trong cơ sở dữ liệu
    IF v_current_password = p_current_password THEN
        -- Cập nhật mật khẩu mới cho người dùng
        UPDATE user
        SET password = p_new_password
        WHERE user_name = p_user_name;
    END IF;
END //
DELIMITER ;

DELIMITER //
CREATE PROCEDURE validateUser(
    IN p_user_name VARCHAR(255),
    IN full_name VARCHAR(255),
    OUT p_user_id INT)
BEGIN
    -- Kiểm tra xem thông tin xác thực (tên người dùng và địa chỉ email) có tồn tại trong cơ sở dữ liệu
    SELECT user_id INTO p_user_id
    FROM user
    WHERE user_name = p_user_name AND full_name = full_name;
END //
DELIMITER ;
