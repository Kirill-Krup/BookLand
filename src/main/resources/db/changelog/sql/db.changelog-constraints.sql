-- liquibase formatted sql

-- changeset Kirill:constraints-for-books
ALTER TABLE books
    ADD CONSTRAINT fk_books_author
        FOREIGN KEY (author_id) REFERENCES authors(id);

ALTER TABLE books
    ADD CONSTRAINT fk_books_genre
        FOREIGN KEY (genre_id) REFERENCES genres(id);

-- changeset Kirill:constraints-for-orders
ALTER TABLE orders
    ADD CONSTRAINT fk_orders_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_order
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE;

ALTER TABLE order_items
    ADD CONSTRAINT fk_order_items_book
        FOREIGN KEY (book_id) REFERENCES books(id);

-- changeset Kirill:constraints-for-cars
ALTER TABLE cart
    ADD CONSTRAINT fk_cart_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_cart
        FOREIGN KEY (cart_id) REFERENCES cart(id) ON DELETE CASCADE;

ALTER TABLE cart_items
    ADD CONSTRAINT fk_cart_items_book
        FOREIGN KEY (book_id) REFERENCES books(id);

-- changeset Kirill:constraints-for-replenishment
ALTER TABLE replenishment
    ADD CONSTRAINT fk_replenishment_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE reviews
    ADD CONSTRAINT fk_reviews_book
        FOREIGN KEY (book_id) REFERENCES books(id);

ALTER TABLE wishlist
    ADD CONSTRAINT fk_wishlist_user
        FOREIGN KEY (user_id) REFERENCES users(id);

ALTER TABLE wishlist
    ADD CONSTRAINT fk_wishlist_book
        FOREIGN KEY (book_id) REFERENCES books(id);

-- changeset Kirill:constraints-for-review
ALTER TABLE reviews
    ADD CONSTRAINT unique_user_book_review
        UNIQUE (user_id, book_id);

ALTER TABLE wishlist
    ADD CONSTRAINT unique_user_book_wishlist
        UNIQUE (user_id, book_id);

ALTER TABLE cart_items
    ADD CONSTRAINT unique_cart_book
        UNIQUE (cart_id, book_id);

-- changeset Kirill:constraints-for-user-activities
ALTER TABLE user_activities
    ADD CONSTRAINT fk_user_activities_user
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- changeset Kirill:create-indexes
CREATE INDEX idx_user_activities_user_id ON user_activities(user_id);
CREATE INDEX idx_user_activities_created_at ON user_activities(created_at);

-- changeset Kirill:create-indexes-second
CREATE INDEX idx_books_author ON books(author_id);
CREATE INDEX idx_books_genre ON books(genre_id);
CREATE INDEX idx_books_title ON books(title);
CREATE INDEX idx_books_isbn ON books(isbn);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_date ON orders(order_date);

CREATE INDEX idx_order_items_order ON order_items(order_id);
CREATE INDEX idx_order_items_book ON order_items(book_id);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);
CREATE INDEX idx_cart_items_book ON cart_items(book_id);

CREATE INDEX idx_replenishment_user ON replenishment(user_id);
CREATE INDEX idx_replenishment_date ON replenishment(replenishment_date);

CREATE INDEX idx_reviews_book ON reviews(book_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE INDEX idx_wishlist_user ON wishlist(user_id);
CREATE INDEX idx_wishlist_book ON wishlist(book_id);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_login ON users(login);

-- changeset Kirill:enums
ALTER TABLE orders
    ADD CONSTRAINT chk_orders_status
        CHECK (status IN ('PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'));

ALTER TABLE replenishment
    ADD CONSTRAINT chk_replenishment_status
        CHECK (status IN ('PENDING', 'COMPLETED', 'FAILED'));

ALTER TABLE replenishment
    ADD CONSTRAINT chk_replenishment_amount
        CHECK (amount > 0);

ALTER TABLE books
    ADD CONSTRAINT chk_books_price
        CHECK (price >= 0);

ALTER TABLE books
    ADD CONSTRAINT chk_books_quantity
        CHECK (quantity_in_stock >= 0);

ALTER TABLE order_items
    ADD CONSTRAINT chk_order_items_quantity
        CHECK (quantity > 0);

ALTER TABLE cart_items
    ADD CONSTRAINT chk_cart_items_quantity
        CHECK (quantity > 0);

ALTER TABLE reviews
    ADD CONSTRAINT chk_reviews_rating
        CHECK (rating >= 1 AND rating <= 5);