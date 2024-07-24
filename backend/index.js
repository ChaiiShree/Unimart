import express from 'express';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
const corsOptions = {
  origin: ['https://uniipal-frontend.vercel.app', 'http://localhost:5173', 'http://localhost:5000','https://uniipal.vercel.app'],
  optionsSuccessStatus: 200 // Some legacy browsers (IE11, various SmartTVs) choke on 204
};

app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '5mb' }));
app.use(bodyParser.urlencoded({ extended: true }));

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('Failed to connect to MongoDB:', err));

// Subscription Schema
const subscriptionSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
});

const Subscription = mongoose.model('Subscription', subscriptionSchema);

// Product Schema
const productSchema = new mongoose.Schema({
  uid: { type: String, required: true },
  sellerName: String,
  productName: String,
  category: String,
  description: String,
  price: Number,
  images: [String], // Array of image strings
  hostel: String,
  quantity: Number,
  telegramUsername: String,
  whatsappNumber: String, // New field for WhatsApp number
});

const Product = mongoose.model('Product', productSchema);

// Wishlist Schema
const wishlistSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  productName: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: [String], // Array of image strings
  hostel: { type: String, required: true },
  telegramUsername: String,
  whatsappNumber: String, // New field for WhatsApp number
});

wishlistSchema.index({ userId: 1, productName: 1 }, { unique: true });

const Wishlist = mongoose.model('Wishlist', wishlistSchema);

// User Schema
const userSchema = new mongoose.Schema({
  uid: { type: String, required: true, unique: true },
  name: { type: String },
  email: { type: String },
  rollNumber: { type: String },
  branch: { type: String },
  passingOutYear: { type: Number },
});

const User = mongoose.model('User', userSchema);

// Routes

// Subscription Route
app.post('/api/subscribe', async (req, res) => {
  const { email } = req.body;

  try {
    const existingSubscription = await Subscription.findOne({ email });
    if (existingSubscription) {
      return res.status(400).json({ message: 'This email is already subscribed' });
    }

    const newSubscription = new Subscription({ email });
    await newSubscription.save();
    res.status(201).json({ message: 'Subscription successful' });
  } catch (error) {
    console.error('Error subscribing:', error);
    res.status(500).json({ message: `Error subscribing: ${error.message}` });
  }
});

// Products Route
app.get('/api/products', async (req, res) => {
  try {
    const products = await Product.find({});
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({ message: `Error fetching products: ${error.message}` });
  }
});

app.post('/api/products', async (req, res) => {
  try {
    const { uid, sellerName, productName, category, description, price, images, hostel, quantity, telegramUsername, whatsappNumber} = req.body;

    const newProduct = new Product({ uid, sellerName, productName, category, description, price, images, hostel, quantity, telegramUsername, whatsappNumber});
    await newProduct.save();
    res.status(201).json({ message: 'Product added successfully' });
  } catch (error) {
    console.error('Error adding product:', error);
    res.status(500).json({ message: `Error adding product: ${error.message}` });
  }
});

// Delete product by ID
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Find the product to be deleted
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Remove the product from Product collection
    await product.remove();

    // Remove the product from Wishlist collection
    await Wishlist.deleteMany({ productName: product.productName });

    res.status(200).json({ message: 'Product removed successfully' });
  } catch (error) {
    console.error('Error removing product:', error);
    res.status(500).json({ message: `Error removing product: ${error.message}` });
  }
});

// Wishlist Routes
app.post('/api/wishlist/add', async (req, res) => {
  try {
    const { userId, productName, description, price, images, hostel, telegramUsername, whatsappNumber } = req.body;

    // Check if the product already exists in the wishlist
    const existingItem = await Wishlist.findOne({ userId, productName });
    if (existingItem) {
      return res.status(400).json({ message: 'Product already in wishlist' });
    }

    const newWishlistItem = new Wishlist({ userId, productName, description, price, images, hostel, telegramUsername, whatsappNumber});
    await newWishlistItem.save();
    res.status(201).json(newWishlistItem);
  } catch (error) {
    console.error('Error adding product to wishlist:', error);
    res.status(500).json({ message: `Error adding product to wishlist: ${error.message}` });
  }
});

app.delete('/api/wishlist/remove/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await Wishlist.findByIdAndRemove(id);
    res.status(200).json({ message: 'Product removed from wishlist' });
  } catch (error) {
    console.error('Error removing product from wishlist:', error);
    res.status(500).json({ message: `Error removing product from wishlist: ${error.message}` });
  }
});

app.get('/api/wishlist/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const wishlist = await Wishlist.find({ userId });
    res.status(200).json(wishlist);
  } catch (error) {
    console.error('Error fetching wishlist:', error);
    res.status(500).json({ message: `Error fetching wishlist: ${error.message}` });
  }
});

// Get user by UID
app.get('/api/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    let user = await User.findOne({ uid });

    if (!user) {
      // If user doesn't exist, create a new user entry
      const newUser = new User({ uid });
      await newUser.save();
      user = newUser; // Set user to the newly created user
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching/creating user:', error);
    res.status(500).json({ message: `Error fetching/creating user: ${error.message}` });
  }
});

// Update user details
app.put('/api/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const { name, email, rollNumber, branch, passingOutYear } = req.body;

    let user = await User.findOne({ uid });

    if (!user) {
      // If user doesn't exist, create a new user entry
      const newUser = new User({ uid, name, email, rollNumber, branch, passingOutYear });
      await newUser.save();
      user = newUser; // Set user to the newly created user
    } else {
      // Update existing user details
      user.name = name;
      user.email = email;
      user.rollNumber = rollNumber;
      user.branch = branch;
      user.passingOutYear = passingOutYear;
      await user.save();
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error updating user details:', error);
    res.status(500).json({ message: `Error updating user details: ${error.message}` });
  }
});

// Fetch products by user UID
app.get('/api/products/user/:uid', async (req, res) => {
  try {
    const { uid } = req.params;
    const products = await Product.find({ uid });
    res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching user products:', error);
    res.status(500).json({ message: `Error fetching user products: ${error.message}` });
  }
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));