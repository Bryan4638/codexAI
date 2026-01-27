#!/bin/bash

# Leer código
CODE=$(cat)

# Crear archivo temporal
TEMP_FILE=$(mktemp /tmp/java_code_XXXXXX.java)
echo "$CODE" > "$TEMP_FILE"

# Nombre de la clase (debe coincidir con nombre de archivo)
# Asumimos que el usuario no envia package declaration complicado o lo manejamos simple
# El truco `basename ... .java` funciona si el archivo tiene el nombre correcto.
# Pero `mktemp` crea nombres aleatorios. Java requiere que la clase publica coincida con el archivo.
# Si el codigo del usuario es `public class Main { ... }`, el archivo debe ser Main.java.
# Vamos a intentar detectar el nombre de la clase o forzar Main.

# Intentar extraer nombre de clase pública
CLASS_NAME=$(echo "$CODE" | grep -o 'public class [A-Za-z0-9_]*' | cut -d' ' -f3)

if [ -z "$CLASS_NAME" ]; then
    # Si no hay clase publica, quizas es clase default.
    # Usaremos un nombre fijo "Solution" y renombraremos.
    CLASS_NAME="Solution"
    # Reemplazar nombre de clase si existe "class Algo" -> "class Solution"
    # Esto es arriesgado regex, mejor simplificamos:
    # Simplemente guardamos como Solution.java y esperamos que el usuario use `class Solution` o no public class.
fi

# Mejor enfoque: Guardar siempre como Main.java y pedir al usuario que use Main, o hackear el nombre.
# Para este ejemplo siguiendo la guia, usare el nombre del temp file pero eso fallara si la clase es publica.
# La guia usa `basename "$TEMP_FILE" .java`. Esto implica que la clase debe llamarse como el archivo temp (ej: java_code_AbCdEf).
# El usuario proveera codigo. Si tiene `public class`, fallará.
# Vamos a forzar el nombre a Main.java para consistencia en sandbox.
rm "$TEMP_FILE"
TEMP_FILE="/tmp/Main.java"
CLASS_NAME="Main"
echo "$CODE" > "$TEMP_FILE"

# Compilar con límites
# Compilar con límites
# Compilar con límites
timeout 10 javac -cp . "$TEMP_FILE" 2> /tmp/compile_error.txt

if [ $? -ne 0 ]; then
    cat /tmp/compile_error.txt >&2
    rm -f "$TEMP_FILE" /tmp/*.class /tmp/compile_error.txt
    exit 1
fi

# Ejecutar con seguridad
cd /tmp
timeout 5 java \
    -Djava.security.manager \
    -Djava.security.policy==/app/java.policy \
    -cp . "$CLASS_NAME" 2> /tmp/runtime_error.txt

EXIT_CODE=$?

if [ $EXIT_CODE -ne 0 ]; then
    cat /tmp/runtime_error.txt >&2
    # Si hay output parcial, se mantiene en stdout
fi

# Cleanup
rm -f "$TEMP_FILE" /tmp/*.class /tmp/compile_error.txt /tmp/runtime_error.txt

exit $EXIT_CODE
