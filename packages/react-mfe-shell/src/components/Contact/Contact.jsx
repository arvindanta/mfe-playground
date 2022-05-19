import React from 'react';

function Contact() {
  return (
    <div>
      <mfe-application
        app-id='reactMFE'
        instance-id='mfe1'
        style={{ '--mfe-width': 'calc(73vw)' }}
        id='x'
        registry-url='http://localhost:9001'
        version='0.1.1'
      ></mfe-application>
    </div>
  );
}

export default Contact;
