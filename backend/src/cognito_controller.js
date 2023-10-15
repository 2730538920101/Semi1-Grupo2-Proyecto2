const AmazonCognitoIdentity = require('amazon-cognito-identity-js');

// Configuración de Amazon Cognito
const poolData = {
    UserPoolId: process.env.AWS_USER_POOL_ID,
    ClientId: process.env.AWS_CLIENT_ID
};

// Variable utilizada para utilizar las funciones integradas de cognito
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

// Funcion que sirve para retornar un listado de todos los parametros que seran enviados a cognito
function listAtrributes() {

    const response = [];

    // En el caso que los atributos no vengan en pares se retorna una lista vacia
    if (arguments.length % 2 != 0) {
        return response;
    }

    // Se van almacenando los atributos en la respuesta
    for (let i = 0; i < arguments.length; i = i + 2) {
        const data = {
            Name: arguments[i],
            Value: arguments[i + 1]
        };
        response.push(new AmazonCognitoIdentity.CognitoUserAttribute(data));
    }

    // Retornando lista de atributos
    return response;
}

module.exports = { userPool, listAtrributes };