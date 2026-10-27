const INSERT_JOB = `
    INSERT INTO JOBS (type, data)
    VALUES ($1, $2)
    RETURNING *
`;

const FETCH_PENDING_JOBS = `
    SELECT * 
    FROM JOBS
    WHERE status = 'pending'
    ORDER BY id ASC
    LIMIT $1
    FOR UPDATE SKIP LOCKED
`;

// const UPDATE_JOB_STATUS = `
//     UPDATE JOB
//     SET status = $2,
//         updated_at = NOW()
//     WHERE id = $1
//     RETURNING *
// `;

const MARK_JOB_IN_PROCESS = `
    UPDATE JOBS
    SET status = 'in_process',
        attempts = attempts + 1,
        updated_at = NOW()
    WHERE id = $1
        AND status = 'pending'
    RETURNING *
`;

const MARK_JOB_COMPLETED = `
    UPDATE JOBS
    SET status = 'completed',
        last_error = NULL,
        updated_at = NOW()
    WHERE id = $1
    RETURNING *
`;

const MARK_JOB_FAILED = `
    UPDATE JOBS
    SET status = CASE
            WHEN attempts>=max_attempts THEN 'failed'
            ELSE 'pending'
        END,
        last_error = $2,
        updated_at = NOW()
    WHERE id = $1
`;

// const INCREMENT_JOB_ATTEMPTS = `
//     UPDATE JOBS
//     SET attempts = attempts + 1,
//         updated_at = NOW()
//     WHERE id = $1
//     RETURNING *
// `;

const COUNT_JOBS = `
    SELECT COUNT(*) AS total
    FROM JOBS
`;


const GET_JOBS = `
    SELECT * 
    FROM JOBS
    ORDER BY created_at DESC 
    LIMIT $1
    OFFSET $2
`;


module.exports = {
    INSERT_JOB,
    FETCH_PENDING_JOBS,
    MARK_JOB_COMPLETED,
    MARK_JOB_FAILED,
    MARK_JOB_IN_PROCESS,
    // UPDATE_JOB_STATUS,
    // INCREMENT_JOB_ATTEMPTS,
    COUNT_JOBS,
    GET_JOBS
}