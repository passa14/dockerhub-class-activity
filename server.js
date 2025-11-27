const express = require('express');
const path = require('path');
const app = express();
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Load proto
const PROTO_PATH = path.join(__dirname, 'grpc/clicker.proto');

const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const ClickerPlugin = grpcObject.ClickerPlugin;

// gRPC client
const client = new ClickerPlugin(
  `${process.env.PLUGIN_HOST}:${process.env.PLUGIN_PORT}`,
  grpc.credentials.createInsecure()
);

app.use(express.json());

let counter = 0;

app.get('/api/counter', (req, res) => {
  res.json({ counter });
});

app.post('/api/counter/increment', (req, res) => {
  client.Process({ number: counter }, (err, response) => {
    if (err) {
      console.error("gRPC error:", err);
      return res.status(500).json({ error: "Plugin error" });
    }
    counter = response.number;
    res.json({ counter });
  });
});

app.use('/', express.static(path.join(__dirname, 'public')));

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server listening on ${port}`));
