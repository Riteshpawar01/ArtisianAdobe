require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product');
const connectDB = require('../config/db');

// Reuse generation logic from mockData
const adjectives = ['Authentic', 'Traditional', 'Handcrafted', 'Ethnic', 'Desi', 'Vintage', 'Artisan', 'Royal', 'Rustic', 'Cultural'];
const nounsArt = ['Madhubani Painting', 'Warli Canvas', 'Pattachitra Art', 'Tanjore Painting', 'Rajasthani Miniature'];
const nounsClocks = ['Wooden Carved Clock', 'Brass Antique Clock', 'Meenakari Wall Clock', 'Dokra Art Clock', 'Kundan Work Clock'];
const nounsMirrors = ['Jharokha Mirror', 'Macrame Wall Mirror', 'Bone Inlay Mirror', 'Brass Border Mirror', 'Hand-painted Mirror'];
const nounsTables = ['Sheesham Wood Table', 'Carved Teak Table', 'Mango Wood Coffee Table', 'Inlay Work End Table', 'Brass Embellished Table'];
const nounsPottery = ['Khurja Ceramic Vase', 'Blue Pottery Bowl', 'Terracotta Matka', 'Jaipur Glazed Planter', 'Kutch Mud Work Jug'];

const subCategories = {
  'wall-art': ['Madhubani', 'Warli', 'Tanjore', 'Miniature Paintings', 'Folk Art'],
  'wall-clocks': ['Wooden Clocks', 'Brass Clocks', 'Ethnic Clocks'],
  'mirrors': ['Jharokha Style', 'Inlay Mirrors', 'Hand-painted Mirrors'],
  'tables': ['Sheesham Wood', 'Teak Wood', 'Mango Wood', 'Inlay Tables'],
  'pots-pottery': ['Blue Pottery', 'Terracotta', 'Khurja Ceramics', 'Kutch Mud Work']
};

const generateSeedProducts = (numPerSection = 20) => { // 20 per section = 100 total
  const sections = [
    { id: 'wall-art', list: nounsArt },
    { id: 'wall-clocks', list: nounsClocks },
    { id: 'mirrors', list: nounsMirrors },
    { id: 'tables', list: nounsTables },
    { id: 'pots-pottery', list: nounsPottery }
  ];

  const products = [];
  let globalId = 1;

  sections.forEach((sec) => {
    for (let i = 0; i < numPerSection; i++) {
      const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
      const noun = sec.list[Math.floor(Math.random() * sec.list.length)];
      
      const originalPrice = Math.floor(Math.random() * 2500) + 500;
      const salePrice = Math.floor(originalPrice * (0.6 + (Math.random() * 0.3)));
      
      const subCats = subCategories[sec.id];
      const assignedCat = subCats[Math.floor(Math.random() * subCats.length)];

      let keyword = 'art';
      if (sec.id === 'wall-art') keyword = 'traditional,painting';
      if (sec.id === 'wall-clocks') keyword = 'antique,clock';
      if (sec.id === 'mirrors') keyword = 'ornate,mirror';
      if (sec.id === 'tables') keyword = 'wooden,table';
      if (sec.id === 'pots-pottery') keyword = 'clay,pottery';

      const uniqueImage = `https://loremflickr.com/600/600/${keyword}/all?lock=${globalId}`;

      products.push({
        name: `${adj} ${noun} ${i + 1}`,
        slug: `${adj}-${noun}-${i + 1}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, ''),
        description: 'Handcrafted by expert artisans using generational techniques, this piece adds a timeless elegance to any environment. Each detail has been carefully shaped to ensure it stands as a centerpiece of authentic artistry in your home.',
        price: Number(salePrice.toFixed(2)),
        compareAtPrice: Number(originalPrice.toFixed(2)),
        category: sec.id, // e.g. 'wall-art'
        subcategory: assignedCat,
        images: [{ url: uniqueImage, isPrimary: true }],
        artisan: {
          name: 'Local Artisan Co.',
        },
        inventory: {
          stock: Math.floor(Math.random() * 50) + 5
        }
      });
      globalId++;
    }
  });

  return products;
};

const seedDB = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products...');
    await Product.deleteMany();
    
    console.log('Generating seed data...');
    const products = generateSeedProducts(20);
    
    console.log('Inserting products into database...');
    await Product.insertMany(products);
    
    console.log('Database seeded successfully with 100 products!');
    process.exit();
  } catch (err) {
    console.error('Error seeding database:', err);
    process.exit(1);
  }
};

seedDB();
