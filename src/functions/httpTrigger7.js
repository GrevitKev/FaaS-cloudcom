const { app } = require('@azure/functions');

app.http('dreiecken1', {
    methods: ['GET', 'POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // Extract triangle vertices and point coordinates from the request
        const A = [parseFloat(request.query.get('Ax')), parseFloat(request.query.get('Ay'))];
        const B = [parseFloat(request.query.get('Bx')), parseFloat(request.query.get('By'))];
        const C = [parseFloat(request.query.get('Cx')), parseFloat(request.query.get('Cy'))];
        const D = [parseFloat(request.query.get('Dx')), parseFloat(request.query.get('Dy'))];
        const point = [parseFloat(request.query.get('Px')), parseFloat(request.query.get('Py'))];

        // Calculate if the point is inside the triangle
        const isInside = pointInSquare(point, A, B, C, D);

        return { body: `Point is inside Square: ${isInside}` };
    }
});

function pointInSquare(point, A, B, C, D) {
    // Calculate barycentric coordinates
    const denominator = ((B[0] - A[0]) * (D[1] - C[1])) - ((B[1] - A[1]) * (D[0] - C[0]));
    const alpha = (((point[0] - A[0]) * (D[1] - C[1])) - ((point[1] - A[1]) * (D[0] - C[0]))) / denominator;
    const beta = (((point[1] - A[1]) * (B[0] - A[0])) - ((point[0] - A[0]) * (B[1] - A[1]))) / denominator;
    const gamma = 1 - alpha - beta;

    // Check if point is inside the square
    return alpha >= 0 && alpha <= 1 && beta >= 0 && beta <= 1 && gamma >= 0 && gamma <= 1;
}
