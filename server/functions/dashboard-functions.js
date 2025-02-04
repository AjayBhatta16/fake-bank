const path = require('path');

module.exports = app => {
    const filePath = __dirname.split('/').slice(0, -1).join('/')

    app.get('/dashboard/users', (_, res) => {
        res.sendFile(path.join(filePath, 'public', 'users.html'));
    });
    
    app.get('/dashboard/logs', (_, res) => {
        res.sendFile(path.join(filePath, 'public', 'ip-logs.html'));
    });
    
    app.get('/dashboard/etl', (_, res) => {
        res.sendFile(path.join(filePath, 'public', 'etl-services.html'));
    });
}