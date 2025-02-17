const express = require('express');
const cors = require('cors');
const { exec } = require('child_process');

const app = express();
app.use(cors());  // <-- enables CORS with default settings



app.get('/run-python', (req, res) => {
  const { prompt, style, output } = req.query;
  exec(`python3 /Users/lokaladmin/Downloads/sketchkey-app-2/src/main.py "${prompt}" "${style}" "${output}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error}`);
      return res.status(500).send(error.message);
    }
    if (stderr) {
      console.error(`stderr: ${stderr}`);
      return res.status(500).send(stderr);
    }
    res.send(stdout);
  });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});
