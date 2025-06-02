// netlify/functions/visitor-counter.js
const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  const filePath = path.join(process.cwd(), 'visitor-count.json');
  
  try {
    let countData = { count: 0 };
    
    // Read existing count or create new file
    if (fs.existsSync(filePath)) {
      countData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Increment count
    countData.count += 1;
    
    // Save updated count
    fs.writeFileSync(filePath, JSON.stringify(countData));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
