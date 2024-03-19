# **Changelog**

### v1.0.71

##### Summary

- Corrección de datos del csv de las tarjetas

<br>

### v1.0.70

##### Summary

- Cambio de caracteres máximos en la columna password de la entidad user

<br>

### v1.0.69

##### Summary

- Nueva relacion entre transaccion y usuarios, valor por defecto null
- Al eliminar un usuario eliminar relación con tarjeta asignada
- Quitar eliminación en casacada.
- Crear en las entidades un estado para controlar la eliminación de entidades.
- Nuevo servicio para filtar transacciones.
- Cambio de columna serial_number en cargadores se modifico para que no sea valor único.

<br>

### v1.0.62

##### Summary

- Validar que no se creem tarjetas repetidas
- Corrección en servidor ocpp para que solo se puedan utilizar las tarjetas permitidas en el cargador correspondiente

### v1.0.61

##### Summary

- Validación en la creación de usuarios con email y username repetidos
- Devolución de exepciones de error en lugar de objetos vacios

<br>

### v1.0.55

##### Summary

- Cambio de formato de hora en los servicios ocpp
- Asignar una segunda tarjeta a un mismo usuario
- Corrección de la función desahbiltar

<br>

### v1.0.52

##### Summary

- Se ha eliminado un null de la respuesta del Authorize
- Se han puesto fechas de caducidad de las tarjetas a muy al futuro
- Se han corregido los formatos de las fechas para eliminar los milisegundos
- Se ha eliminado el timestamp de "Start Transaction"
- **Si se intenta asignar una tarjeta a un usuario que ya tiene otra devuelve un error y no permite hacerlo**

##### Jira Issues solved:

-

##### Known Issues

- En un cargador con dos bocas, se inician dos sesiones de carga independientes. Al terminar una sesión aparece en el frontal web que han terminado las dos. El backend funciona correctamente y mantiene una sesion (la correcta) abierta y sigue almacenando correctamente los datos.

<br>
### v1.0.50

##### Summary

- CORREGIDA LA FUNCIÓN DE DESHABILITAR
- Corregido numero de version en la vista web
- Eliminados campos total_charge y maximum_power
- Añadido campo "Consumption (Wh)" en la vista de sesiones de carga
- Cambiado BoxId por Nombre en el listado de cargadores

##### Jira Issues solved:

- [https://simon-it.atlassian.net/browse/PDP-5560](https://simon-it.atlassian.net/browse/PDP-5560)
- [https://simon-it.atlassian.net/browse/PDP-5785 \*\*](https://simon-it.atlassian.net/browse/PDP-5785)
- [https://simon-it.atlassian.net/browse/PDP-5786](https://simon-it.atlassian.net/browse/PDP-5786)

##### Known Issues

- En un cargador con dos bocas, se inician dos sesiones de carga independientes. Al terminar una sesión aparece en el frontal web que han terminado las dos. El backend funciona correctamente y mantiene una sesion (la correcta) abierta y sigue almacenando correctamente los datos.

<br>
### v1.0.48

##### Summary

- Fixed docker compose
- Removed Credit and DNI from card export
- Removed total charge, maximum power and renamed to "Consumption (Wh)" the fields in charge export
- Removed Direction and DNI from user export

##### Jira Issues solved:

- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5560](https://simon-it.atlassian.net/browse/PDP-5572)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5786](https://simon-it.atlassian.net/browse/PDP-5571)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5550](https://simon-it.atlassian.net/browse/PDP-5570)</span>

### v1.0.44

##### Summary

- Serial Number changed to Box ID
- Añadir numero de serie de la tarjeta en el CSV
- Titulos de las columnas en inglés en los CSV
- Imagenes cambiadas
- Eliminados campos "energía total consumida y cargada"
- Actualización de estado de los cargadores en tiempo real
- Se ha eliminado la foto de usuario y se dejan solo las iniciales
- Número de versión de la plataforma
- Popups se cierran al clickar fuera
- Unidades en el excel

##### Jira Issues solved:

- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5572](https://simon-it.atlassian.net/browse/PDP-5572)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5571](https://simon-it.atlassian.net/browse/PDP-5571)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5570](https://simon-it.atlassian.net/browse/PDP-5570)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5569](https://simon-it.atlassian.net/browse/PDP-5569)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5568](https://simon-it.atlassian.net/browse/PDP-5568)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5550](https://simon-it.atlassian.net/browse/PDP-5550)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5549](https://simon-it.atlassian.net/browse/PDP-5549)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5476](https://simon-it.atlassian.net/browse/PDP-5476)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5561](https://simon-it.atlassian.net/browse/PDP-5561)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5564](https://simon-it.atlassian.net/browse/PDP-5564)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5562](https://simon-it.atlassian.net/browse/PDP-5562)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5556](https://simon-it.atlassian.net/browse/PDP-5556)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5535](https://simon-it.atlassian.net/browse/PDP-5535)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5531](https://simon-it.atlassian.net/browse/PDP-5531)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5524](https://simon-it.atlassian.net/browse/PDP-5524)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5523](https://simon-it.atlassian.net/browse/PDP-5523)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5477](https://simon-it.atlassian.net/browse/PDP-5477)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5473](https://simon-it.atlassian.net/browse/PDP-5473)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5559](https://simon-it.atlassian.net/browse/PDP-5559)</span>

### v1.0.32

##### Summary

- Phone input limited to numbers
- When creating a user now it is visible even if it isn't from the same customer
- One user can only be linked to one card
- One card can only be linked to one user
- Corrected CSV export related to times
- Automatic front refresh every 10 seconds to view updates and status changes
- Fixed error when creating a charged with an already existing serial code

##### Jira Issues solved:

- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5572](https://simon-it.atlassian.net/browse/PDP-5572)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5550](https://simon-it.atlassian.net/browse/PDP-5550)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5549](https://simon-it.atlassian.net/browse/PDP-5549)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5476](https://simon-it.atlassian.net/browse/PDP-5476)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5560](https://simon-it.atlassian.net/browse/PDP-5560)</span>
- <span class="colour" style="color:rgb(0, 0, 0)">[https://simon-it.atlassian.net/browse/PDP-5478](https://simon-it.atlassian.net/browse/PDP-5478)</span>
