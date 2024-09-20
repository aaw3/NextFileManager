from liboidc import initialize
from tools.config import auth_config

oidc_providers = auth_config['oidc']

providers = []
for provider in oidc_providers:
    name = provider['name']
    client_id = provider['client_id']
    client_secret = provider['client_secret']
    authorization_endpoint = provider['authorization_endpoint']
    token_endpoint = provider['token_endpoint']
    userinfo_endpoint = provider['userinfo_endpoint']
    redirect_uri = provider['redirect_uri']
    providers.append(initialize(name, client_id, client_secret, authorization_endpoint, token_endpoint, userinfo_endpoint, redirect_uri))

