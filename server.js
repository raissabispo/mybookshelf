const { exec } = require('child_process');
const cors = require('cors');
app.use(cors());


exec('json-server --watch js/livros.json --port 3000 --host 0.0.0.0', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro: ${error.message}`);
    return;
  }
  if (stderr) {
    console.error(`stderr: ${stderr}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
});
