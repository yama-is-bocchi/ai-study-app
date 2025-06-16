SELECT_ANSWER_TABLE_BY_LIMIT = """
SELECT field_name, question, answer, correct, timestamp
FROM answer_table
ORDER BY id DESC
LIMIT %s
"""

SELECT_NAME_FROM_FIELD_TABLE = "SELECT name FROM field_table"
