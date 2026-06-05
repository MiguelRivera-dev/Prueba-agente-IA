function iniciarChat() {
    // Alternar clases en el body para cambiar fondos
    document.body.classList.remove('home-active');
    document.body.classList.add('chat-active');

    document.getElementById('home-screen').style.display = 'none';
    document.getElementById('chat-screen').style.display = 'flex'; // Cambiado a flex para alineación con CSS

    // Auto-scroll inicial y enfocar el campo de texto
    const chatBox = document.getElementById('chat-box');
    chatBox.scrollTop = chatBox.scrollHeight;
    document.getElementById('user-input').focus();

    console.log('Chat iniciado');
}

document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        enviarMensaje();
    }
});

async function enviarMensaje() {
    const input = document.getElementById('user-input');
    const sendBtn = document.querySelector('.btn-chat');
    const chatBox = document.getElementById('chat-box');
    
    const mensaje = input.value.trim();

    // Validar mensaje vacío
    if (!mensaje) {
        return;
    }

    // Escapar caracteres para prevenir XSS básico
    const safeMensaje = mensaje
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
        
    // Mostrar mensaje del usuario
    chatBox.innerHTML += `<div class="message user">${safeMensaje}</div>`;
    
    // Limpiar entrada y hacer scroll
    input.value = '';
    chatBox.scrollTop = chatBox.scrollHeight;

    // Deshabilitar controles mientras se procesa la petición
    input.disabled = true;
    if (sendBtn) sendBtn.disabled = true;

    // Crear y mostrar indicador de carga
    const loadingMessageId = 'loading-' + Date.now();
    chatBox.innerHTML += `
        <div class="message-container" id="${loadingMessageId}">
            <img src="teto_avatar.png" class="avatar" alt="Teto">
            <div class="message bot"><i>TetoBot está escribiendo...</i></div>
        </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        const res = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: mensaje })
        });

        // Eliminar el indicador de carga
        const loadingElement = document.getElementById(loadingMessageId);
        if (loadingElement) {
            loadingElement.remove();
        }

        if (!res.ok) {
            let errorText = "Error en el servidor.";
            try {
                const errorData = await res.json();
                if (errorData && errorData.reply) {
                    errorText = errorData.reply;
                }
            } catch (e) {
                errorText = `Error ${res.status}: ${res.statusText}`;
            }
            throw new Error(errorText);
        }

        const data = await res.json();
        
        // Reemplazar saltos de línea con <br> para visualización correcta
        const botReply = data.reply ? data.reply.replace(/\n/g, '<br>') : "No se obtuvo respuesta.";
        chatBox.innerHTML += `
            <div class="message-container">
                <img src="teto_avatar.png" class="avatar" alt="Teto">
                <div class="message bot">${botReply}</div>
            </div>`;

    } catch (error) {
        console.error("Error al enviar mensaje:", error);
        
        // Asegurar que el indicador de carga se elimine si ocurre un error
        const loadingElement = document.getElementById(loadingMessageId);
        if (loadingElement) {
            loadingElement.remove();
        }

        // Determinar el mensaje de error a mostrar (genérico si falló la conexión por completo)
        let errorMsg = error.message;
        if (error.message.includes("Failed to fetch") || error.message.includes("fetch")) {
            errorMsg = "No se pudo conectar con el servidor de TetoBot. Asegúrate de que el backend (Flask) esté corriendo en http://127.0.0.1:5000.";
        }

        // Mostrar mensaje de error en la UI
        chatBox.innerHTML += `
            <div class="message-container">
                <img src="teto_avatar.png" class="avatar" alt="Teto">
                <div class="message bot error"><strong>Error:</strong> ${errorMsg}</div>
            </div>`;
    } finally {
        // Habilitar controles y hacer foco en el input
        input.disabled = false;
        if (sendBtn) sendBtn.disabled = false;
        input.focus();
        
        // Scroll final
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}