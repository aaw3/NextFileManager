import ldap

def authenticate(self, LDAP_URL: str, BASE_DN: str, USERNAME: str, PASSWORD: str):
    try:
        con = ldap.initialize(LDAP_URL)
        con.simple_bind_s(f"uid={USERNAME},{BASE_DN}", PASSWORD)

        # On no exception, return true
        return True

    except ldap.INVALID_CREDENTIALS:
        return False
    
    finally:
        con.unbind_s()

@app.post("/login/ldap/{provider_name}")
async def ldap_login(request: Request, provider_name: str):
    if provider_name not in ldap_providers:
        return JSONResponse({"error": "Provider not found"}, status_code=404)

    ldap_provider = ldap_providers[provider_name]

    # Get username and password from request
    data = await request.json()

    if not 'username' in data or not 'password' in data:
        return JSONResponse({"error": "Invalid request"}, status_code=400)
        
    username = data['username']
    password = data['password']

    # Authenticate user
    if authenticate(ldap_provider['url'], ldap_provider['base_dn'], username, password):
        access_token = create_access_token(data={"sub": username})
        return JSONResponse({"access_token": access_token, "token_type": "bearer"})

    return JSONResponse({"error": "Invalid credentials"}, status_code=401)