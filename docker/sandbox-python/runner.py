import sys
import json
import resource
import traceback
from io import StringIO
from contextlib import redirect_stdout, redirect_stderr

def set_limits():
    """Establece límites de recursos"""
    # 2 segundos CPU
    try:
        resource.setrlimit(resource.RLIMIT_CPU, (2, 2))
    except ValueError:
        pass # Puede fallar en algunos entornos Docker segun privilegios, pero intentamos

    # 50MB memoria
    try:
        resource.setrlimit(resource.RLIMIT_AS, (50 * 1024 * 1024, 50 * 1024 * 1024))
    except ValueError:
        pass
    
    # No crear archivos (Soft limit 0)
    try:
        resource.setrlimit(resource.RLIMIT_NOFILE, (0, 0))
    except ValueError:
        pass

def main():
    set_limits()
    
    # Leer código de stdin
    # IMPORTANTE: Si RLIMIT_NOFILE es 0, no podremos leer stdin ni escribir stdout!
    # El usuario sugirio RLIMIT_NOFILE (0,0). Esto bloqueara CUALQUIER FD.
    # Stdin es fd 0, stdout 1, stderr 2.
    # Necesitamos al menos 3 descriptores.
    # Ajustaremos esto para permitir stdio.
    try:
         # Permitir FDs basicos
        resource.setrlimit(resource.RLIMIT_NOFILE, (10, 10))
    except ValueError:
        pass

    try:
        code = sys.stdin.read()
    except Exception:
        # Si falla leer, quizas por limites
        code = ""
    
    # Capturar output
    output = StringIO()
    error_output = StringIO()
    
    try:
        with redirect_stdout(output), redirect_stderr(error_output):
            # Ejecutar en espacio restringido
            exec_globals = {
                '__builtins__': {
                    'print': print,
                    'len': len,
                    'range': range,
                    'str': str,
                    'int': int,
                    'float': float,
                    'list': list,
                    'dict': dict,
                    'set': set,
                    'bool': bool,
                    # Solo funciones seguras
                }
            }
            
            compiled = compile(code, '<user_code>', 'exec')
            exec(compiled, exec_globals)
            
        result = {
            'success': True,
            'output': output.getvalue(),
            'error': error_output.getvalue()
        }
        
    except Exception as e:
        result = {
            'success': False,
            'output': output.getvalue(),
            'error': f"{str(e)}"
        }
    
    # Necesitamos imprimir el resultado JSON a stdout real
    # Restaurar stdout real para imprimir el resultado
    sys.stdout.write(json.dumps(result))
    sys.stdout.flush()

if __name__ == '__main__':
    main()
