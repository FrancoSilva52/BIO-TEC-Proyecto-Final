DELETE FROM analysis_results
WHERE analysis_id IN (
  'analisis-demo-001',
  'analisis-demo-002',
  'analisis-demo-003',
  'analisis-demo-004'
);

DELETE FROM clinical_analyses
WHERE id IN (
  'analisis-demo-001',
  'analisis-demo-002',
  'analisis-demo-003',
  'analisis-demo-004'
);