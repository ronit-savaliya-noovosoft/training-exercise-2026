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

module.exports = { COUNT_JOBS, GET_JOBS };