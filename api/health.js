export default function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    service: 'OpenAI Nutrition Agents',
    agents: {
      chat: 'online',
      image: 'online', 
      nutrition: 'online',
      coordinator: 'online'
    }
  });
}
