export const authConfig: any = {
    clientId: 'caf02bf3-e0ce-4370-b9ff-81d538cabb32',
    authorizationEndpoint: 'https://assets.turo.com/v6/authentication/oauth2/auth',
    tokenEndpoint: 'https://assets.turo.com/v6/authentication/oauth2/token',
    redirectUri: 'https://turo-bynder-assets.vercel.app/callback',
    scope: 'offline asset:read collection:read',
    state: 'state',
    autoLogin: false,
    clearURL: false,
    extraAuthParameters: {
      response_type: 'code'
    },
    extraTokenParameters: {
      client_secret: '21b1f3b4-fa51-4fbf-8048-8545a0998d9f',
      grant_type: 'authorization_code'
    },
    onRefreshTokenExpire: (event: any) => window.confirm('Session expired. Refresh page to continue.') && event.login(),
}