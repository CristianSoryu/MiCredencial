use micredencial;

drop table usuarios;
drop table roles;
drop table prestamos;

CREATE TABLE usuarios (
id_usuario INT NOT NULL PRIMARY KEY, /* cedula */
id_rol int not null,

/*credenciales de la persona*/
tipo_documento ENUM('CC', 'TI', 'cedula de extranjeria'),
user_handle varchar(30) NULL unique, /*sobrenombre*/
nombres varchar(100) not null,
apellidos varchar(100) not null,

foto LONGBLOB NULL,
email varchar(255) null unique,
contrasena varchar(255) null,
numero_de_telefono char (10) null unique,
fecha_de_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),

FOREIGN KEY (id_rol) REFERENCES roles(id_rol)
);

create table carnet (
id_carnet int auto_increment primary key,
id_usuario int not null,

estado_carnet ENUM('activo', 'inactivo', 'bloqueado', 'vencido') NOT NULL DEFAULT 'activo',
fecha_de_creacion DATE NOT NULL DEFAULT (CURRENT_DATE),
fecha_de_expiracion DATE NULL,

foreign key (id_usuario) references usuarios(id_usuario)
);

create table codigo_qr (
id_qr int auto_increment primary key,
id_carnet int not null,

codigo_qr VARCHAR(255) NOT NULL UNIQUE,
foreign key (id_carnet) references carnet(id_carnet)
);

CREATE TABLE roles (
id_rol INT auto_increment,
tipo_usuario ENUM(/*estudiantes*/
'estudiante', 'egresado', 'egresado NG',
'biblioteca', 'bienestar',
'docente', 'administrativo', 'seguridad', 'administrador', 
'visitante'
) NOT NULL,
primary key(id_rol)
);

CREATE TABLE prestamos (
id_prestamo int auto_increment,
id_usuario int not null,

nombre_prestamo varchar (100) not null, /*aqui puede poner el QB del libro*/
descripcion_prestamo varchar (250) null,

estado ENUM('prestado', 'devuelto', 'vencido', 'cancelado') NOT NULL DEFAULT 'prestado',
fecha_del_prestamo DATE NOT NULL DEFAULT (CURRENT_DATE),
fecha_limite DATE NOT NULL,
fecha_devolucion DATE NULL,

FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario),
primary key (id_prestamo)
);


INSERT INTO usuarios(id_usuario, nombres, apellidos) VALUES (1092520000, 'cristian', 'torres');
INSERT INTO roles(tipo_usuario) VALUES ('estudiante');
INSERT INTO roles(tipo_usuario) VALUES ('egresado');
INSERT INTO roles(tipo_usuario) VALUES ('egresado NG');
INSERT INTO roles(tipo_usuario) VALUES ('administrativo');
insert into prestamos (id_usuario, nombre_prestamo, fecha_limite, fecha_devolucion) values (1092520000, 'raquetas', now(), now());

select * from usuarios;
select * from roles;
select * from prestamos;
select * from carnet;
select * from codigo_qr;


DELIMITER //

CREATE TRIGGER trg_credencial_expiracion_6meses
BEFORE INSERT ON credenciales
FOR EACH ROW
BEGIN
    IF NEW.fecha_expiracion IS NULL THEN
        SET NEW.fecha_expiracion = DATE_ADD(NOW(), INTERVAL 6 MONTH);
    END IF;
END //

DELIMITER ;