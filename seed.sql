INSERT INTO User (username, age, gender, firstname, lastname, email, password, created_at) VALUES
('fannielf', 36, 'female', 'Fanni', 'Elf', 'fannielf@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('roope', 29, 'male', 'Roope', 'Testi', 'roope@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('maris', 37, 'female', 'Maris', 'Test', 'maris@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('harald', 30, 'male', 'Harald', 'Testaaja', 'harald@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('anne', 21, 'female', 'Anne', 'Testing', 'anne@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('wolfgang', 56, 'male', 'Wolfgang', 'Test', 'wolfgang@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP),
('pierre', 16, 'male', 'Pierre', 'Test', 'pierre@test.com', '$2a$10$UfJwwd.x4mVkjFUcCGF/q.GsFSRYdoXILjFDPE6XaO8ruT/4uyJ8i', CURRENT_TIMESTAMP);

INSERT INTO Post (title, content, user_id, created_at) VALUES
('First Tomato Harvest', 'Picked my first ripe tomato today — sweet and juicy. The plant is finally paying off!', 2, CURRENT_TIMESTAMP),
('Sunflower Surprise', 'My sunflowers grew taller than the fence. Neighbors keep asking about them.', 3, CURRENT_TIMESTAMP),
('Compost Wins', 'Tried homemade compost this season, and the lettuce is greener than ever.', 5, CURRENT_TIMESTAMP),
('Evening Watering', 'Found that watering after sunset keeps the soil moist longer. Plants look happier.', 3, CURRENT_TIMESTAMP),
('Bees in the Lavender', 'The lavender bush is buzzing with bees every morning. Great for pollination!', 4, CURRENT_TIMESTAMP);

INSERT INTO Post_Category (category_id, post_id) VALUES
(2, 4),
(3, 1),
(4, 2),
(4, 6),
(5, 2),
(6, 1),
(1, 3),
(1, 5);

INSERT INTO Comment (content, post_id, user_id, created_at) VALUES
('Congrats on the tomato harvest! Nothing beats homegrown.', 2, 5, CURRENT_TIMESTAMP),
('Sunflowers are such a joy. Mine reached 8 feet last year!', 3, 6, CURRENT_TIMESTAMP),
('Compost is a game-changer. My veggies have never been better.', 4, 2, CURRENT_TIMESTAMP),
('Evening watering is the best! I do the same and my plants thrive.', 5, 3, CURRENT_TIMESTAMP),
('Lavender attracts so many pollinators. My garden is buzzing too!', 6, 4, CURRENT_TIMESTAMP);

INSERT INTO Like (user_id, post_id, created_at, type) VALUES
(5, 2, CURRENT_TIMESTAMP, 1),
(6, 2, CURRENT_TIMESTAMP, 1),
(3, 2, CURRENT_TIMESTAMP, 1),
(4, 5, CURRENT_TIMESTAMP, 2),
(2, 5, CURRENT_TIMESTAMP, 1);

INSERT INTO Chat (user1_id, user2_id, created_at) VALUES
(2, 3, CURRENT_TIMESTAMP),
(4, 5, CURRENT_TIMESTAMP);

INSERT INTO Message (chat_id, sender_id, content, created_at) VALUES
(1, 2, 'Hey! Loved your post about the tomato harvest. Any tips for a newbie?', DATETIME('now', '-2 days')),
(1, 3, 'Sure! Start with cherry tomatoes; they''re easier to grow. Make sure they get plenty of sunlight and water.', DATETIME('now', '-1 days')),
(1, 2, 'Thanks for the advice! I''ll give cherry tomatoes a try this season.', CURRENT_TIMESTAMP),
(2, 4, 'Hi! I saw your comment on my sunflower post. Do you grow sunflowers too?', DATETIME('now', '-3 days')),
(2, 5, 'Yes, I do! They''re my favorite flower. They''re great for attracting pollinators.', DATETIME('now', '-2 days')),
(2, 4, 'Absolutely! I''ll share some photos of my garden soon.', CURRENT_TIMESTAMP);