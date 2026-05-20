Frontend integration examples for sending contact submissions to `/api/contact`.

1) Using fetch (browser):

```javascript
// prepare payload
const payload = {
  name: 'John Doe',
  email: 'john@gmail.com',
  phone: '9876543210',
  service: 'Website Development',
  message: 'Need a business website',
  source: 'Website Contact Form'
};

fetch('/api/contact', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(payload)
})
  .then(res => res.json())
  .then(data => console.log('Result', data))
  .catch(err => console.error(err));
```

2) Using axios (browser / frontend):

```javascript
import axios from 'axios';

const payload = { /* same as above */ };

axios.post('/api/contact', payload)
  .then(res => console.log(res.data))
  .catch(err => console.error(err.response?.data || err.message));
```

Server returns JSON `{ success: true, message: 'Notification sent' }` on success.
