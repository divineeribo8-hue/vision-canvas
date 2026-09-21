CREATE POLICY "Authenticated users can upload booking inspiration files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'booking-inspiration');

CREATE POLICY "Authenticated users can read their selected inspiration files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'booking-inspiration');

CREATE POLICY "Service role can manage portfolio media files"
ON storage.objects
FOR ALL
TO service_role
USING (bucket_id = 'portfolio-media')
WITH CHECK (bucket_id = 'portfolio-media');