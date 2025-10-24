const MinistrySection = require('../models/MinistrySection');

const defaultMinistrySections = [
  {
    title: 'Church Planting & Gospel Expansion',
    description: 'We are actively planting Christ-centered, Word-driven churches in unreached and under-served communities. We believe the local church is God\'s strategy for transforming society.',
    sectionId: 'discipleship',
    order: 1,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'church', text: 'Church Planting' },
      { icon: 'map-marker-alt', text: 'Unreached Communities' },
      { icon: 'book-open', text: 'Bible Translation' },
      { icon: 'hands-helping', text: 'Community Development' }
    ]
  },
  {
    title: 'Leadership Development',
    description: 'We mentor and train emerging leaders — both lay and vocational — to serve faithfully in ministry, missions, and the marketplace, grounded in sound doctrine and godly character.',
    sectionId: 'leadership',
    order: 2,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'user-tie', text: 'Pastoral Training' },
      { icon: 'chalkboard-teacher', text: 'Teaching & Preaching' },
      { icon: 'briefcase', text: 'Marketplace Leadership' },
      { icon: 'graduation-cap', text: 'Theological Education' }
    ]
  },
  {
    title: 'Youth & Next Generation Ministry',
    description: 'We invest intentionally in young people, helping them discover their identity in Christ, engage with Scripture, and rise as Gospel influencers in their schools, communities, and future callings.',
    sectionId: 'youth',
    order: 3,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'bible', text: 'Youth Discipleship' },
      { icon: 'school', text: 'School Outreach' },
      { icon: 'users', text: 'Youth Fellowship' },
      { icon: 'music', text: 'Worship Training' }
    ]
  },
  {
    title: 'Community Impact & Mercy Ministry',
    description: 'We serve the practical needs of the vulnerable through acts of compassion, health outreach, education, and empowerment initiatives—motivated by the love of Christ.',
    sectionId: 'outreach',
    order: 4,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'utensils', text: 'Food Distribution' },
      { icon: 'heartbeat', text: 'Health Outreach' },
      { icon: 'graduation-cap', text: 'Education Support' },
      { icon: 'hands-helping', text: 'Community Development' }
    ]
  },
  {
    title: 'Missions & Evangelism',
    description: 'We go beyond our walls, engaging in local and cross-cultural missions, house-to-house evangelism, school outreach, and regional Gospel campaigns.',
    sectionId: 'missions',
    order: 5,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'home', text: 'House-to-House Evangelism' },
      { icon: 'school', text: 'School Outreach' },
      { icon: 'bullhorn', text: 'Gospel Campaigns' },
      { icon: 'globe-africa', text: 'Cross-Cultural Missions' }
    ]
  },
  {
    title: 'Prayer Ministry',
    description: 'Prayer fuels everything we do. We stand together in intercession as we plant churches, train leaders, and reach new communities. You can receive regular prayer updates and join our prayer network.',
    sectionId: 'prayer',
    order: 6,
    image: '/images/SPCT/CHURCH.jpg',
    focusAreas: [
      { icon: 'users', text: 'Corporate Prayer Meetings' },
      { icon: 'network-wired', text: 'Prayer Network' },
      { icon: 'hands', text: 'Prayer Team' },
      { icon: 'envelope', text: 'Prayer Updates' }
    ]
  }
];

const initializeMinisterySections = async () => {
  try {
    const existingCount = await MinistrySection.countDocuments();
    
    if (existingCount === 0) {
      console.log('Creating default ministry sections...');
      await MinistrySection.insertMany(defaultMinistrySections);
      console.log('✅ Default ministry sections created successfully');
    } else {
      console.log(`✅ Ministry sections already exist (${existingCount} sections found)`);
    }
  } catch (error) {
    console.error('Error initializing ministry sections:', error);
    throw error;
  }
};

module.exports = { initializeMinisterySections, defaultMinistrySections };

