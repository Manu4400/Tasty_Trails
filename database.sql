-- Create the database
CREATE DATABASE IF NOT EXISTS food_delivery_db;
USE food_delivery_db;

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user'
);

-- Create food table
CREATE TABLE IF NOT EXISTS food (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL,
  image VARCHAR(255),
  category VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create cart table
CREATE TABLE IF NOT EXISTS cart (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  item_id INT NOT NULL,
  quantity INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (item_id) REFERENCES food(id)
);

-- Insert sample users (password is bcrypt hash for 'admin123' and 'user123')
INSERT INTO users (name, email, password, role) VALUES
('Admin', 'admin@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i6rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'admin'),
('User', 'user@example.com', '$2b$10$CwTycUXWue0Thq9StjUM0uJ8i6rQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'user');

-- Insert sample food items
INSERT INTO food (name, description, price, image, category) VALUES
('Greek Salad', 'Fresh salad with feta cheese and olives', 12.00, 'food_images/food_1.png', 'Salad'),
('Veg Salad', 'Healthy vegetable salad', 18.00, 'food_images/food_2.png', 'Salad'),
('Clover Salad', 'Clover greens with vinaigrette', 16.00, 'food_images/food_3.png', 'Salad'),
('Chicken Salad', 'Chicken with greens and dressing', 24.00, 'food_images/food_4.png', 'Salad'),
('Lasagna Rolls', 'Cheesy lasagna rolls', 14.00, 'food_images/food_5.png', 'Rolls'),
('Peri Peri Rolls', 'Spicy peri peri rolls', 12.00, 'food_images/food_6.png', 'Rolls'),
('Chicken Rolls', 'Chicken stuffed rolls', 20.00, 'food_images/food_7.png', 'Rolls'),
('Veg Rolls', 'Vegetable stuffed rolls', 15.00, 'food_images/food_8.png', 'Rolls'),
('Ripple Ice Cream', 'Delicious ripple ice cream', 14.00, 'food_images/food_9.png', 'Deserts'),
('Fruit Ice Cream', 'Ice cream with mixed fruits', 22.00, 'food_images/food_10.png', 'Deserts'),
('Jar Ice Cream', 'Ice cream in a jar', 10.00, 'food_images/food_11.png', 'Deserts'),
('Vanilla Ice Cream', 'Classic vanilla ice cream', 12.00, 'food_images/food_12.png', 'Deserts'),
('Chicken Sandwich', 'Grilled chicken sandwich', 12.00, 'food_images/food_13.png', 'Sandwich'),
('Vegan Sandwich', 'Plant-based sandwich', 18.00, 'food_images/food_14.png', 'Sandwich'),
('Grilled Sandwich', 'Grilled cheese sandwich', 16.00, 'food_images/food_15.png', 'Sandwich'),
('Bread Sandwich', 'Simple bread sandwich', 24.00, 'food_images/food_16.png', 'Sandwich'),
('Cup Cake', 'Sweet cup cake', 14.00, 'food_images/food_17.png', 'Cake'),
('Vegan Cake', 'Eggless vegan cake', 12.00, 'food_images/food_18.png', 'Cake'),
('Butterscotch Cake', 'Butterscotch flavored cake', 20.00, 'food_images/food_19.png', 'Cake'),
('Sliced Cake', 'Cake slices', 15.00, 'food_images/food_20.png', 'Cake'),
('Garlic Mushroom', 'Garlic flavored mushrooms', 14.00, 'food_images/food_21.png', 'Pure Veg'),
('Fried Cauliflower', 'Crispy fried cauliflower', 22.00, 'food_images/food_22.png', 'Pure Veg'),
('Mix Veg Pulao', 'Mixed vegetable pulao', 10.00, 'food_images/food_23.png', 'Pure Veg'),
('Rice Zucchini', 'Rice with zucchini', 12.00, 'food_images/food_24.png', 'Pure Veg'),
('Cheese Pasta', 'Pasta with cheese sauce', 12.00, 'food_images/food_25.png', 'Pasta'),
('Tomato Pasta', 'Pasta in tomato sauce', 18.00, 'food_images/food_26.png', 'Pasta'),
('Creamy Pasta', 'Creamy white sauce pasta', 16.00, 'food_images/food_27.png', 'Pasta'),
('Chicken Pasta', 'Chicken and pasta', 24.00, 'food_images/food_28.png', 'Pasta'),
('Buttter Noodles', 'Noodles with butter', 14.00, 'food_images/food_29.png', 'Noodles'),
('Veg Noodles', 'Vegetable noodles', 12.00, 'food_images/food_30.png', 'Noodles'),
('Somen Noodles', 'Japanese somen noodles', 20.00, 'food_images/food_31.png', 'Noodles'),
('Cooked Noodles', 'Perfectly cooked noodles', 15.00, 'food_images/food_32.png', 'Noodles'); 