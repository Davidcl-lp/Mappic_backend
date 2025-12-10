# Mappic_backend

# COMANDOS FUNCIONAMIENTO


# SIGN UP
curl -X POST http://localhost:3000/api/user/signup   -H "Content-Type: application/json"   -d '{"name":"Rrosmary","email":"rosmary@example.com"
,"password":"1234"}'

# LOG IN
curl -X POST http://localhost:3000/api/user/login \
  -H "Content-Type: application/json" \
  -d '{"email":"rosmary@example.com","password_hash":"1234"}'

# GET USER BY ID
curl http://localhost:3000/api/user/1

# GET ALUM OF USER
curl http://localhost:3000/api/user/albums/1

# GET ALBUMS OF USER
curl -X DELETE http://localhost:3000/api/user/1

