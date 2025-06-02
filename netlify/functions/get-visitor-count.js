const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const filePath = path.join(__dirname, '..', '..', 'visitor-count.json');
  
  try {
    let countData = { count: 0 };
    
    if (fs.existsSync(filePath)) {
      countData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        count: countData.count,
        lastUpdated: new Date().toISOString()
      })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
