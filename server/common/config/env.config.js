module.exports = {
    "port": 3001,
    "appEndpoint": "http://localhost:3001",
    "apiEndpoint": "http://localhost:3001",
    "jwt_secret": "thisismysecret",
    "jwt_expiration_in_seconds": 36000,
    "environment": "dev",
    "permissionLevels": {
        "NORMAL_USER": 1,
        "ADMIN": 2
    }
};
