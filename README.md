# FASTCRM-EXPRESS-API1

Fast CRM API developed with Express, Prisma and MongoDB.

## Features

- Contact management
- Company management
- Message sending (Email and WhatsApp)
  - Individual message sending
  - Bulk message sending to multiple contacts
  - Template-based messaging
- Templates management
- Dashboard metrics

## Implementación del Dashboard

El dashboard proporciona una visión completa de las métricas del sistema usando datos de múltiples fuentes (PostgreSQL y MongoDB).

### Arquitectura

La implementación del dashboard sigue una arquitectura por capas:
- **Controladores**: Manejan las peticiones HTTP y respuestas (`metricsController.js`)
- **Servicios**: Contienen la lógica de negocio y agregación de datos (`metricsService.js`)
- **Rutas**: Definen los endpoints de la API (`metricsRoutes.js`)

### Endpoints de la API

| Endpoint | Método | Descripción |
|----------|--------|-------------|
| `/api/metrics/dashboard` | GET | Obtiene métricas completas del dashboard |

### Colección de Métricas

El dashboard recolecta métricas de diferentes fuentes de datos:

1. **Métricas de Contactos y Empresas** (PostgreSQL vía Prisma)
   - Número total de contactos en el sistema
   - Número total de empresas en el sistema
   
   **Código de consulta en `metricsService.js`**:
   ```js
   // Obtener conteo de contactos y empresas de PostgreSQL usando Prisma
   const [contactCount, companyCount] = await Promise.all([
     prisma.contact.count(),
     prisma.company.count()
   ]);
   ```

2. **Métricas de Plantillas** (MongoDB vía Mongoose)
   - Número total de plantillas
   - Desglose de plantillas por tipo (ej. seguimiento, bienvenida)
   
   **Código de consulta en `metricsService.js`**:
   ```js
   // Obtener conteo total de plantillas
   const totalCount = await Plantilla.countDocuments();
   
   // Obtener conteo por tipo usando agregación
   const typeBreakdown = await Plantilla.aggregate([
     { $group: { _id: "$type", count: { $sum: 1 } } },
     { $project: { type: "$_id", count: 1, _id: 0 } }
   ]);
   ```

3. **Métricas de Mensajes** (MongoDB vía Mongoose)
   - Total de mensajes enviados
   - Desglose de mensajes por método (email, WhatsApp)
   
   **Código de consulta en `messageService.js`**:
   ```js
   // Obtener conteo total de mensajes
   const totalCount = await MessageHistory.countDocuments();
   
   // Obtener conteo por método
   const emailCount = await MessageHistory.countDocuments({ method: 'email' });
   const whatsappCount = await MessageHistory.countDocuments({ method: 'whatsapp' });
   ```

### Detalles de Implementación

#### Flujo de Datos

1. **Ruta**: La petición HTTP llega a través de `metricsRoutes.js`:
   ```js
   // Definición de la ruta del dashboard
   router.get('/dashboard', metricsController.getDashboardMetrics);
   ```

2. **Controlador**: `metricsController.js` maneja la petición:
   ```js
   export const getDashboardMetrics = async (req, res) => {
     try {
       const metrics = await metricsService.getDashboardMetrics();
       res.status(200).json(successResponse(
         metrics,
         'Dashboard metrics fetched successfully'
       ));
     } catch (error) {
       console.error('Error in metrics controller:', error);
       res.status(500).json(errorResponse('Error fetching dashboard metrics', [error.message]));
     }
   };
   ```

3. **Servicio**: `metricsService.js` agrega los datos:
   ```js
   export const getDashboardMetrics = async () => {
     try {
       // Obtener conteo de contactos y empresas de PostgreSQL vía Prisma
       const [contactCount, companyCount] = await Promise.all([
         prisma.contact.count(),
         prisma.company.count()
       ]);
   
       // Obtener métricas de plantillas de MongoDB
       const templateMetrics = await getTemplateMetrics();
   
       // Obtener métricas de mensajes
       const messageMetrics = await getMessageMetrics();
   
       return {
         contacts: {
           total: contactCount
         },
         companies: {
           total: companyCount
         },
         templates: templateMetrics,
         messages: messageMetrics
       };
     } catch (error) {
       console.error('Error fetching dashboard metrics:', error);
       throw error;
     }
   };
   ```

#### Cálculo de Métricas de Plantillas

El método `getTemplateMetrics` dentro de `metricsService.js` usa MongoDB Aggregation Framework para obtener estadísticas de plantillas:

```js
const getTemplateMetrics = async () => {
  try {
    // Obtener conteo total de plantillas
    const totalCount = await Plantilla.countDocuments();

    // Obtener conteo por tipo usando agregación
    const typeBreakdown = await Plantilla.aggregate([
      { $group: { _id: "$type", count: { $sum: 1 } } },
      { $project: { type: "$_id", count: 1, _id: 0 } }
    ]);

    // Convertir a un formato más amigable
    const byType = {};
    typeBreakdown.forEach(item => {
      byType[item.type] = item.count;
    });

    return {
      total: totalCount,
      byType
    };
  } catch (error) {
    console.error('Error fetching template metrics:', error);
    return { total: 0, byType: {} };
  }
};
```

#### Cálculo de Métricas de Mensajes

El método `getMessageMetrics` dentro de `messageService.js` recolecta estadísticas de envíos de mensajes:

```js
export const getMessageMetrics = async () => {
  try {
    console.log('Fetching message metrics from database...');
    
    // Obtenemos el conteo total
    const totalCount = await MessageHistory.countDocuments();
    
    // Obtenemos el conteo por método
    const emailCount = await MessageHistory.countDocuments({ method: 'email' });
    const whatsappCount = await MessageHistory.countDocuments({ method: 'whatsapp' });
    
    return {
      total: totalCount,
      byMethod: {
        email: emailCount,
        whatsapp: whatsappCount
      }
    };
  } catch (error) {
    console.error('Error fetching message metrics:', error);
    return { total: 0, byMethod: { email: 0, whatsapp: 0 } };
  }
};
```

### Respuesta de Ejemplo

```json
{
  "success": true,
  "message": "Dashboard metrics fetched successfully",
  "data": {
    "contacts": {
      "total": 154
    },
    "companies": {
      "total": 32
    },
    "templates": {
      "total": 28,
      "byType": {
        "seguimiento": 18,
        "bienvenida": 10
      }
    },
    "messages": {
      "total": 347,
      "byMethod": {
        "email": 245,
        "whatsapp": 102
      }
    }
  }
}
```

### Estructura del Código

- **metricsController.js**: Contiene el controlador `getDashboardMetrics` que formatea las respuestas API
- **metricsService.js**: Alberga la lógica para obtener y combinar métricas de diferentes fuentes de datos
- **metricsRoutes.js**: Define el endpoint `/api/metrics/dashboard`
- **messageService.js**: Contiene la función `getMessageMetrics` utilizada por el servicio de métricas

### Conexión con Bases de Datos

- **PostgreSQL** (vía Prisma): Se conecta a través del cliente Prisma inicializado en `lib/prisma.js` para obtener datos de contactos y empresas
- **MongoDB** (vía Mongoose): Se conecta utilizando los modelos Mongoose definidos para plantillas (`Plantilla.js`) y el historial de mensajes (`MessageHistory.js`)

### Consideraciones de Rendimiento

La implementación utiliza `Promise.all()` para ejecutar consultas de base de datos independientes de forma concurrente, optimizando el tiempo de respuesta. Para conjuntos de datos grandes, el proceso de recopilación de métricas evita cargar registros completos y en su lugar utiliza pipelines de agregación y operaciones de conteo para mayor eficiencia.

Si el tiempo de respuesta se vuelve un problema, se podrían implementar estrategias adicionales como:

1. Cacheo de métricas con un TTL (tiempo de vida) definido
2. Cálculo de métricas en segundo plano mediante trabajos programados
3. Fragmentación de métricas para cargas parciales bajo demanda

