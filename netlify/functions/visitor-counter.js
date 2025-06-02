const fs = require('fs');
const path = require('path');

exports.handler = async (event, context) => {
  // Path to store the count
  const filePath = path.join(__dirname, '..', '..', 'visitor-count.json');
  
  try {
    let countData = { count: 0 };
    
    // Read existing count if file exists
    if (fs.existsSync(filePath)) {
      countData = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }
    
    // Increment count
    countData.count += 1;
    
    // Save updated count
    fs.writeFileSync(filePath, JSON.stringify(countData, null, 2));
    
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, newCount: countData.count })
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message })
    };
  }
};
