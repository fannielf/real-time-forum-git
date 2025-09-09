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
(1, 3, 'Sure! Start with cherry tomatoes; they''re easier to grow. Make sure they get plenty of sunlight and water.', DATETIME('now', '-1 days', '-20 hours')),
(1, 3, 'Also, don''t forget to prune the leaves to encourage more fruit growth.', DATETIME('now', '-1 days', '-18 hours')),
(1, 3, 'And consider using a trellis for better support as they grow.', DATETIME('now', '-1 days', '-16 hours')),
(1, 2, 'Thanks for the advice! I''ll give cherry tomatoes a try this season.', DATETIME('now', '-1 days', '-12 hours')),
(1, 2, 'Do you have any recommendations for organic fertilizers?', DATETIME('now', '-1 days', '-10 hours')),
(1, 3, 'Compost is great! You can also use fish emulsion or seaweed extract for a nutrient boost.', DATETIME('now', '-1 days', '-8 hours')),
(1, 2, 'Awesome, I''ll look into those. Appreciate the help!', DATETIME('now', '-1 days', '-6 hours')),
(1, 3, 'No problem! Happy gardening!', DATETIME('now', '-1 days', '-4 hours')),
(1, 2, 'By the way, how do you manage pests naturally?', DATETIME('now', '-1 days', '-2 hours')),
(1, 3, 'I use neem oil and introduce beneficial insects like ladybugs. They help keep harmful pests in check.', DATETIME('now', '-1 days')),
(1, 2, 'Great tips! I''ll try those out. Thanks again!', DATETIME('now', '-20 hours')),
(1, 3, 'No worries! Let me know how your first harvest goes.', DATETIME('now', '-18 hours')),
(1, 2, 'Will do! When is the best time to plant cherry tomatoes?', DATETIME('now', '-16 hours')),
(1, 3, 'Spring is ideal once the risk of frost is gone. They love warm soil.', DATETIME('now', '-14 hours')),
(1, 2, 'Got it. I''ll prep my garden for spring then.', DATETIME('now', '-12 hours')),
(1, 3, 'Perfect! Make sure the soil drains well, tomatoes don''t like soggy roots.', DATETIME('now', '-11 hours')),
(1, 2, 'Good to know. Do you rotate your crops each year?', DATETIME('now', '-10 hours')),
(1, 3, 'Yes, crop rotation helps prevent soil-borne diseases. I avoid planting tomatoes in the same spot two years in a row.', DATETIME('now', '-8 hours')),
(1, 2, 'Smart move. I''ll plan for that too.', DATETIME('now', '-6 hours')),
(1, 3, 'You''re on the right track! Gardening is all about patience and observation.', DATETIME('now', '-4 hours')),
(1, 2, 'Thanks! I''m feeling more confident about starting now.', DATETIME('now', '-2 hours')),
(2, 4, 'Hi! How''s it going?', DATETIME('now', '-3 days')),
(2, 5, 'Hi. All good here. What are you gardening?', DATETIME('now', '-2 days')),
(2, 4, 'Not much, just looking for inspiration to start!', CURRENT_TIMESTAMP);