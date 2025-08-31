-- Drop table if exists
DROP TABLE IF EXISTS EventSponsors;
DROP TABLE IF EXISTS EventParticipants;
DROP TABLE IF EXISTS EventExternalsParticipants;
DROP TABLE IF EXISTS Volunteer;
DROP TABLE IF EXISTS Student;
DROP TABLE IF EXISTS ExternalParticipant;
DROP TABLE IF EXISTS Administrator;
DROP TABLE IF EXISTS Event;
DROP TABLE IF EXISTS Venue;
DROP TABLE IF EXISTS Organizer;
DROP TABLE IF EXISTS Sponsor;


-- Drop ENUM type if exists along with dependent objects
DROP TYPE IF EXISTS RoleEnum CASCADE;

-- Create ENUM type RoleEnum
CREATE TYPE RoleEnum AS ENUM ('add', 'delete', 'add/delete');

-- Create Administrators Table
CREATE TABLE Administrator (
    ID SERIAL PRIMARY KEY,
    FirstName VARCHAR(255) NOT NULL,
    LastName VARCHAR(255) NOT NULL,
    UserName VARCHAR(255) NOT NULL UNIQUE,
    Hash VARCHAR(255) NOT NULL,
    Salt VARCHAR(255),
    EmailID VARCHAR(255) NOT NULL UNIQUE,
    Role RoleEnum
);

-- External Participant Table 
CREATE TABLE ExternalParticipant (
    ID INT PRIMARY KEY,
    FirstName VARCHAR(255) not null,
    LastName VARCHAR(255) not null,
    Username VARCHAR(255) not null unique,
    Hash VARCHAR(255) not null,
    Salt VARCHAR(255),
    isVerified BOOLEAN,
    EmailToken VARCHAR(255),
    EmailID VARCHAR(255) not null unique,
    College VARCHAR(255) not null,
    PlaceName VARCHAR(255) not null,
    StreetNo VARCHAR(255) not null,
    GuestHouseName VARCHAR(255),
    Block VARCHAR(10),
    Number VARCHAR(10)
);

--Venue table 
CREATE TABLE Venue (
    ID INT PRIMARY KEY,
    Name VARCHAR(255) not null,
    Capacity INT not null,
    Building VARCHAR(255) not null,
    Floor INT not null,
    Landmark VARCHAR(255)
);

-- Organizer Table
CREATE TABLE Organizer (
    ID INT PRIMARY KEY,
    FirstName VARCHAR(255) not null,
    LastName VARCHAR(255) not null,
    Username VARCHAR(255) not null unique,
    Hash VARCHAR(255) not null,
    Salt VARCHAR(255),
    isVerified BOOLEAN,
    EmailID VARCHAR(255) not null unique,
    EmailToken VARCHAR(255),
    OrganiserType VARCHAR(255) not null
);

-- Events Table
CREATE TABLE Event (
    ID INT PRIMARY KEY,
    Name VARCHAR(255) not null,
    Type VARCHAR(255) not null,
    Description TEXT,
    VenueID INT not null,
	OrganizerID INT not null,
    Date DATE not null,
    Time TIME not null,
    Prize DECIMAL(10, 2),
    FOREIGN KEY (VenueID) REFERENCES Venue(ID),
    FOREIGN KEY (OrganizerID) REFERENCES Organizer(ID)
);

-- Sponsor Table
CREATE TABLE Sponsor (
    ID INT PRIMARY KEY,
    Name VARCHAR(255) not null,
    EmailID VARCHAR(255) not null unique,
    GuestHouseName VARCHAR(255),
    Block VARCHAR(10),
    Number VARCHAR(10),
	EventID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID)
);

--Student Table
CREATE TABLE Student (
    ID INT PRIMARY KEY,
    FirstName VARCHAR(255) not null,
    LastName VARCHAR(255) not null,
    Username VARCHAR(255) not null unique,
    Hash VARCHAR(255) not null,
    Salt VARCHAR(255),
    isVerified BOOLEAN,
    EmailToken VARCHAR(255),
    EmailID VARCHAR(255) not null unique,
    isVolunteer BOOLEAN
);

--Volunteer Table 
CREATE TABLE Volunteer (
    ID INT PRIMARY KEY,
    StudentID INT,
    EventID INT,
    FOREIGN KEY (StudentID) REFERENCES Student(ID),
    FOREIGN KEY (EventID) REFERENCES Event(ID)
);

create Table EventParticipants(
    EventID INT,
    ParticipantID INT,
    PRIMARY KEY (EventID, ParticipantID),
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (ParticipantID) REFERENCES Student(ID)

);

--EventExternalParticipants Table
create TABLE EventExternalsParticipants (
    ID INT PRIMARY KEY,
    EventID INT,
    ParticipantID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (ParticipantID) REFERENCES ExternalParticipant(ID)
);



CREATE OR REPLACE FUNCTION addEventExternalParticipant()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO EventParticipants (EventID, ParticipantID) VALUES (NEW.EventID, NEW.ParticipantID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER addEventExternalParticipant
AFTER INSERT ON EventExternalsParticipants
FOR EACH ROW
EXECUTE FUNCTION addEventExternalParticipant();



CREATE OR REPLACE FUNCTION deleteEventExternalParticipant()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM EventParticipants WHERE EventID = OLD.EventID AND ParticipantID = OLD.ParticipantID;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deleteEventExternalParticipant
AFTER DELETE ON EventExternalsParticipants
FOR EACH ROW
EXECUTE FUNCTION deleteEventExternalParticipant();



CREATE OR REPLACE FUNCTION updateEventExternalParticipant()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM EventParticipants WHERE EventID = OLD.EventID AND ParticipantID = OLD.ParticipantID;
    INSERT INTO EventParticipants (EventID, ParticipantID) VALUES (NEW.EventID, NEW.ParticipantID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER updateEventExternalParticipant
AFTER UPDATE ON EventExternalsParticipants
FOR EACH ROW
EXECUTE FUNCTION updateEventExternalParticipant();

-- EventStudentParticipants Table
CREATE TABLE EventStudents (
    ID SERIAL PRIMARY KEY,
    EventID INT,
    StudentID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (StudentID) REFERENCES Student(ID)
);

-- Drop the existing trigger if needed
DROP TRIGGER IF EXISTS addEventStudent ON EventStudents;


CREATE OR REPLACE FUNCTION addEventStudent()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO EventParticipants (EventID, ParticipantID) VALUES (NEW.EventID, NEW.StudentID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger with the modified function
CREATE TRIGGER addEventStudent
AFTER INSERT ON EventStudents
FOR EACH ROW
EXECUTE FUNCTION addEventStudent();

DROP TRIGGER IF EXISTS deleteEventStudent ON EventStudents;

CREATE OR REPLACE FUNCTION deleteEventStudent()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM EventParticipants WHERE EventID = OLD.EventID AND ParticipantID = OLD.StudentID;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER deleteEventStudent
AFTER DELETE ON EventStudents
FOR EACH ROW
EXECUTE FUNCTION deleteEventStudent();

DROP TRIGGER IF EXISTS updateEventStudent ON EventStudents;

CREATE OR REPLACE FUNCTION updateEventStudent()
RETURNS TRIGGER AS $$
BEGIN
    DELETE FROM EventParticipants WHERE EventID = OLD.EventID AND ParticipantID = OLD.StudentID;
    INSERT INTO EventParticipants (EventID, ParticipantID) VALUES (NEW.EventID, NEW.StudentID);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER updateEventStudent
AFTER UPDATE ON EventStudents
FOR EACH ROW
EXECUTE FUNCTION updateEventStudent();

-- EventVenue Table
CREATE TABLE EventVenues (
    EventID INT,
    VenueID INT,
    PRIMARY KEY (EventID, VenueID),
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (VenueID) REFERENCES Venue(ID)
);

DROP TABLE IF EXISTS EventOrganizers;
-- EventOrganizers Table
CREATE TABLE EventOrganizers (
    ID SERIAL PRIMARY KEY,
    EventID INT,
    OrganizerID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (OrganizerID) REFERENCES Organizer(ID)
);

DROP TABLE IF EXISTS EventSponsors;
-- EventSponsors Table
CREATE TABLE EventSponsors (
    ID SERIAL PRIMARY KEY,
    EventID INT,
    SponsorID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (SponsorID) REFERENCES Sponsor(ID)
);

DROP TABLE IF EXISTS EventVolunteers;
-- EventVolunteers Table
CREATE TABLE EventVolunteers (
    ID SERIAL PRIMARY KEY,
    EventID INT,
    VolunteerID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (VolunteerID) REFERENCES Volunteer(ID)
);

DROP TABLE IF EXISTS EventWinners;
CREATE TABLE EventWinners (
    ID SERIAL PRIMARY KEY,
    EventID INT,
    FirstPrizeWinnerID INT,
    SecondPrizeWinnerID INT,
    ThirdPrizeWinnerID INT,
    FOREIGN KEY (EventID) REFERENCES Event(ID),
    FOREIGN KEY (EventID, FirstPrizeWinnerID) REFERENCES EventParticipants(EventID, ParticipantID),
    FOREIGN KEY (EventID, SecondPrizeWinnerID) REFERENCES EventParticipants(EventID, ParticipantID),
    FOREIGN KEY (EventID, ThirdPrizeWinnerID) REFERENCES EventParticipants(EventID, ParticipantID)
);
