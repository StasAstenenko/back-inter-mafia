---
title: README
date: 2024-12-04 11:15
include_toc: true
---

# AquaTrack App Backend

Backend for the AquaTrack app, part of the GoIT FSON 105 Team Project.

## Team Members
- [Stas Astenenko](https://github.com/StasAstenenko)
- [Dmytro Orel](https://github.com/Decembric)
- [Igor Yevtushenko](https://github.com/ii-777)
- [Kateryna Artemieva](https://github.com/KaterynaArtemieva)
- [Serhii Stupak](https://github.com/ITStupak)

## Overview
This repository contains the backend code for the AquaTrack app, designed to help users track their water consumption and improve their hydration habits.

## API Docs
### /users Endpoints
1. Register User (POST /api/users/register)
  - Method: POST
  - URL: http://localhost:8080/api/users/register
  - Body: 
```json
{
  "username": "newuser",
  "email": "newuser@example.com",
  "password": "12345678"
}
```

2. Login User (POST /api/users/login)
  - Method: POST
  - URL: http://localhost:8080/api/users/login
  - Body: (example data)
```json
{
  "email": "newuser@example.com",
  "password": "12345678"
}
```

3. Logout User (POST /api/users/logout)
  - Method: POST
  - URL: http://localhost:8080/api/users/logout

4. Get User Info (GET /api/users/)
  - Method: GET
  - URL: http://localhost:8080/api/users/
  - Headers: Include the Authorization token.

5. Get User Count (GET /api/users/count-user)
  - Method: GET
  - URL: http://localhost:8080/api/users/count-user

### /water Endpoints
1. Get Water Data (GET /api/water/)
  - Method: GET
  - URL: http://localhost:8080/api/water/
  - Headers: Include the Authorization token.
  
2. Get Water Data Per Day (GET /api/water/water-per-day)
  - Method: GET
  - URL: http://localhost:8080/api/water/water-per-day
  - Headers: Include the Authorization token.

3. Create Water Data (POST /api/water/)
  - Method: POST
  - URL: http://localhost:8080/api/water/
  - Headers: Include the Authorization token.
  - Body:
```json
{
  "date": "2024-12-04",
  "amount": 250
}
```
4. Update Water Data (PATCH /api/water/:waterId)
  - Method: PATCH
  - URL: http://localhost:8080/api/water/:waterId
  - Headers: Include the Authorization token.
  - Body: (example data for updating water data)
```json
{
  "amount": 300
}
```

5. Delete Water Data (DELETE /api/water/:waterId)
  - Method: DELETE
  - URL: http://localhost:8080/api/water/:waterId
  - Headers: Include the Authorization token.
