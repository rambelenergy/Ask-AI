-- RamBelEnergy CMS — Add summarize field to about_sections profile
-- Migration: 007_add_profile_summarize

UPDATE public.about_sections
SET content_json = content_json || '{
  "summarize": "Born in S\u00e9tif, Algeria, Ramdane Belamri is a journalist, PhD holder, and analyst focusing on energy, geopolitics, sustainability, and Euro-African cooperation. With over twenty-five years of experience across print, television, and digital media, he has built a career combining journalism and academic research. He earned a PhD in Media and Communication Sciences from the University of Algiers 3 and is currently pursuing an international doctoral degree at the University of Seville."
}'::jsonb
WHERE section_key = 'profile'
  AND content_json->>'summarize' IS NULL;
