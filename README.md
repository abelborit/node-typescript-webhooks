# Node & TypeScript - WebHooks

---

## Parte I:

# Temas puntuales de la sección

### ¿Qué veremos en esta sección?

En esta sección trabajaremos con webhooks, con los cuales vamos a crear una aplicación que sea capaz de comunicar Github con Discord mediante nuestro servidor. Es decir, crearemos una integración de GitHub + Discord para que cuando algo suceda en GitHub automáticamente caiga en nuestro servidor y nuestro servidor se lo va a mandar a Discord. Aquí también crearemos un servicio REST y más adelante será un Edge Function o una función serverless por así decirlo.

- Puntualmente veremos:

  - ¿Qué son los webhooks? (Explicación)
  - Como funcionan
  - Configurar los webhooks de:
    - Github
    - Discord
  - Crear un canal de discord para recibir los mensajes de nuestro server
  - Envio de imágenes a Discord
  - Creación de variables de entorno y todo lo necesario para que esto funcione.

### \* PASOS A REALIZAR:

1. NOTA: algunas ideas de este proyecto fueron inspiradas de este video: https://www.youtube.com/watch?v=41NOoEz3Tzc

2. Otras formas de enviar los eventos de GitHub directamente a Discord

   - https://dev.to/jaeyson/simple-way-to-send-github-events-to-a-discord-channel-using-webhook-naj

   - https://superuser.com/questions/1189901/can-i-integrate-a-discord-channel-with-github-pull-requests

3. ejemplo

### \* RECURSOS A USAR:

- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`
- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`
- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`

### \* NOTAS:

- Explicación sobre los WebHooks:

  - Empecemos sin el uso de los webhooks, supongamos que tenemos una aplicación que depende totalmente de nuestra computadora en el frontend, lo cual no es recomendado que dependa del navegador web porque es muy volatil. Con esa consigna, entonces tenemos una aplicación de un carrito de compras y ya estamos listos para pagar y se lo va a enviar a una plataforma como por ejemplo a PayPal, Mercado Pago, etc, entonces esta plataforma lo recibe, procesa el pago y en ese procesamiento supongamos que el cliente/usuario cierra el navegador web, perdió conexión, etc y en ese mismo punto en el tiempo o después, la plataforma ya procesó el pago y le regresa al usuario esa confiramción pero como ya no está el navegador web porque se cerró o se perdió conexión, entonces no hay nada que hacer y ¿Qué pasaría en ese punto y qué podemos hacer? Entonces para eso, nosotros NO queremos depender del navegador web porque no debemos confiar en que el cliente/usuario se va a mantener en el navegador hasta finalizar el proceso de compra u otro proceso que no necesariamente puede ser un carrito de compras.

  - Una aproximación un poco más asertada que lo anterior, pero aún no sería lo ideal, sería que nuestro servidor (ya no el cliente o navegador web) estaría esperando esa respuesta, es decir, enviamos nuestra solicitud de pago a una plataforma como por ejemplo a PayPal, Mercado Pago, etc, entonces esta plataforma lo recibe, procesa el pago pero mientras está procesando el pago, nuestro servidor empieza a realizarle muchas peticiones HTTP para preguntar el estado de ese pago, lo cual va a traer consigo que un 99.99999% del tiempo no regrese una información importante porque aún nada pasó porque aún se sigue procesando el pago, y la petición HTTP tiene que seguir enviándose y esperando a que nos responda la validación y confirmación y luego, después de un rato, la plataforma de pago ya nos valida que se realizó el pago entonces ahí recién la petición HTTP tendrá esa respuesta con la validación que ya se realizó y ahí recién se actualiza nuestro backend con esa respuesta. El problema de hacerlo de esta manera es que vamos a sobrecargar nuestro servidor con peticiones HTTP que no son necesarias y también puede ser que esas plataformas externas de pago al ver que nosotros estamos enviándole varias peticiones HTTP nos puedan bloquear las direcciones IP o nos restrinjan porque ese flujo sería solo para un cliente/usuario pero nosotros podríamos tener varios clientes/usuarios en nuestro sitio web.

  - Para solucionar lo anterior es donde entran a tallar los WebHooks. La idea es que cuando se paga, cuando PayPal u otra plataforma de pago recibe esa confirmación de pago o esa acción que a nosotros nos interesa escuchar, sean ellos mismos quienes nos notifiquen de que algo sucedió. Nos van a notificar llamando a nuestro servidor mediante una petición HTTP mediante ya sea una RESTFull API, que usualmante es un post, y nosotros también vamos a poder hacer eso mediante un Edge Function, es decir, puede ser un endpoint que reciba la información de un webhook o puede ser una edge function. En teoría es bastante simple, pero podríamos pensar, si estamos exponiendo un endpoint ¿Qué pasa si alguien lo descubre si hace ingeniería inversa por ejemplo? Porque puede encontrar o bombardear nuestro backend hasta encontrar esos endpoints y puede ser que alguien se dé cuenta de que si llama "api/payments/:id" y le manda el "id" del payment y lo marque como "pagado" entonces aquí hay un pequeño inconveniente el cual nosotros tenemos que siempre pensar de que allá afuera hay gente que nos va a querer hacer daño.

    - Entonces, ¿cómo podemos prevenir esto? Regresando al panorama donde nosotros tenemos nuestro servidor y en este caso quien sea que va a terminar implementando nuestros Webhooks, nosotros tenemos que establecer en el modo de desarrollo, cuando nosotros estamos creando nuestros endpoints o nuestra comunicación con Webhooks, nosotros vamos a establecer un "Secret Token" o una llave secreta o un "seed", o algo como por ejemplo una palabra secreta que nadie deba de saber y este token nosotros se lo vamos a dar a PayPal cuando lo estamos haciendo o a quien sea que haga nuestro backend. Nosotros le vamos a decir a "PayPal que tenga en cuenta este token y cuando vayas a hablar con mi servidor tienes que mandarme ese token, tienes que mandarme esa información ahí" y si viene esa información, entonces yo sé que es una petición original y estás enviando lo que estamos esperando, entonces recién se procesa esa petición o hago lo que estaba esperando yo hacer. Pero si es nuevamente la persona que no sabe de la existencia de ese token y manda llamar a mi servidor ese servidor va a decir, "Bueno, ¿dónde está el token? Ese token no es. Esa no era la palabra que yo estaba esperando". Entonces se rechaza esa petición porque no es de quien dice ser.

    - Ahora, conforme vamos avanzando y ya se tiene nuestro backend implementado o nuestra "Edge Function" o nuestra RESTful API ya completamente seguro y probado, podemos inclusive detectar si hay muchas llamadas fallidas de una dirección IP y banear esa dirección IP por ya sea 1 minuto, luego 5 minutos luego 10 minutos y así sucesivamente para que estas personas no vayan a bombardearnos constantemente con información o vayan a hacernos algún ataque serio a nuestros endpoints. Hay que tener presente eso.

- Un par de consideraciones antes de empezar a trabajar con los Webhooks:

  - Primero, nunca hay que compartir los "secrets". Solo dos personas deberían de conocerlo, es decir, en este caso la entidad que va a comunicarse con nosotros y nosotros mismos son los que vamos a hacerlo. Usualmente lo podemos hacer mediante variables de entorno que eso sería lo más común y así lo vamos a hacer en este proyecto.

  - Segundo, los secretos deben de ser aleatorios y seguros. No confiar en fechas de nacimiento, en la edad de sus amigos, etc.

  - Tercero, hay que seguir las recomendaciones de la documentación de los Webhooks que queremos implementar, es decir, los servicios que queremos usar, por ejemplo, si estamos en PayPal, Stripe o cualquier otro lugar, como GitHub, por ejemplo, que queramos implementarlo por ahí en un proyecto, entonces siempre seguir las recomendaciones de la documentación para implementarlo de la manera que ellos recomiendan.

  - Cuarto, nunca confiar en que el anonimato nos va a salvar, es decir, recordar que allá afuera hay personas que siempre van a estar buscando de qué manera hacer daño, de qué manera afectar a otras personas sin importar si eres una persona que solo tiene un cliente.

  - Quinto, la idea es la misma a través de todos los servicios que ofrecen Webhooks pero la implementación puede variar un poco pero en general es la misma idea.

- NOTA: haremos un proyecto con GitHub y sus webhooks, entonces los webhooks ofrecen una manera de enviar las notificaciones a un servidor web externo siempre que se produzcan determinadas acciones en GitHub.

- ejemplo

---

## Parte I:

# Temas puntuales de la sección

### ¿Qué veremos en esta sección?

Esta sección es bastante corta, porque nos enfocaremos únicamente en la verificación de los headers de autenticación que nos ofrece Github para validar y autofirmar nuestro payload para verificar que lo que estamos recibiendo fue literalmente firmado por GitHub y no por un tercero con algún fin malicioso.

- Puntualmente veremos:

  - Headers de petición personalizados
  - Middleware de autenticación
  - Bloqueo de peticiones no válidas

### \* PASOS A REALIZAR:

1. ejemplo
2. ejemplo
3. ejemplo

### \* RECURSOS A USAR:

- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`
- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`
- Paquete `nombre_paquete` usando `comando_paquete` desde `url_paquete`

### \* NOTAS:

- ejemplo
- ejemplo
- ejemplo

---
