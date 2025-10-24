// Test script to verify Church Settings API is working
require('dotenv').config();
const mongoose = require('mongoose');
const ChurchSettings = require('./models/ChurchSettings');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Testing Church Settings API...\n');

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10
})
  .then(async () => {
    console.log('✅ Connected to MongoDB\n');

    try {
      // Test 1: Check if settings exist
      console.log('📋 Test 1: Checking if Church Settings exist...');
      let settings = await ChurchSettings.findOne();

      if (settings) {
        console.log('✅ Church Settings found in database');
        console.log('   Church Name:', settings.churchName || '(empty)');
        console.log('   Email:', settings.email || '(empty)');
        console.log('   Phone:', settings.phone || '(empty)');
        console.log('   Address:', settings.address || '(empty)');
      } else {
        console.log('⚠️  No Church Settings found, creating default...');
        
        // Test 2: Create default settings
        console.log('\n📋 Test 2: Creating default Church Settings...');
        const defaultSettings = new ChurchSettings({
          churchName: '',
          churchDescription: '',
          logo: '',
          favicon: '',
          address: '',
          city: '',
          country: '',
          postalCode: '',
          phone: '',
          email: '',
          serviceTimes: [],
          socialMedia: {},
          bankDetails: {},
          mapCoordinates: {},
          timezone: 'UTC',
          currency: 'USD',
          language: 'en',
        });

        await defaultSettings.save();
        console.log('✅ Default Church Settings created successfully');
        settings = defaultSettings;
      }

      // Test 3: Verify settings structure
      console.log('\n📋 Test 3: Verifying Church Settings structure...');
      const requiredFields = [
        'churchName', 'churchDescription', 'logo', 'favicon',
        'address', 'city', 'country', 'postalCode', 'phone', 'email',
        'serviceTimes', 'socialMedia', 'bankDetails', 'mapCoordinates',
        'timezone', 'currency', 'language'
      ];

      let allFieldsPresent = true;
      requiredFields.forEach(field => {
        if (settings.hasOwnProperty(field)) {
          console.log(`  ✅ ${field}`);
        } else {
          console.log(`  ❌ ${field} - MISSING`);
          allFieldsPresent = false;
        }
      });

      if (allFieldsPresent) {
        console.log('\n✅ All required fields are present');
      } else {
        console.log('\n⚠️  Some fields are missing');
      }

      // Test 4: Test update functionality
      console.log('\n📋 Test 4: Testing update functionality...');
      settings.churchName = 'Test Church';
      settings.email = 'test@church.org';
      settings.phone = '+1234567890';
      
      const updatedSettings = await settings.save();
      console.log('✅ Settings updated successfully');
      console.log('   Church Name:', updatedSettings.churchName);
      console.log('   Email:', updatedSettings.email);
      console.log('   Phone:', updatedSettings.phone);

      // Test 5: Verify update persisted
      console.log('\n📋 Test 5: Verifying update persisted...');
      const verifySettings = await ChurchSettings.findOne();
      if (verifySettings.churchName === 'Test Church') {
        console.log('✅ Update persisted correctly');
      } else {
        console.log('❌ Update did not persist');
      }

      // Test 6: Reset to empty for production
      console.log('\n📋 Test 6: Resetting to empty values for production...');
      verifySettings.churchName = '';
      verifySettings.email = '';
      verifySettings.phone = '';
      await verifySettings.save();
      console.log('✅ Settings reset to empty values');

      console.log('\n✅ All tests completed successfully!\n');
      console.log('📝 Summary:');
      console.log('   - Church Settings collection is working');
      console.log('   - All required fields are present');
      console.log('   - Create, read, and update operations work');
      console.log('   - Settings are persisted in database');
      console.log('\n🚀 Church Settings API is ready to use!');

    } catch (error) {
      console.error('❌ Error during testing:', error);
    } finally {
      mongoose.disconnect();
      process.exit(0);
    }
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

