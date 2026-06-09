-- ============================================
-- SAMPLE DATA FOR TESTING
-- ============================================

USE currency_notes_db;

-- Insert some test note entries
INSERT INTO note_entries (entry_date, branch_id, inputter_id, note_type, serial_number, figure, number, comments, status) VALUES
('2026-06-09', 2, 2, 'mutilated', 1, 1000, 5, 'Torn notes from customer', 'draft'),
('2026-06-09', 2, 2, 'mutilated', 2, 500, 3, 'Missing corner', 'draft'),
('2026-06-09', 2, 2, 'damp', 3, 200, 10, 'Water damaged', 'draft'),
('2026-06-09', 3, 4, 'burnt', 1, 100, 2, 'Partially burnt', 'draft'),
('2026-06-09', 3, 4, 'mutilated', 2, 50, 8, '', 'draft');