const DiscogsService = require('./discogs');

describe('DiscogsModel: getArtist', () => {
    it('should retrieve artist information from the Discogs API', (done) => {
        const getArtist = async () => {
            await process.nextTick(() => {});
            await DiscogsService.getArtist(72872, (res_artist) => {
                expect(res_artist.data.name).toBe('Rick Astley');
                done();
            });
        }
        getArtist();
    });
});