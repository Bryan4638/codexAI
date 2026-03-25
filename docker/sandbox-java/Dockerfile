# docker/sandbox-java/Dockerfile
FROM docker-io.cuza.dev/library/eclipse-temurin:17-jdk-alpine

# Usuario no-root
RUN apk add --no-cache bash && adduser -D javauser

WORKDIR /app

# Política de seguridad Java
COPY java.policy /app/
COPY runner.sh /app/

# Compilador y ejecutor seguros
RUN chmod +x runner.sh

USER javauser

# Variables de entorno
ENV JAVA_OPTS="-Djava.security.manager -Djava.security.policy==java.policy"

CMD ["./runner.sh"]
