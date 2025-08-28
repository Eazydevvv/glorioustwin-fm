export default function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({
        message: err.message || 'Server error',
        stack: process.env.NODE_ENV === 'production' ? undefined : err.stack
    });
}