export const withMethod = (method, handler) => {
    return (req, res) => {
        if (req.method === method) {
            return handler(req, res);
        }
        res.setHeader('Allow', [method]);
        res.status(405).end(`Method ${method} Not Allowed`);
    };
}
