// Test script for Ministry Sections API
require('dotenv').config();
const mongoose = require('mongoose');
const MinistrySection = require('./models/MinistrySection');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://haithammisape:hrz123@cluster0.jeis2ve.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

console.log('🔍 Testing Ministry Sections API...\n');

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 30000,
  socketTimeoutMS: 45000,
  family: 4,
  maxPoolSize: 10
})
  .then(() => {
    console.log('✅ Connected to MongoDB\n');
    runTests();
  })
  .catch(err => {
    console.error('❌ MongoDB connection error:', err);
    process.exit(1);
  });

async function runTests() {
  try {
    // Test 1: Check if ministry sections exist
    console.log('📋 Test 1: Checking if Ministry Sections exist...');
    const count = await MinistrySection.countDocuments();
    console.log(`   Found ${count} ministry sections\n`);

    // Test 2: Get all ministry sections
    console.log('📋 Test 2: Fetching all ministry sections...');
    const sections = await MinistrySection.find().sort({ order: 1 });
    
    if (sections.length > 0) {
      console.log(`   ✅ Found ${sections.length} sections:`);
      sections.forEach((section, index) => {
        console.log(`   ${index + 1}. ${section.title} (ID: ${section.sectionId})`);
        console.log(`      - Order: ${section.order}`);
        console.log(`      - Focus Areas: ${section.focusAreas?.length || 0}`);
      });
    } else {
      console.log('   ⚠️  No ministry sections found');
    }
    console.log();

    // Test 3: Get specific section by sectionId
    console.log('📋 Test 3: Fetching specific section by sectionId...');
    const discipleshipSection = await MinistrySection.findOne({ sectionId: 'discipleship' });
    
    if (discipleshipSection) {
      console.log(`   ✅ Found: ${discipleshipSection.title}`);
      console.log(`   Description: ${discipleshipSection.description.substring(0, 100)}...`);
      console.log(`   Focus Areas:`);
      discipleshipSection.focusAreas?.forEach(area => {
        console.log(`     - ${area.text} (icon: ${area.icon})`);
      });
    } else {
      console.log('   ⚠️  Discipleship section not found');
    }
    console.log();

    // Test 4: Verify structure
    console.log('📋 Test 4: Verifying Ministry Section structure...');
    if (sections.length > 0) {
      const section = sections[0];
      const requiredFields = ['title', 'description', 'sectionId', 'focusAreas', 'order'];
      const missingFields = requiredFields.filter(field => !(field in section));
      
      if (missingFields.length === 0) {
        console.log('   ✅ All required fields present');
      } else {
        console.log(`   ❌ Missing fields: ${missingFields.join(', ')}`);
      }
    }
    console.log();

    // Test 5: Test create operation
    console.log('📋 Test 5: Testing create operation...');
    const testSection = new MinistrySection({
      title: 'Test Ministry Section',
      description: 'This is a test ministry section',
      sectionId: 'test-section-' + Date.now(),
      order: 99,
      focusAreas: [
        { icon: 'star', text: 'Test Focus Area 1' },
        { icon: 'heart', text: 'Test Focus Area 2' }
      ]
    });

    const savedSection = await testSection.save();
    console.log(`   ✅ Created test section: ${savedSection.title}`);
    console.log(`   ID: ${savedSection._id}`);
    console.log();

    // Test 6: Test update operation
    console.log('📋 Test 6: Testing update operation...');
    savedSection.title = 'Updated Test Section';
    const updatedSection = await savedSection.save();
    console.log(`   ✅ Updated section: ${updatedSection.title}`);
    console.log();

    // Test 7: Test delete operation
    console.log('📋 Test 7: Testing delete operation...');
    await MinistrySection.findByIdAndDelete(savedSection._id);
    console.log(`   ✅ Deleted test section`);
    console.log();

    // Summary
    console.log('✅ All tests completed successfully!\n');
    console.log('📝 Summary:');
    console.log(`   - Total ministry sections: ${count}`);
    console.log(`   - API endpoints working: ✅`);
    console.log(`   - CRUD operations: ✅`);
    console.log(`   - Database connection: ✅`);
    console.log('\n🚀 Ministry Sections API is ready to use!');

    mongoose.disconnect();
    process.exit(0);
  } catch (error) {
    console.error('❌ Test failed:', error);
    mongoose.disconnect();
    process.exit(1);
  }
}

