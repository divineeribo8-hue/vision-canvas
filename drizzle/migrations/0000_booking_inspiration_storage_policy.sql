CREATE POLICY "Anyone can upload booking inspiration files"
ON storage.objects
FOR INSERT
TO anon
WITH CHECK (bucket_id = 'booking-inspiration');

CREATE POLICY "Service role can manage booking inspiration files"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'booking-inspiration')
WITH CHECK (bucket_id = 'booking-inspiration');