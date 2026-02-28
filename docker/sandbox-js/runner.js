// Lee código de stdin, ejecuta con límites, escribe resultado a stdout
const vm = require('vm');
const readline = require('readline');

// Timeout global
const globalTimeout = setTimeout(() => {
  console.error('Timeout global alcanzado');
  process.exit(124);
}, 12000);

async function main() {
  const code = await new Promise(resolve => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false
    });
    
    let input = '';
    rl.on('line', line => input += line + '\n');
    rl.on('close', () => resolve(input));
  });

  let capturedOutput = '';

  try {
    const sandbox = {
      console: {
        log: (...args) => {
          capturedOutput += args.join(' ') + '\n';
        },
        error: (...args) => {
          capturedOutput += args.join(' ') + '\n';
        }
      },
      setTimeout: undefined,
      setInterval: undefined,
      // APIs limitadas...
    };

    const script = new vm.Script(code, {
      timeout: 10000,
      displayErrors: true
    });

    const result = script.runInNewContext(sandbox, {
      timeout: 10000,
      memoryLimit: 50 * 1024 * 1024 // 50MB
    });

    clearTimeout(globalTimeout);

    process.stdout.write(JSON.stringify({
      success: true,
      result: result,
      output: capturedOutput
    }));
  } catch (error) {
    clearTimeout(globalTimeout);
    process.stdout.write(JSON.stringify({
      success: false,
      error: error.message,
      output: capturedOutput
    }));
  }
}

main().catch(error => {
  clearTimeout(globalTimeout);
  console.error(error);
});
