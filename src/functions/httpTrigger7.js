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

        let helpAnswer = "Pleas only send numbers not anythin else\nexample Link:\nhttp://exampledomain.net/api/dreiecken1?Ax=0&Ay=0&Bx=5&By=0&Cx=0&Cy=5&Px=1&Dx=0&Dy=0&Py=1\n"
        let helpAnswerJSON = 'example JSON:\n{\n"Ax": 0,\n"Ay": 0,\n"Bx": 5,\n"By": 0,\n"Cx": 0,\n"Cy": 5,\n"Dx": 0,\n"Dy": 0,\n"Px": 1,\n"Py": 1\n}'
        // Try to parse the JSON body

         // If not all parameters are provided in the query string, try to extract from the request body
       if (!A.every(x => !isNaN(x)) || !B.every(x => !isNaN(x)) || !C.every(x => !isNaN(x)) || !D.every(x => !isNaN(x)) || !point.every(x => !isNaN(x))) {
        let requestBody;
       
        try {
            requestBody = await request.json(); // Use rawBody if available
        } catch (error) {
            console.error("Error parsing JSON:", error);
            return {body: helpAnswer + helpAnswerJSON ,status:"400"}  
        }

        if (requestBody) {
            A[0] = parseFloat(requestBody.Ax);
            A[1] = parseFloat(requestBody.Ay);
            B[0] = parseFloat(requestBody.Bx);
            B[1] = parseFloat(requestBody.By);
            C[0] = parseFloat(requestBody.Cx);
            C[1] = parseFloat(requestBody.Cy);
            D[0] = parseFloat(requestBody.Dx);
            D[1] = parseFloat(requestBody.Dy);
            point[0] = parseFloat(requestBody.Px);
            point[1] = parseFloat(requestBody.Py);
        }
    }

         // Check if the arrays contain anythin elese but numbers
         if (!A.every(x => !isNaN(x)) || !B.every(x => !isNaN(x)) || !C.every(x => !isNaN(x)) || !D.every(x => !isNaN(x)) || !point.every(x => !isNaN(x))) {
            return {body: helpAnswer + helpAnswerJSON ,status:"400"}     
        }
        
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
