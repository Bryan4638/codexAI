# docker/sandbox-csharp/Dockerfile
FROM mcr.microsoft.com/dotnet/sdk:7.0

# Usuario no-root
RUN useradd -m -u 1000 csharpuser

WORKDIR /app

COPY runner.sh /app/
RUN chmod +x runner.sh

# Crear proyecto plantilla para evitar correr `dotnet new` en cada ejecucion
RUN dotnet new console -o /app/TemplateProject
# Build inicial para bajar dependencias y cachear
WORKDIR /app/TemplateProject
RUN dotnet build
WORKDIR /app

# Dar permisos a TemplateProject para que el usuario pueda sobrescribir Program.cs y compilar
RUN chmod -R 777 /app/TemplateProject

# Dar permisos a /tmp
RUN chmod 777 /tmp

USER csharpuser

# Variables entorno para silenciar dotnet
ENV DOTNET_NOLOGO=true
ENV DOTNET_CLI_TELEMETRY_OPTOUT=true

CMD ["./runner.sh"]
