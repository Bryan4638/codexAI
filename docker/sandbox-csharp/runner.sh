#!/bin/bash

# Create a temporary project directory by copying the template
PROJECT_DIR=$(mktemp -d /tmp/csharp_project_XXXXXX)
cp -r /app/TemplateProject/* "$PROJECT_DIR/"
cd "$PROJECT_DIR"

# Read user code from stdin and overwrite Program.cs
# We assume the user provides a class with Main
cat > Program.cs

# Build and Run
# Capture stderr to runtime_error.txt
# We use `dotnet run` which compiles and runs.
# We suppress build output usually, but if there's an error we want it.
# `dotnet run` prints build output to stdout/stderr.
# We want to separate compile errors from runtime errors if possible, but `dotnet run` does both.
# A better way is `dotnet build` then `dotnet run --no-build`.

dotnet build -v q --nologo > build_output.txt 2> build_error.txt

if [ $? -ne 0 ]; then
    # Compilation failed
    cat build_output.txt >&2
    cat build_error.txt >&2
    rm -rf "$PROJECT_DIR"
    exit 1
fi

# Run
dotnet run --no-build --nologo > output.txt 2> runtime_error.txt
EXIT_CODE=$?

if [ $EXIT_CODE -eq 0 ]; then
    cat output.txt
else
    cat runtime_error.txt >&2
fi

rm -rf "$PROJECT_DIR"
exit $EXIT_CODE
