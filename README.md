# MapPic – Backend (Servidor)

Este repositorio contiene el backend de **MapPic**, una aplicación orientada a la gestión y compartición de álbumes fotográficos con control de permisos por roles. El servidor expone una API REST que da soporte a la aplicación móvil Android desarrollada en el proyecto [Mappic app android](https://github.com/Davidcl-lp/MappicApp).

---

## Tecnologías utilizadas

- **Node.js**
- **TypeScript**
- **Express**
- **PostgreSQL**
- **JSON Web Tokens (JWT)**
- **bcrypt**
- **Multer**
- **Supabase Storage**

La combinación de Node.js con TypeScript permite un desarrollo robusto y mantenible, incorporando tipado estático sin perder la flexibilidad del ecosistema JavaScript.

---

## Arquitectura del servidor

El backend sigue una **arquitectura modular**, basada en una clara separación de responsabilidades. El código se organiza principalmente en las siguientes capas:

### 🔹 Rutas (Routes)
Definen los endpoints de la API REST y enlazan cada ruta con su controlador correspondiente.

### 🔹 Controladores (Controllers)
Contienen la lógica de negocio:
- Validación de datos
- Control de permisos
- Construcción de respuestas HTTP
- Gestión de errores

### 🔹 Acceso a datos (Database / Model)
Encapsula el acceso a la base de datos mediante consultas SQL parametrizadas, evitando inyecciones SQL y mejorando la seguridad.

Esta estructura facilita la mantenibilidad, escalabilidad y lectura del código.

---

## API REST

La API sigue los principios REST y utiliza los métodos HTTP estándar:

- `GET`
- `POST`
- `PUT`
- `DELETE`

Todas las respuestas se devuelven en formato **JSON**.

### Entidades principales gestionadas:
- Usuarios
- Álbumes
- Miembros de álbum
- Fotografías

Cada grupo de endpoints se gestiona mediante un **Router independiente de Express**, lo que permite ampliar la API de forma sencilla.

---

## Gestión de usuarios y autenticación

El sistema de usuarios incluye:
- Registro
- Inicio de sesión
- Obtención de datos del usuario
- Eliminación de cuenta

### Medidas de seguridad:
- Las contraseñas se almacenan cifradas mediante **bcrypt**
- Autenticación basada en **JWT (JSON Web Tokens)**
- Validación del token en operaciones sensibles

Este enfoque permite un sistema **sin estado (stateless)**, facilitando la escalabilidad del servidor.

---

## Álbumes y control de permisos

Cada álbum tiene:
- Un **propietario (owner)**
- Miembros con roles:
  - `owner`
  - `editor`
  - `viewer`

Antes de ejecutar acciones críticas (como eliminar miembros o modificar álbumes), el servidor valida:
- El rol del usuario solicitante
- Su relación con el álbum


---

## Base de datos y persistencia

La persistencia se gestiona mediante **PostgreSQL**, utilizando la librería `pg`.

Características principales:
- Pool de conexiones configurado mediante variables de entorno
- Consultas SQL parametrizadas
- Uso de claves foráneas y restricciones para mantener la integridad de los datos

---

## Gestión de fotografías

- Las imágenes se almacenan en **Supabase Storage**
- Los metadatos de las fotografías se guardan en la base de datos
- La subida de imágenes se realiza con **Multer**, permitiendo cargas múltiples en una sola petición

---

## Cómo probar el backend

### Requisitos
- Node.js v18+
- PostgreSQL
- Cuenta Supabase

### Instalación
```bash
npm install
```

### Configuración
Crear archivo `.env`:
```env
PORT=3000
DB_HOST=localhost
DB_PORT=5432
DB_USER=usuario
DB_PASSWORD=clave
DB_NAME=mappic
JWT_SECRET=secret
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=key
SUPABASE_BUCKET=bucket
```

### Ejecutar
```bash
npm run dev
```

Servidor en http://localhost:3000