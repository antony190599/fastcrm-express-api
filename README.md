# FastCRM API

Una API moderna de CRM construida con Express.js, compatible con bases de datos PostgreSQL (mediante Prisma) y MongoDB.

## 📋 Tabla de Contenidos

- [Descripción General](#descripción-general)
- [Stack Tecnológico](#stack-tecnológico)
- [Primeros Pasos](#primeros-pasos)
  - [Requisitos Previos](#requisitos-previos)
  - [Instalación](#instalación)
  - [Variables de Entorno](#variables-de-entorno)
- [Estructura de la Base de Datos](#estructura-de-la-base-de-datos)
  - [PostgreSQL (Prisma)](#postgresql-prisma)
  - [MongoDB](#mongodb)
- [Endpoints de la API](#endpoints-de-la-api)
  - [Contactos](#contactos)
  - [Empresas](#empresas)
  - [Plantillas](#plantillas)
  - [Mensajes](#mensajes)
  - [Registros de Contactos](#registros-de-contactos)
  - [Métricas](#métricas)
- [Objetos de Transferencia de Datos (DTOs)](#objetos-de-transferencia-de-datos-dtos)
- [Middleware](#middleware)
- [Validadores](#validadores)
- [Capa de Servicios](#capa-de-servicios)
- [Optimizaciones de Rendimiento](#optimizaciones-de-rendimiento)
- [Desarrollo](#desarrollo)
- [Licencia](#licencia)

## Descripción General

FastCRM API es una solución completa de gestión de relaciones con clientes construida para que las empresas puedan gestionar contactos, empresas, plantillas de comunicación y capacidades de mensajería. El sistema presenta un enfoque de doble base de datos utilizando PostgreSQL para datos relacionales estructurados y MongoDB para almacenamiento de documentos más flexible.

## Stack Tecnológico

- **Entorno de ejecución**: Node.js
- **Framework de API**: Express.js
- **Bases de Datos**:
  - **PostgreSQL** (mediante ORM Prisma) - Para datos estructurados (contactos, empresas)
  - **MongoDB** - Para datos semi-estructurados (plantillas de mensajes, historial de mensajes)
- **Validación**: express-validator
- **Integración de Email**: Resend API
- **Desarrollo**: Nodemon para recarga en caliente
- **Entorno**: dotenv para gestión de variables de entorno

## Primeros Pasos

### Requisitos Previos

- Node.js (v16+)
- NPM o Yarn
- Base de datos PostgreSQL
- Base de datos MongoDB
- Acceso a Resend API (para funcionalidad de email)

### Instalación

1. Clonar el repositorio:
```bash
git clone https://github.com/tuusuario/FASTCRM-EXPRESS-API1.git
cd FASTCRM-EXPRESS-API1
```

2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno (ver abajo)

4. Ejecutar migraciones de base de datos:
```bash
npm run migrate
```

5. Iniciar el servidor:
```bash
npm start
```

Para desarrollo con recarga en caliente:
```bash
npm run dev
```

### Variables de Entorno

Crear un archivo `.env` en el directorio raíz con las siguientes variables:

```
PORT=3000
MONGO_URI=tu_cadena_de_conexion_mongodb
DATABASE_URL=tu_cadena_de_conexion_postgresql
RESEND_API_KEY=tu_clave_api_resend
EMAIL_TEST_RECIPIENT=email_de_prueba_opcional
```

## Estructura de la Base de Datos

### PostgreSQL (Prisma)

La base de datos relacional maneja datos estructurados incluyendo contactos, empresas y registros de interacción.

#### Modelos:

**Contact (Contacto)**
- id (UUID)
- firstName (String, nombre)
- lastName (String, apellido)
- email (String, único)
- phone (String, opcional, teléfono)
- title (String, opcional, cargo)
- companyId (UUID, referencia a Empresa)
- timestamps (createdAt, updatedAt - fechas de creación y actualización)

**Company (Empresa)**
- id (UUID)
- name (String, nombre)
- ruc (String, opcional, RUC)
- industry (String, opcional, industria)
- website (String, opcional, sitio web)
- address (String, opcional, dirección)
- timestamps (createdAt, updatedAt - fechas de creación y actualización)

**ContactLog (Registro de Contacto)**
- id (UUID)
- contactId (UUID, referencia a Contacto)
- timestamp (DateTime, fecha y hora)
- templateId (String, opcional, ID de plantilla)
- templateName (String, opcional, nombre de plantilla)
- messageId (String, opcional, ID de mensaje)
- method (String: "email", "whatsapp", "call", "meeting" - método)
- notes (String, opcional, notas)
- status (String: "success", "pending", "failed" - éxito, pendiente, fallido)
- timestamps (createdAt, updatedAt - fechas de creación y actualización)

### MongoDB

La base de datos de documentos almacena datos semi-estructurados flexibles como plantillas de mensajes e historial.

#### Colecciones:

**Plantilla (Template)**
- _id (ObjectId)
- type (String, indexado, tipo)
- content (String, indexado como texto, contenido)
- labels (Array de String, etiquetas)
- author (String, autor)
- createdAt (Date, fecha de creación)

**MessageHistory (Historial de Mensajes)**
- _id (ObjectId)
- contactId (String, indexado)
- method (String: "email" o "whatsapp", indexado, método)
- subject (String, opcional, asunto)
- content (String, contenido)
- status (String: "sent", "failed", "delivered", "read", indexado - enviado, fallido, entregado, leído)
- messageId (String, opcional)
- createdAt (Date, indexado, fecha de creación)

## Endpoints de la API

### Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/contacts | Obtener todos los contactos (con paginación) |
| GET | /api/contacts/search | Buscar contactos |
| GET | /api/contacts/:id | Obtener contacto por ID |
| POST | /api/contacts | Crear un nuevo contacto |
| PUT | /api/contacts/:id | Actualizar un contacto |
| DELETE | /api/contacts/:id | Eliminar un contacto |

### Empresas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/companies | Obtener todas las empresas |
| GET | /api/companies/:id | Obtener empresa por ID |
| POST | /api/companies | Crear una nueva empresa |
| PUT | /api/companies/:id | Actualizar una empresa |
| DELETE | /api/companies/:id | Eliminar una empresa |

### Plantillas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/templates | Obtener todas las plantillas (con paginación) |
| GET | /api/templates/:id | Obtener plantilla por ID |
| POST | /api/templates | Crear una nueva plantilla |
| PUT | /api/templates/:id | Actualizar una plantilla |
| DELETE | /api/templates/:id | Eliminar una plantilla |

### Mensajes

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | /api/messages/:contactId | Enviar un mensaje a un contacto |
| POST | /api/messages/bulk | Enviar mensajes a múltiples contactos |

### Registros de Contactos

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/contact-logs | Obtener todos los registros de contactos (con paginación) |
| GET | /api/contact-logs/:id | Obtener registro de contacto por ID |
| GET | /api/contact-logs/contact/:contactId | Obtener registros para un contacto específico |
| POST | /api/contact-logs | Crear un nuevo registro de contacto |
| PUT | /api/contact-logs/:id | Actualizar un registro de contacto |
| DELETE | /api/contact-logs/:id | Eliminar un registro de contacto |

### Métricas

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | /api/metrics/dashboard | Obtener métricas del panel de control |

## Objetos de Transferencia de Datos (DTOs)

La API utiliza Objetos de Transferencia de Datos para transformar entidades internas de base de datos en formatos de respuesta consistentes:

- **contactDto**: Transforma objetos de base de datos Contact en formato de respuesta
- **companyDto**: Transforma objetos de base de datos Company en formato de respuesta
- **contactLogDto**: Transforma objetos de base de datos ContactLog en formato de respuesta
- **TemplateResponseDTO**: Transforma documentos MongoDB de Template (Plantilla) en formato de respuesta

## Middleware

- **corsMiddleware**: Maneja CORS (Compartición de Recursos de Origen Cruzado)
- **errorHandlerMiddleware**: Proporciona formato de respuesta de error consistente
- **requestValidation**: Valida solicitudes entrantes usando express-validator

## Validadores

La validación de entrada es manejada por express-validator con validadores personalizados para cada entidad:

- **contactValidators**: Valida solicitudes relacionadas con contactos
- **companyValidators**: Valida solicitudes relacionadas con empresas
- **templatesValidators**: Valida solicitudes relacionadas con plantillas
- **messageValidators**: Valida solicitudes relacionadas con mensajes
- **contactLogValidators**: Valida solicitudes relacionadas con registros de contactos

## Capa de Servicios

La lógica de negocio está organizada en módulos de servicio:

- **contactService**: Operaciones relacionadas con contactos
- **companyService**: Operaciones relacionadas con empresas
- **plantillaService**: Operaciones relacionadas con plantillas
- **messageService**: Operaciones de envío de mensajes (email y WhatsApp)
- **contactLogService**: Operaciones de registros de contactos
- **metricsService**: Operaciones de análisis y reportes

## Optimizaciones de Rendimiento

- **Indexación de Texto**: Indexación de texto en MongoDB para búsquedas eficientes de plantillas
- **Optimización de Consultas**: Consultas estructuradas con índices apropiados
- **Paginación**: Todos los endpoints de listado soportan paginación para limitar la transferencia de datos
- **Formateo de Respuesta**: Estructura de respuesta consistente con DTOs

## Desarrollo

### Estructura de Código

```
/
├── controllers/      # Manejadores de solicitudes
├── dtos/            # Objetos de Transferencia de Datos
├── lib/             # Bibliotecas compartidas
├── middleware/      # Middleware de Express
├── models/          # Modelos de MongoDB
├── prisma/          # Esquema y migraciones de Prisma
├── routes/          # Rutas de Express
├── services/        # Lógica de negocio
├── utils/           # Utilidades auxiliares
├── validator/       # Validadores de solicitudes
├── .env             # Variables de entorno
└── index.js         # Punto de entrada de la aplicación
```

### Scripts

- `npm start`: Iniciar el servidor de producción
- `npm run dev`: Iniciar el servidor de desarrollo con recarga en caliente
- `npm run migrate`: Ejecutar migraciones de Prisma

## Licencia

Este proyecto está licenciado bajo la Licencia ISC.
