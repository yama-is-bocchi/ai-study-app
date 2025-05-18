CREATE_FILED_TABLE = """
CREATE TABLE IF NOT EXISTS filed_table (
    name TEXT PRIMARY KEY,
    correct_number INTEGER,
    incorrect_number INTEGER,
    correct_rate NUMERIC
);
"""

CREATE_ANSWER_TABLE = """
CREATE TABLE IF NOT EXISTS answer_table (
    id SERIAL PRIMARY KEY,
    filed_name TEXT REFERENCES filed_table(name) ON DELETE CASCADE,
    question TEXT,
    answer TEXT,
    correct BOOLEAN,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
"""
