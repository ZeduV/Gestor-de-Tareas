# Gestor de Tareas

Un sistema completo para la gestión de tareas (Task Manager), desarrollado con una arquitectura Full-Stack. Permite a los usuarios registrarse, iniciar sesión y administrar sus tareas diarias de manera eficiente.

## Tecnologías Utilizadas

### Backend
- **Python** con **FastAPI**: Framework rápido y moderno para la creación de la API.
- **pyodbc**: Para la conexión a la base de datos SQL Server.
- **Uvicorn**: Servidor ASGI para ejecutar la aplicación FastAPI.

### Frontend
- **React**: Biblioteca de JavaScript para construir la interfaz de usuario.
- **Vite**: Herramienta de compilación rápida para el frontend.
- **Lucide React**: Biblioteca de iconos.

### Base de Datos
- **Microsoft SQL Server**: Sistema de gestión de bases de datos relacional.

## Características Principales

- **Autenticación de Usuarios**: Registro e inicio de sesión seguro.
- **Gestión de Tareas (CRUD)**:
  - Crear nuevas tareas con prioridad y descripción.
  - Visualizar todas las tareas asignadas al usuario.
  - Actualizar el estado de las tareas (ej. Pendiente, Completado).
  - Eliminar tareas.
- **Soporte de Categorías** (Estructura en base de datos preparada).

## Instalación y Configuración

### 1. Configuración de la Base de Datos
1. Asegúrate de tener instalado **Microsoft SQL Server** y el **ODBC Driver 17 for SQL Server**.
2. Abre tu gestor de base de datos (ej. SQL Server Management Studio).
3. Ejecuta el script `CreacionTablasG.sql` para crear la base de datos `GestorTareas` y sus tablas correspondientes (`Usuarios`, `Categorias`, `Tareas`).
4. (Opcional) Ejecuta el script `INSERT.sql` para insertar un usuario de prueba.

### 2. Configuración del Backend
1. Abre una terminal en la raíz del proyecto.
2. Crea un entorno virtual (recomendado):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # En Windows
   ```
3. Instala las dependencias necesarias:
   ```bash
   pip install fastapi uvicorn pyodbc pydantic
   ```
4. Inicia el servidor de desarrollo:
   ```bash
   uvicorn main:app --reload
   ```
   La API estará disponible en `http://127.0.0.1:8000`. Puedes consultar la documentación interactiva (Swagger UI) en `http://127.0.0.1:8000/docs`.

### 3. Configuración del Frontend
1. Abre una nueva terminal y navega a la carpeta del frontend:
   ```bash
   cd frontend
   ```
2. Instala las dependencias de Node.js:
   ```bash
   npm install
   ```
3. Inicia el servidor de desarrollo de Vite:
   ```bash
   npm run dev
   ```
   La aplicación web estará disponible en la URL que indique Vite (por lo general `http://localhost:5173`).

## 📡 Endpoints de la API (Resumen)

### Autenticación
- `POST /api/registro`: Registra un nuevo usuario.
- `POST /api/login`: Inicia sesión y devuelve un token.
- `GET /api/me`: Valida la sesión actual del usuario.

### Tareas
- `GET /api/tareas`: Obtiene todas las tareas del usuario.
- `POST /api/tareas`: Crea una nueva tarea.
- `PUT /api/tareas/{id_tarea}/estado`: Actualiza el estado de una tarea.
- `DELETE /api/tareas/{id_tarea}`: Elimina una tarea.
