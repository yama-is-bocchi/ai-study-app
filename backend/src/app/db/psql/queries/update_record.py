INCREMENT_FIELDS_CORRECT = """UPDATE field_table
SET
    correct_number = correct_number + 1,
    correct_rate = CAST(correct_number + 1 AS FLOAT) / (correct_number + incorrect_number + 1)
WHERE
    name = %s;"""

INCREMENT_FIELDS_INCORRECT = """UPDATE field_table
SET
    incorrect_number = incorrect_number + 1,
    correct_rate = CAST(correct_number AS FLOAT) / (correct_number + incorrect_number + 1)
WHERE
    name = %s;"""
