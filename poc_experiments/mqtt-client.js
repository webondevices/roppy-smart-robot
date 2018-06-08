/*
 * Copyright 2010-2015 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * A copy of the License is located at
 *
 *  http://aws.amazon.com/apache2.0
 *
 * or in the "license" file accompanying this file. This file is distributed
 * on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 * express or implied. See the License for the specific language governing
 * permissions and limitations under the License.
 */

//node.js deps

//npm deps

//app deps
const deviceModule = require('aws-iot-device-sdk').device;

//begin module

function processTest() {
   //
   // The device module exports an MQTT instance, which will attempt
   // to connect to the AWS IoT endpoint configured in the arguments.
   // Once connected, it will emit events which our application can
   // handle.
   //
   const device = deviceModule({
      keyPath: 'roppyTheRobot.private.key',
      certPath: 'roppyTheRobot.cert.pem',
      caPath: 'root-CA.crt',
      clientId: 'roppyTheRobot',
      host: 'a1dofbbl9cybm6.iot.eu-west-2.amazonaws.com'
   });

   var timeout;
   var count = 0;
   const minimumDelay = 250;

   const delay = 3000;

    device.subscribe('topic_1');

   if ((Math.max(delay, minimumDelay)) !== delay) {
      console.log('substituting ' + minimumDelay + 'ms delay for ' + delay + 'ms...');
   }
   timeout = setInterval(function() {
      count++;

        device.publish('topic_2', JSON.stringify({
            mode1Process: count
        }));
   }, Math.max(delay, minimumDelay)); // clip to minimum

   //
   // Do a simple publish/subscribe demo based on the test-mode passed
   // in the command line arguments.  If test-mode is 1, subscribe to
   // 'topic_1' and publish to 'topic_2'; otherwise vice versa.  Publish
   // a message every four seconds.
   //
   device
      .on('connect', function() {
         console.log('connect');
      });
   device
      .on('close', function() {
         console.log('close');
      });
   device
      .on('reconnect', function() {
         console.log('reconnect');
      });
   device
      .on('offline', function() {
         console.log('offline');
      });
   device
      .on('error', function(error) {
         console.log('error', error);
      });
   device
      .on('message', function(topic, payload) {
         console.log('message', topic, payload.toString());
      });

}

processTest();
