CREATE TABLE APP_USER (
    ID_USER BIGINT AUTO_INCREMENT PRIMARY KEY,
    FULL_NAME VARCHAR(255) NOT NULL,
    EMAIL VARCHAR(255) NOT NULL UNIQUE,
    DPI VARCHAR(20) NOT NULL UNIQUE,
    APP_PASSWORD VARCHAR(255) NOT NULL,
    PICTURE VARCHAR(255) NOT NULL,
    USER_STATUS VARCHAR(50) NOT NULL
);

CREATE TABLE APP_FRIEND (
    APP_FRIEND_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    APPLICANT_USER_ID BIGINT NOT NULL,
    REQUIRED_USER_ID BIGINT NOT NULL,
    APP_FRIEND_STATUS VARCHAR(50) NOT NULL,
    FOREIGN KEY (APPLICANT_USER_ID) REFERENCES APP_USER (ID_USER),
    FOREIGN KEY (REQUIRED_USER_ID) REFERENCES APP_USER (ID_USER)
);

CREATE TABLE APP_MESSAGE (
    APP_MESSAGE_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    TRANSMITER BIGINT NOT NULL,
    RECEIVER BIGINT NOT NULL,
    CONTENT VARCHAR(255) NOT NULL,
    APP_MESSAGE_DATE DATETIME NOT NULL,
    FOREIGN KEY (TRANSMITER) REFERENCES APP_USER (ID_USER),
    FOREIGN KEY (RECEIVER) REFERENCES APP_USER (ID_USER)
);

CREATE TABLE APP_POST (
    APP_POST_ID BIGINT AUTO_INCREMENT PRIMARY KEY,
    APP_USER_ID BIGINT NOT NULL,
    APP_POST_IMAGE VARCHAR(255) NOT NULL,
    APP_POST_DESCRIPTION VARCHAR(255),
    APP_POST_DATE DATETIME NOT NULL,
    FOREIGN KEY (APP_USER_ID) REFERENCES APP_USER (ID_USER)
);

CREATE TABLE APP_COMENT (
    APP_COMENT_ID BIGINT AUTO_INCREMENT PRIMARY KEY, 
    APP_POSTED_ID BIGINT NOT NULL , 
    APP_SENDER_ID BIGINT NOT NULL , 
    COMENT VARCHAR(255) NOT NULL,
    APP_COMENT_DATE DATETIME NOT NULL,
    FOREIGN KEY (APP_POSTED_ID) REFERENCES APP_POST (APP_POST_ID),
    FOREIGN KEY (APP_SENDER_ID) REFERENCES APP_USER (ID_USER) 
)

