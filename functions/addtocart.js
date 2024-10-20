const { parse } = require('querystring');

exports.handler = async (event) => {
  if (event.httpMethod === 'POST') {
    const body = JSON.parse(event.body);

    // Add your logic here, e.g., add to cart

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Item added to cart.' }),
    };
  }

  return {
    statusCode: 405, // Method Not Allowed
    body: JSON.stringify({ message: 'Method not allowed.' }),
  };
};
