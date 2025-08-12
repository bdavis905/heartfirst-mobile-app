import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';

// ES module compatibility
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function handler(req, res) {
  // Serve the main HTML file for the root route
  if (req.url === '/' || req.url === '/index.html') {
    const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
    
    if (fs.existsSync(htmlPath)) {
      const html = fs.readFileSync(htmlPath, 'utf8');
      res.setHeader('Content-Type', 'text/html');
      return res.status(200).send(html);
    }
  }
  
  // For all other routes, return a simple response
  res.status(200).json({ 
    message: 'OpenAI Nutrition Agents API',
    status: 'online',
    endpoints: [
      '/api/chat',
      '/api/analyze-image',
      '/api/health'
    ]
  });
}
