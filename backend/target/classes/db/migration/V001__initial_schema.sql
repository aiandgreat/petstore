-- Create pets table and insert sample data
CREATE TABLE IF NOT EXISTS pets (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  category VARCHAR(50),
  breed VARCHAR(100),
  age_months INTEGER,
  price_cents INTEGER,
  status VARCHAR(50) DEFAULT 'AVAILABLE',
  image_url TEXT
);

INSERT INTO pets (name, category, breed, age_months, price_cents, status, image_url) VALUES
('Buddy', 'DOG', 'Labrador', 12, 50000, 'AVAILABLE', 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=800&q=80'),
('Mittens', 'CAT', 'Siamese', 8, 30000, 'AVAILABLE', 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?w=800&q=80'),
('Tweety', 'BIRD', 'Canary', 6, 5000, 'AVAILABLE', 'https://images.unsplash.com/photo-1518105779142-d975f22f1f9b?w=800&q=80'),
('Goldie', 'FISH', 'Goldfish', 3, 1500, 'AVAILABLE', 'https://images.unsplash.com/photo-1535930749574-1399327ce78f?w=800&q=80'),
('Shadow', 'DOG', 'German Shepherd', 24, 70000, 'AVAILABLE', 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80'),
('Luna', 'CAT', 'Maine Coon', 10, 45000, 'AVAILABLE', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80')
ON CONFLICT DO NOTHING;
