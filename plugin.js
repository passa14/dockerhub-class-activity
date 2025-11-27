const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');
const path = require('path');

const PROTO_PATH = path.join(__dirname, 'grpc', 'clicker.proto');
const packageDef = protoLoader.loadSync(PROTO_PATH);
const grpcObject = grpc.loadPackageDefinition(packageDef);
const ClickerPlugin = grpcObject.ClickerPlugin;

const server = new grpc.Server();

server.addService(ClickerPlugin.service, {
  Process: (call, callback) => {
    const input = call.request.number;
    const output = input + 2;
    console.log(`Plugin received: ${input}, returning: ${output}`);
    callback(null, { number: output });
  }
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  () => {
    console.log("Add2 plugin running on port 50051");
    server.start();
  }
);
