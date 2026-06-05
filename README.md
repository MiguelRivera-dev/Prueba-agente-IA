# ChatBot de Teto (TetoBot) 🤖🥖

Este proyecto consiste en una aplicación web de chat interactiva que utiliza la API de **Google Gemini** para responder a los mensajes del usuario con la personalidad de **Teto Kasane** (UTAU). La solución está estructurada con un backend ligero en Python (con Flask) y una interfaz web moderna, responsiva y animada (HTML, CSS, JavaScript) que incluye efectos de diseño premium.

---

## 📂 Estructura del Proyecto

```text
Agente IA/
│
├── app.py              # Servidor backend de Flask e integración con Google Gemini
├── index.html          # Interfaz de usuario (estructura de la app)
├── script.js           # Lógica interactiva en JavaScript (comunicación HTTP, DOM y scroll)
├── style.css           # Estilos visuales del chat (Glassmorphism, animaciones y tipografías)
├── .env                # Archivo seguro para almacenar la clave API de Gemini
├── requirements.txt    # Registro de dependencias de Python
│
├── teto_avatar.png     # Imagen de perfil de TetoBot en el chat
├── teto_home_bg.png    # Ilustración de fondo para la pantalla de inicio (Teto Kasane)
├── chat_bg.png         # Patrón de fondo para el chat (baguettes y estrellas)
└── venv/               # Entorno virtual de Python (específico para Windows)
```

---

## 🛠️ Librerías Utilizadas y Explicación

Para el correcto funcionamiento del backend en Python, se emplean las siguientes dependencias clave declaradas en `requirements.txt`:

1. **`Flask` (v3.0.0+)**
   * **¿Qué hace?:** Es un micro-framework web de Python ligero y fácil de extender.
   * **Propósito en el proyecto:** Crea y expone el servidor local y el endpoint HTTP POST `/chat` al que se conecta el frontend. Recibe los mensajes del usuario, los procesa y responde con la respuesta de la IA.

2. **`flask-cors` (v4.0.0+)**
   * **¿Qué hace?:** Habilita el intercambio de recursos de origen cruzado (CORS - *Cross-Origin Resource Sharing*).
   * **Propósito en el proyecto:** Permite que tu navegador realice peticiones HTTP seguras desde el frontend (abierto localmente como un archivo `file:///` o un servidor web local) hacia el backend que corre en `http://127.0.0.1:5000`. Sin esta librería, el navegador bloquearía la comunicación por seguridad.

3. **`google-genai` (v0.1.1+)**
   * **¿Qué hace?:** Es el SDK oficial y moderno de Google para interactuar de forma directa con los modelos de inteligencia artificial de Gemini.
   * **Propósito en el proyecto:** Inicializa el cliente API de Gemini, envía los mensajes y administra las configuraciones avanzadas de generación de texto.

4. **`python-dotenv` (v1.0.0+)**
   * **¿Qué hace?:** Lee pares clave-valor de un archivo `.env` en el directorio del proyecto y los carga como variables de entorno del sistema.
   * **Propósito en el proyecto:** Protege la API Key de Gemini (`GEMINI_API_KEY`). De esta forma, la clave confidencial nunca queda escrita ("hardcodeada") dentro del código de `app.py`, evitando filtraciones accidentales de seguridad.

---

## 🛠️ Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:
* **Python 3.8 o superior** (descárgalo de [python.org](https://www.python.org/)).
* Una **API Key de Google Gemini**. Puedes obtener una gratuita en [Google AI Studio](https://aistudio.google.com/apikey).

---

## 🚀 Instalación y Configuración

Sigue estos pasos para configurar y ejecutar el proyecto localmente:

### 1. Preparar el Entorno Virtual (Recomendado)
Abre tu terminal en la carpeta raíz del proyecto (`Agente IA`) y ejecuta los siguientes comandos según tu sistema operativo:

* **En Windows:**
  ```powershell
  python -m venv venv
  .\venv\Scripts\activate
  ```

* **En macOS/Linux:**
  ```bash
  python3 -m venv venv
  source venv/bin/activate
  ```

### 2. Instalar Dependencias
Instala los paquetes necesarios definidos en `requirements.txt`:
```bash
pip install -r requirements.txt
```

### 3. Configurar la API Key de Gemini
Abre el archivo `.env` en la raíz del proyecto y reemplaza el marcador con tu clave de API:

```env
GEMINI_API_KEY=TU_API_KEY_AQUI
```
> ⚠️ **Nota:** Reemplaza `TU_API_KEY_AQUI` por la clave API real que obtuviste en Google AI Studio (suele empezar con `AIzaSy` o `AQ.`).

---

## 🏃‍♂️ Cómo Ejecutar la Aplicación

### Paso 1: Iniciar el Servidor Backend
Con tu entorno virtual activo, ejecuta el archivo `app.py`:
```bash
python app.py
```
El servidor comenzará a ejecutarse localmente en `http://127.0.0.1:5000`.

### Paso 2: Abrir la Interfaz de Usuario
Simplemente haz doble clic en el archivo [index.html](file:///c:/Users/Adrian/OneDrive/Documentos/ITESI/Servicio%20Social/Agente%20IA/Agente%20IA/index.html) para abrirlo en tu navegador de preferencia.

---

## 🧠 ¿Cómo funciona la arquitectura del Chat?

1. **Diseño Visual Dinámico y Premium (Frontend):**
   * Al iniciar, `index.html` carga con la clase `home-active` en el `<body>`, mostrando la ilustración anime de Kasane Teto ([teto_home_bg.png](file:///c:/Users/Adrian/OneDrive/Documentos/ITESI/Servicio%20Social/Agente%20IA/Agente%20IA/teto_home_bg.png)) como fondo de pantalla de bienvenida, y una tarjeta de inicio con efecto de vidrio esmerilado (*glassmorphism*).
   * Al presionar **Iniciar Chat**, JavaScript remueve `home-active` y agrega `chat-active` al `<body>`, cambiando el fondo suavemente al patrón repetible de baguettes y estrellas ([chat_bg.png](file:///c:/Users/Adrian/OneDrive/Documentos/ITESI/Servicio%20Social/Agente%20IA/Agente%20IA/chat_bg.png)).
   * La interfaz del chat cuenta con animaciones fluidas de entrada, escalado de botones, efecto de giro suave en el avatar de Teto y un scroll automático para mantener siempre a la vista el último mensaje enviado.

2. **Envío de Mensajes y Estado de Carga:**
   * Al escribir y pulsar **Enviar** (o **Enter**), el frontend valida que el texto no esté vacío, lo renderiza inmediatamente en pantalla, bloquea los campos para evitar reenvíos y muestra un indicador con el avatar y el texto *"TetoBot está escribiendo..."*.
   * Se hace una petición `POST` asíncrona enviando el mensaje en JSON al endpoint `/chat`.

3. **Procesamiento de IA con Personalidad (Backend):**
   * El backend Flask recibe la petición. Valida la existencia de la API key y del cliente.
   * Ejecuta la llamada al modelo **`gemini-flash-latest`** (Gemini 1.5 Flash, optimizado para la capa gratuita de uso).
   * Pasa como instrucción de sistema la personalidad estructurada de Teto (`TETO_PROMPT`), forzándola a actuar como UTAU de forma energética, un poco traviesa, tsundere y fanática del pan francés.
   * Si ocurre un error (como cuota superada `RESOURCE_EXHAUSTED` o clave incorrecta), Flask lo captura y devuelve un JSON con la descripción detallada del error para que sea visible en pantalla, facilitando el diagnóstico.

4. **Visualización:**
   * El cliente web recibe la respuesta exitosa (o de error), elimina el indicador de carga, y añade la burbuja junto al avatar de Teto.
   * Los saltos de línea `\n` recibidos son convertidos a saltos de línea HTML `<br>` para conservar el formato de los párrafos.
