INSERT_FIELD_RECORD = """
INSERT INTO field_table (name, correct_number, incorrect_number, correct_rate)
VALUES %s
ON CONFLICT (name) DO NOTHING;
"""

INSERT_ANSWER_RECORD = """
INSERT INTO answer_table (field_name, question, answer, correct)
VALUES %s
"""
