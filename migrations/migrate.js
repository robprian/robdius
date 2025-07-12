import sequelize from '../src/config/database.js';
import { Customer, User, Plan, Router, UserRecharge, AppConfig, Log } from '../src/models/index.js';
import bcrypt from 'bcrypt';

const migrate = async () => {
  try {
    console.log('🔄 Starting database migration...');
    
    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sync all models
    await sequelize.sync({ force: false, alter: true });
    console.log('✅ Models synchronized');
    
    // Create default admin user if not exists
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('P4ks1m1n', 10);
      await User.create({
        username: 'admin',
        password: hashedPassword,
        fullname: 'Administrator',
        email: 'robprian@gmail.com',
        user_type: 'SuperAdmin',
        status: 'Active'
      });
      console.log('✅ Default admin user created (username: admin, password: admin123)');
    }
    
    // Create default app config if not exists
    const configs = [
      { setting: 'CompanyName', value: 'Robdius' },
      { setting: 'address', value: 'Jl. Ganggeng Barat' },
      { setting: 'phone', value: '+6285591995511' },
      { setting: 'timezone', value: 'UTC+7' },
      { setting: 'maintenance_mode', value: 'false' },
      { setting: 'language', value: 'english' },
      { setting: 'currency', value: 'IDR' },
      { setting: 'decimal_mark', value: ',' },
      { setting: 'thousands_separator', value: '.' },
      { setting: 'enable_whatsapp', value: 'yes' },
      { setting: 'whatsapp_notifications', value: 'yes' }
    ];
    
    for (const config of configs) {
      const exists = await AppConfig.findOne({ where: { setting: config.setting } });
      if (!exists) {
        await AppConfig.create(config);
      }
    }
    console.log('✅ Default configuration created');
    
    // Create sample data if needed
    const customerCount = await Customer.count();
    if (customerCount === 0) {
      console.log('🔄 Creating sample data...');
      
      // Create sample customers
      const sampleCustomers = [
        {
          username: 'customer1',
          password: await bcrypt.hash('password123', 10),
          fullname: 'John Doe',
          email: 'john@example.com',
          phone_number: '+1234567890',
          address: '123 Main St',
          city: 'New York',
          status: 'Active',
          balance: 50.00
        },
        {
          username: 'customer2',
          password: await bcrypt.hash('P4ks1m1n', 10),
          fullname: 'Robby Aprianto',
          email: 'rbbaprianto@gmail.com',
          phone_number: '+6287738779828',
          address: 'Mertasinga',
          city: 'Cilacap',
          status: 'Active',
          balance: 25.00
        }
      ];
      
      for (const customer of sampleCustomers) {
        await Customer.create(customer);
      }
      
      // Create sample plans
      const samplePlans = [
        {
          name_plan: 'Basic Plan',
          bandwidth_name: '1M',
          type: 'Hotspot',
          type_plan: 'Limited',
          prepaid: 'yes',
          price: 10.00,
          validity: '30',
          validity_unit: 'Days',
          data_limit: 1000,
          data_unit: 'MB',
          time_limit: 0,
          time_unit: 'Hrs',
          enabled: true,
          description: 'Basic internet plan with 1GB data'
        },
        {
          name_plan: 'Premium Plan',
          bandwidth_name: '5M',
          type: 'Hotspot',
          type_plan: 'Unlimited',
          prepaid: 'yes',
          price: 25.00,
          validity: '30',
          validity_unit: 'Days',
          data_limit: 0,
          data_unit: 'MB',
          time_limit: 0,
          time_unit: 'Hrs',
          enabled: true,
          description: 'Premium unlimited internet plan'
        }
      ];
      
      for (const plan of samplePlans) {
        await Plan.create(plan);
      }
      
      // Create sample router
      const sampleRouter = {
        name: 'Main Router',
        ip_address: '192.168.1.1',
        username: 'admin',
        password: await bcrypt.hash('admin123', 10),
        description: 'Main Mikrotik Router',
        enabled: true,
        coordinates: '0,0',
        coverage: 100
      };
      
      await Router.create(sampleRouter);
      
      console.log('✅ Sample data created');
    }
    
    console.log('🎉 Migration completed successfully!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  }
};

// Run migration if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  migrate().then(() => {
    console.log('✅ Database migration completed');
    process.exit(0);
  }).catch(error => {
    console.error('❌ Migration failed:', error);
    process.exit(1);
  });
}

export default migrate;
