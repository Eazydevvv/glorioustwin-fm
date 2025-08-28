export const buildPagination = (req) => {
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 100);
    const skip = (page - 1) * limit;
    return { page, limit, skip };
    };
    
    
    export const makeFileUrl = (req, filename) => {
    if (!filename) return undefined;
    const base = process.env.BASE_URL || `${req.protocol}://${req.get('host')}`;
    return `${base}/uploads/${filename}`;
    };