module.exports = {
  rekognition: {
    collectionName: "FamilyFaces",
    region: "us-east-1",

    // Face detection
    FaceMatchThreshold: 80,
    MaxFaces: 1,

    // Label detection
    MaxLabels: 30,
    MinConfidence: 10
  },
  mqtt: {
    keyPath: "roppyTheRobot.private.key",
    certPath: "roppyTheRobot.cert.pem",
    caPath: "root-CA.crt",
    clientId: "roppyTheRobot",
    host: "a1dofbbl9cybm6.iot.eu-west-2.amazonaws.com",
    topic: "roppyControl"
  },
  get photo() {
    return {
      size: "640x480",
      fileName: Date.now() + ".jpg",
      environment: "pi"
    };
  }
};
