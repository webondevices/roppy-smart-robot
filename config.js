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
  }
};
