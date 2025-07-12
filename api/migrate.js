import migrate from '../../migrations/migrate.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Simple authentication check
  const authHeader = req.headers.authorization;
  const expectedAuth = process.env.MIGRATION_SECRET || 'migration-secret';
  
  if (!authHeader || authHeader !== `Bearer ${expectedAuth}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    console.log('🔄 Starting database migration via API...');
    
    await migrate();
    
    console.log('✅ Database migration completed successfully');
    
    res.status(200).json({ 
      success: true, 
      message: 'Database migration completed successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('❌ Migration failed:', error);
    
    res.status(500).json({ 
      success: false, 
      error: 'Migration failed', 
      details: error.message,
      timestamp: new Date().toISOString()
    });
  }
}
