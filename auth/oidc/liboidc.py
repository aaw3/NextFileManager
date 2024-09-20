from authlib.integrations.starlette_client import OAuth
from fastapi import FastAPI, Request, Depends
from fastapi.responses import RedirectResponse, JSONResponse
from starlette.config import Config
from starlette.middleware.sessions import SessionMiddleware
from appfastapi import app
from oidc.providers import providers


def initialize(self, NAME: str, CLIENT_ID: str, CLIENT_SECRET: str, AUTHORIZATION_ENDPOINT: str, TOKEN_ENDPOINT: str, USERINFO_ENDPOINT: str, REDIRECT_URI: str):

    config = Config(environ={
        'NAME': NAME,
        'CLIENT_ID': CLIENT_ID,
        'CLIENT_SECRET': CLIENT_SECRET,
        'AUTHORIZE_URL': AUTHORIZATION_ENDPOINT,
        'ACCESS_TOKEN_URL': TOKEN_ENDPOINT,
        'USERINFO_URL': USERINFO_ENDPOINT,
        'REDIRECT_URI': REDIRECT_URI,
    })
    oauth = OAuth(config)

    oidc_client = oauth.register(
        name='oidc',
        client_id=config('CLIENT_ID'),
        client_secret=config('CLIENT_SECRET'),
        authorize_url=config('AUTHORIZATION_ENDPOINT'),
        access_token_url=config('TOKEN_ENDPOINT'),
        userinfo_url=config('USERINFO_ENDPOINT'),
        redirect_uri=config('REDIRECT_URI'),
        client_kwargs={'scope': 'openid profile email'},
    )
    return oidc_client

@app.get("/login/oidc/{provider_name}")
async def oidc_login(request: Request, provider_name: str):
    if provider_name not in providers:
        return JSONResponse({"error": "Provider not found"}, status_code=404)

    oidc_client = providers[provider_name]

    # Redirect to OIDC authorization URL
    redirect_uri = await oidc_client.authorize_redirect(request)

    return RedirectResponse(redirect_uri)

@app.get("/callback/oidc{provider_name}")
async def oidc_callback(request: Request, provider_name: str):
    if provider_name not in providers:
        return JSONResponse({"error": "Provider not found"}, status_code=404)

    oidc_client = providers[provider_name]

    # Get token from OIDC provider
    token = await oidc_client.authorize_access_token(request)

    # Get user info from OIDC provider
    user = await oidc_client.parse_id_token(request, token)

    # Store user token in session
    request.session['token'] = token

    return JSONResponse(user)