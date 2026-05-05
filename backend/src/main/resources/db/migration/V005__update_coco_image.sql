-- Update existing Coco image URL without changing prior migrations
UPDATE pets
SET image_url = 'https://upload.wikimedia.org/wikipedia/commons/f/f8/Full_attention_%288067543690%29.jpg'
WHERE name = 'Coco';