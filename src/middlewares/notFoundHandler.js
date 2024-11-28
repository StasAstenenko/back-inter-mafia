// not found user
// eslint-disable-next-line no-unused-vars

export const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        message: 'Route not found',
    });
};
