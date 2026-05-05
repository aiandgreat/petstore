-- Update existing pet image URLs for Goldie and Coco without changing prior migrations
UPDATE pets
SET image_url = 'https://images.unsplash.com/photo-1524704654690-b56c05c78a00?w=800&q=80'
WHERE name = 'Goldie';

UPDATE pets
SET image_url = 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800&q=80'
WHERE name = 'Coco';