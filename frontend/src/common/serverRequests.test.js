import { requestSpotifyAuthURL } from 'common/serverRequests';

describe('requestSpotifyAuthURL', () => {
    it('should fetch the Spotify auth URL from the running server', (done) => {
        requestSpotifyAuthURL((data) => {
            expect(data.authURL).toMatch(/https:\/\/accounts.spotify.com\/authorize?/);
            done();
        });
    });
});