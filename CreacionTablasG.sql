create database GestorTareas
go

create table Usuarios(
UsuarioID int identity(1,1) primary key,
Nombre varchar (50) not null,
Email varchar(50) unique not null,
Edad int,
Contraseña varbinary(64) not null
);

create table Categorias(
CategoriaID int identity(1,1) primary key,
UsuarioID int not null,
NombreCat varchar(50) not null,
ColorHex varchar(7) DEFAULT '#808080',
constraint FK_UsuarioCategoria foreign key (UsuarioID) references Usuarios(UsuarioID)
);

create table Tareas(
TareasID int identity(1,1) primary key,
UsuarioID int not null,
Titulo varchar(100) not null,
Descripcion varchar(500),
Estado varchar(20) default 'Pendiente',
FechaCreacion datetime default getdate(),
CategoriaID int null,
Prioridad int default 2,
constraint FK_TareaCategoria foreign key (CategoriaID) references Categorias(CategoriaID),
constraint FK_Usuario foreign key (UsuarioID) references Usuarios(UsuarioID)
);


