-- Update existing pet image URLs without changing historical migrations
UPDATE pets
SET image_url = 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?w=800&q=80'
WHERE name = 'Tweety';

UPDATE pets
SET image_url = 'https://images.unsplash.com/photo-1537527363880-f0a6ed9d4186?w=800&q=80'
WHERE name = 'Coco';