-- liquibase formatted sql

-- changeset author:Kirill
CREATE TABLE users
(
    id                BIGSERIAL PRIMARY KEY,
    login             VARCHAR(50)  NOT NULL UNIQUE,
    password          VARCHAR(255) NOT NULL,
    email             VARCHAR(100) NOT NULL UNIQUE,
    first_name        VARCHAR(50)  NOT NULL,
    last_name         VARCHAR(50)  NOT NULL,
    photo_path        VARCHAR(255), -- ✅ Добавлено поле для аватарки
    registration_date TIMESTAMP      DEFAULT CURRENT_TIMESTAMP,
    wallet            DECIMAL(10, 2) DEFAULT 0.00,
    delivery_address  TEXT
);

-- changeset author:Kirill
CREATE TABLE authors
(
    id        BIGSERIAL PRIMARY KEY,
    name      VARCHAR(100) NOT NULL,
    biography TEXT
);

CREATE TABLE genres
(
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(50) NOT NULL UNIQUE,
    description TEXT
);

-- changeset author:Kirill
CREATE TABLE books
(
    id                BIGSERIAL PRIMARY KEY,
    title             VARCHAR(255)   NOT NULL,
    isbn              VARCHAR(20) UNIQUE,
    description       TEXT,
    price             DECIMAL(10, 2) NOT NULL,
    quantity_in_stock INTEGER   DEFAULT 0,
    publication_date  DATE,
    pages             INTEGER,
    cover_image_url   VARCHAR(255),
    publisher_name    VARCHAR(100),
    author_id         BIGINT         NOT NULL,
    genre_id          BIGINT         NOT NULL,
    created_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at        TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- changeset author:Kirill
CREATE TABLE orders
(
    id               BIGSERIAL PRIMARY KEY,
    user_id          BIGINT         NOT NULL,
    order_date       TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    total_amount     DECIMAL(10, 2) NOT NULL,
    status           VARCHAR(20) DEFAULT 'PENDING',
    shipping_address TEXT           NOT NULL,
    payment_method   VARCHAR(50),
    tracking_number  VARCHAR(100)
);

CREATE TABLE order_items
(
    id         BIGSERIAL PRIMARY KEY,
    order_id   BIGINT         NOT NULL,
    book_id    BIGINT         NOT NULL,
    quantity   INTEGER        NOT NULL,
    unit_price DECIMAL(10, 2) NOT NULL,
    subtotal   DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

-- changeset author:Kirill
CREATE TABLE cart
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE cart_items
(
    id       BIGSERIAL PRIMARY KEY,
    cart_id  BIGINT  NOT NULL,
    book_id  BIGINT  NOT NULL,
    quantity INTEGER NOT NULL DEFAULT 1,
    added_at TIMESTAMP        DEFAULT CURRENT_TIMESTAMP
);

-- changeset author:Kirill
CREATE TABLE replenishment
(
    id                 BIGSERIAL PRIMARY KEY,
    user_id            BIGINT         NOT NULL,
    amount             DECIMAL(10, 2) NOT NULL,
    replenishment_date TIMESTAMP   DEFAULT CURRENT_TIMESTAMP,
    payment_method     VARCHAR(50),
    transaction_id     VARCHAR(100) UNIQUE,
    status             VARCHAR(20) DEFAULT 'COMPLETED'
);

-- changeset author:Kirill
CREATE TABLE reviews
(
    id          BIGSERIAL PRIMARY KEY,
    user_id     BIGINT  NOT NULL,
    book_id     BIGINT  NOT NULL,
    rating      INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment     TEXT,
    review_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_approved BOOLEAN   DEFAULT false
);

CREATE TABLE wishlist
(
    id         BIGSERIAL PRIMARY KEY,
    user_id    BIGINT NOT NULL,
    book_id    BIGINT NOT NULL,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);