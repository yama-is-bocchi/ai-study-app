CREATE_FILED_TABLE = """
CREATE TABLE IF NOT EXISTS field_table (
    name TEXT PRIMARY KEY,
    correct_number INTEGER,
    incorrect_number INTEGER,
    correct_rate NUMERIC
);
"""

CREATE_ANSWER_TABLE = """
CREATE TABLE IF NOT EXISTS answer_table (
    id SERIAL PRIMARY KEY,
    field_name TEXT REFERENCES field_table(name) ON DELETE CASCADE,
    question TEXT,
    answer TEXT,
    correct BOOLEAN,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""
