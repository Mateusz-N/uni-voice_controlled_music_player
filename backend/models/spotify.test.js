const dbConnection = require('../db/db');
const SpotifyModel = require('../models/spotify');

afterAll((done) => {
    try {
        dbConnection.rollback(() => {
            dbConnection.end(() => done());
        });
    }
    catch (error) {
        console.error('Error closing MySQL database connection:', error);
        done(error);
    }
});

describe('SpotifyModel: registerUserConnection', () => {
    it('should add a record to the connection table', (done) => {
        const testData = {
            accessToken: 'Lorem',
            refreshToken: 'ipsum',
        };
        const connectionSelectionQuery = `SELECT * FROM connection WHERE access_token = '${testData.accessToken}' AND refresh_token = '${testData.refreshToken}'`;
        dbConnection.beginTransaction(async (err) => {
            if(err) throw err;
            SpotifyModel.registerUserConnection(testData.accessToken, testData.refreshToken, () => {
                dbConnection.query(connectionSelectionQuery, (err, result) => {
                    if(err) throw err;
                    expect(result.length).toBe(1);
                    done();
                });
            });
        });
    });
});