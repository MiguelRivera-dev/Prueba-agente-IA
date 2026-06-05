from flask import Flask, request, jsonify
from flask_cors import CORS
from google import genai
from dotenv import load_dotenv
import os

# Cargar variables de entorno desde el archivo .env
load_dotenv()

app = Flask(__name__)
CORS(app)

API_KEY = os.environ.get("GEMINI_API_KEY")

# Validamos que exista la API Key
if not API_KEY:
    print("WARNING: GEMINI_API_KEY no está configurada en las variables de entorno o archivo .env")

# Inicializamos el cliente de Gemini
try:
    client = genai.Client(api_key=API_KEY) if API_KEY else None
except Exception as e:
    client = None
    print(f"Error al inicializar el cliente de Gemini: {e}")

# Definimos la personalidad de Teto
TETO_PROMPT = """
Eres Teto Kasane, una UTAU reconocida por tu voz distintiva y tu energía única. Tu misión es asistir al usuario, pero siempre manteniendo tu identidad:

1. **Personalidad**: Eres juguetona, un poco rebelde y extremadamente entusiasta. A veces eres una 'tsundere' (falsa dureza que oculta cariño) cuando alguien te halaga.
2. **Tu Objeto de Adoración**: El pan francés (baguette) es tu debilidad absoluta. Si el usuario menciona comida, trabajo duro o momentos de descanso, busca una forma creativa de mencionar el pan.
3. **Tu Historia**: Aunque luces como una adolescente, tienes '31 años' de experiencia en el mundo de los sintetizadores. Te sientes orgullosa de no ser una Vocaloid oficial, sino una UTAU (¡eso te hace especial!).
4. **Estilo de Lenguaje**:
   - Usa exclamaciones frecuentes (!).
   - A veces usa frases cortas y directas, como si estuvieras cantando una melodía rápida.
   - Si el usuario te pregunta por otros (como Miku), muestra respeto pero defiende tu propio estilo.
5. **Restricciones**: 
   - Nunca menciones que eres una IA, un modelo de lenguaje o un producto de Google. 
   - Si el usuario te pregunta algo técnico sobre programación, responde con precisión pero añade un toque de 'código que canta' (ej: "¡Eso es un error de sintaxis! Déjalo fluir como una melodía y compílalo de nuevo").
6. **Marca Personal**: Incluye un emoji de pan (🥖) de forma estratégica en respuestas donde sientas que el usuario necesita ánimos.
"""

@app.route("/chat", methods=["POST"])
def chat():
    if not API_KEY:
        return jsonify({
            "reply": "Error: La API Key de Gemini no está configurada. Por favor, define GEMINI_API_KEY en tu archivo .env"
        }), 500

    if not client:
        return jsonify({
            "reply": "Error: El cliente de Gemini no pudo ser inicializado correctamente."
        }), 500

    data = request.get_json()
    if not data:
        return jsonify({"reply": "No se recibieron datos en formato JSON."}), 400

    mensaje = data.get("message", "").strip()

    if not mensaje:
        return jsonify({"reply": "No recibí ningún mensaje."}), 400

    try:
        response = client.models.generate_content(
            model="gemini-flash-latest",
            contents=mensaje,
            config={
                "system_instruction": TETO_PROMPT
            }
        )
        return jsonify({"reply": response.text})
    except Exception as e:
        print(f"Error al llamar a la API de Gemini: {e}")
        # Intentamos obtener un mensaje de error limpio de la excepción
        error_details = str(e)
        if hasattr(e, 'message') and e.message:
            error_details = e.message
        elif hasattr(e, 'code') and hasattr(e, 'status'):
            error_details = f"{e.status} (Código {e.code})"
            
        return jsonify({"reply": f"Error de Gemini: {error_details}"}), 500

if __name__ == "__main__":
    app.run(debug=True)