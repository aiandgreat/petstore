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
('Tweety', 'BIRD', 'Canary', 6, 5000, 'AVAILABLE', 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80'),
('Goldie', 'FISH', 'Goldfish', 3, 1500, 'AVAILABLE', 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80'),
('Shadow', 'DOG', 'German Shepherd', 24, 70000, 'AVAILABLE', 'https://images.unsplash.com/photo-1517423440428-a5a00ad493e8?w=800&q=80'),
('Luna', 'CAT', 'Maine Coon', 10, 45000, 'AVAILABLE', 'https://images.unsplash.com/photo-1543852786-1cf6624b9987?w=800&q=80'),
('Coco', 'DOG', 'Poodle', 14, 42000, 'AVAILABLE', 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Full_attention_%288067543690%29.jpg'),
('Pip', 'BIRD', 'Parakeet', 5, 6500, 'AVAILABLE', 'https://images.unsplash.com/photo-1452570053594-1b985d6ea890?w=800&q=80'),
('Bubbles', 'FISH', 'Betta', 2, 2500, 'AVAILABLE', 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80'),
('Nova', 'CAT', 'Ragdoll', 9, 38000, 'AVAILABLE', 'https://images.unsplash.com/photo-1513245543132-31f507417b26?w=800&q=80'),
('Rusty', 'DOG', 'Beagle', 18, 47000, 'AVAILABLE', 'https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=800&q=80')
ON CONFLICT DO NOTHING;
