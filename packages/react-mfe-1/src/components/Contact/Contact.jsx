import React from 'react';

function Contact(props) {
  return (
    <div>
      Contact. value set from communication via app shell-{' '}
      {JSON.stringify(props.state)}
    </div>
  );
}

export default Contact;
