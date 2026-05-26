import pyodbc
from fastapi import FastAPI, HTTPException, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI(title="API Gestor de Tareas")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- FUNCIONES AUXILIARES ---
def obtener_usuario_id(token: str):
    """Extrae el ID del usuario desde el token."""
    try:
        return int(token.split("-")[-1])
    except:
        raise HTTPException(status_code=401, detail="Token inválido")

# --- MODELOS (POO) ---

class Tarea:
    def __init__(self, id_tarea, titulo, descripcion, estado, prioridad):
        self.id_tarea = id_tarea
        self.titulo = titulo
        self.descripcion = descripcion
        self.estado = estado
        self.prioridad = prioridad

    def to_dict(self):
        return {
            "id": self.id_tarea,
            "titulo": self.titulo,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "prioridad": self.prioridad
        }

class TareaNueva(BaseModel):
    titulo: str
    descripcion: str
    prioridad: int = 2

class UsuarioLogin(BaseModel):
    email: str
    password: str

class UsuarioRegistro(BaseModel):
    nombre: str
    email: str
    edad: int
    password: str

class EstadoActualizacion(BaseModel):
    estado: str

# --- CONTROLADOR (Gestor y Listas) ---

class GestorTareas:
    def __init__(self):
        self.cadena_conexion = 'DRIVER={ODBC Driver 17 for SQL Server};SERVER=.;DATABASE=GestorTareas;Trusted_Connection=yes;'

    def obtener_conexion(self):
        try:
            return pyodbc.connect(self.cadena_conexion)
        except Exception as e:
            print(f"Error de conexión: {e}")
            return None

    def obtener_todas(self, usuario_id):
        conexion = self.obtener_conexion()
        if not conexion: raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conexion.cursor()
        cursor.execute("SELECT TareasID, Titulo, Descripcion, Estado, Prioridad FROM Tareas WHERE UsuarioID = ?", (usuario_id,))
        
        lista_tareas = []
        for fila in cursor.fetchall():
            tarea_obj = Tarea(fila.TareasID, fila.Titulo, fila.Descripcion, fila.Estado, fila.Prioridad)
            lista_tareas.append(tarea_obj)
            
        conexion.close()
        return [t.to_dict() for t in lista_tareas]

    def agregar_tarea(self, nueva_tarea, usuario_id):
        conexion = self.obtener_conexion()
        if not conexion: raise HTTPException(status_code=500, detail="Error de BD")
        
        cursor = conexion.cursor()
        try:
            consulta = """
                INSERT INTO Tareas (UsuarioID, Titulo, Descripcion, Estado, Prioridad)
                VALUES (?, ?, ?, 'Pendiente', ?)
            """
            cursor.execute(consulta, (usuario_id, nueva_tarea.titulo, nueva_tarea.descripcion, nueva_tarea.prioridad))
            conexion.commit() 
            conexion.close()
            return {"mensaje": "Tarea creada exitosamente"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error al guardar: {e}")
            
    def eliminar_tarea(self, id_tarea, usuario_id):
        conexion = self.obtener_conexion()
        if not conexion:
            return {"error": "No se pudo conectar a la base de datos"}
        
        cursor = conexion.cursor()
        try:
            cursor.execute("DELETE FROM Tareas WHERE TareasID = ? AND UsuarioID = ?", (id_tarea, usuario_id))
            conexion.commit()
            conexion.close()
            return {"mensaje": "Tarea eliminada exitosamente"}
        except Exception as e:
            return {"error": f"Error al eliminar en BD: {e}"}

    def actualizar_estado(self, id_tarea, nuevo_estado, usuario_id):
        conexion = self.obtener_conexion()
        if not conexion:
            return {"error": "No se pudo conectar a la base de datos"}
        
        cursor = conexion.cursor()
        try:
            cursor.execute("UPDATE Tareas SET Estado = ? WHERE TareasID = ? AND UsuarioID = ?", (nuevo_estado, id_tarea, usuario_id))
            conexion.commit()
            conexion.close()
            return {"mensaje": f"Estado actualizado a {nuevo_estado}"}
        except Exception as e:
            return {"error": f"Error al actualizar en BD: {e}"}

    def registrar_usuario(self, usuario):
        conexion = self.obtener_conexion()
        if not conexion: raise HTTPException(status_code=500, detail="No hay conexión a la base de datos")
        
        cursor = conexion.cursor()
        try:
            password_bytes = usuario.password.encode('utf-8')
            
            consulta = """
                INSERT INTO Usuarios (Nombre, Email, Edad, Contraseña) 
                VALUES (?, ?, ?, ?)
            """
            cursor.execute(consulta, (usuario.nombre, usuario.email, usuario.edad, password_bytes))
            conexion.commit()
            conexion.close()
            return {"mensaje": "Usuario creado exitosamente"}
        except Exception as e:
            raise HTTPException(status_code=400, detail=f"Error al registrar: {e}")

    def login(self, credenciales):
        conexion = self.obtener_conexion()
        if not conexion: raise HTTPException(status_code=500, detail="No hay conexión a la base de datos")
        
        cursor = conexion.cursor()
        password_bytes = credenciales.password.encode('utf-8')
        
        consulta = "SELECT UsuarioID, Nombre FROM Usuarios WHERE Email = ? AND Contraseña = ?"
        cursor.execute(consulta, (credenciales.email, password_bytes))
        fila = cursor.fetchone()
        conexion.close()
        
        if fila:
            return {
                "token": f"token-valido-usuario-{fila.UsuarioID}", 
                "usuario": {"id": fila.UsuarioID, "nombre": fila.Nombre}
            }
        else:
            raise HTTPException(status_code=401, detail="Credenciales inválidas")

    def obtener_usuario(self, usuario_id):
        conexion = self.obtener_conexion()
        if not conexion: 
            raise HTTPException(status_code=500, detail="No hay conexión a la base de datos")
        
        cursor = conexion.cursor()
        cursor.execute("SELECT UsuarioID, Nombre FROM Usuarios WHERE UsuarioID = ?", (usuario_id,))
        fila = cursor.fetchone()
        conexion.close()
        
        if fila:
            return {"id": fila.UsuarioID, "nombre": fila.Nombre}
        else:
            raise HTTPException(status_code=404, detail="Usuario no encontrado")

# --- INSTANCIA DEL GESTOR ---
gestor = GestorTareas()

# --- RUTAS (Endpoints) ---

@app.get("/")
def ruta_raiz():
    return {"mensaje": "Bienvenido a la API del Gestor de Tareas"}

@app.get("/api/tareas")
def obtener_tareas(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    usuario_id = obtener_usuario_id(token)
    
    return gestor.obtener_todas(usuario_id)

@app.post("/api/tareas")
def crear_tarea(tarea: TareaNueva, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    usuario_id = obtener_usuario_id(token)
    
    return gestor.agregar_tarea(tarea, usuario_id)

@app.delete("/api/tareas/{id_tarea}")
def eliminar_tarea(id_tarea: int, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    usuario_id = obtener_usuario_id(token)
    
    return gestor.eliminar_tarea(id_tarea, usuario_id)

@app.put("/api/tareas/{id_tarea}/estado")
def actualizar_estado(id_tarea: int, actualizacion: EstadoActualizacion, authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    usuario_id = obtener_usuario_id(token)
    
    return gestor.actualizar_estado(id_tarea, actualizacion.estado, usuario_id)

# --- RUTAS DE AUTENTICACIÓN ---

@app.post("/api/registro")
def registro(usuario: UsuarioRegistro):
    return gestor.registrar_usuario(usuario)

@app.post("/api/login")
def login(credenciales: UsuarioLogin):
    return gestor.login(credenciales)

@app.get("/api/me")
def validar_sesion(authorization: str = Header(None)):
    if not authorization:
        raise HTTPException(status_code=401, detail="Token requerido")
    
    token = authorization.replace("Bearer ", "")
    usuario_id = obtener_usuario_id(token)
    
    return gestor.obtener_usuario(usuario_id)