// server.ts
import express, { Request, Response } from 'express';
import mongoose, { Document, Schema } from 'mongoose';
import cors from 'cors';
import bcrypt from 'bcryptjs';
import Interview from './src/models/Interview'; // Import the Interview model

const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());
const uri = 'mongodb+srv://dineshjnld00:Tw6w976EqRLRIWsE@cluster0.hz3aj77.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
// Connect to MongoDB
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
} as any);

// Define User schema
const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Method to compare passwords
userSchema.methods.comparePassword = async function (enteredPassword: string) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Create User model
const User = mongoose.model<UserDocument>('User', userSchema);

interface UserDocument extends Document {
  email: string;
  password: string;
  comparePassword(enteredPassword: string): Promise<boolean>;
}

// Middleware to verify JWT token
function verifyToken(req:any, res:any, next:any) {
  // Get token from request header
  const token = req.headers['authorization'];

  // Check if token is present
  if (!token) {
    return res.status(401).json({ message: 'Access denied. No token provided' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token,'MYKEY');

    // Attach decoded payload to request object
    req.user = decoded;

    // Call next middleware or route handler
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({ message: 'Invalid token' });
  }
} 


// Routes
app.post('/api/signup', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
app.get('/protected',verifyToken,(req,res)=>{
  res.status(200).json({message:"protected"})
})
app.post('/api/signin', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sign JWT token
    const token = jwt.sign({ userId: user._id },'MYKEY', { expiresIn: '1h' });

    // Send token in response
    res.status(200).json({ message: 'Sign in successful', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


app.post('/api/interviews', async (req, res) => {
  try {
    const { name, status, feedback, rating } = req.body;

    // Validate input
    if (!name || !status || !feedback || isNaN(rating) || rating < 0 || rating > 5) {
      return res.status(400).json({ message: 'Invalid input data' });
    }

    // Create new interview document
    const newInterview = new Interview({
      name,
      status,
      feedback,
      rating,
    });

    // Save the interview to the database
    await newInterview.save();

    res.status(201).json({ message: 'Interview details stored successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.get('/api/interviews', verifyToken , async (req:any, res) => {
  try {
    const userId = req.user._id;
    // Find all interviews associated with the user
    const interviews = await Interview.find({ userId });
    res.status(200).json({ interviews });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update interview
app.put('/api/interviews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { name, status, feedback, rating } = req.body;

    // Check if interview exists
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Update interview fields
    interview.name = name || interview.name;
    interview.status = status || interview.status;
    interview.feedback = feedback || interview.feedback;
    interview.rating = rating || interview.rating;

    // Save the updated interview
    await interview.save();

    res.status(200).json({ message: 'Interview updated successfully', interview });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Delete interview
app.delete('/api/interviews/:id', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;

    // Check if interview exists
    const interview = await Interview.findById(id);
    if (!interview) {
      return res.status(404).json({ message: 'Interview not found' });
    }

    // Delete the interview
    await Interview.deleteOne({ _id: id });

    res.status(200).json({ message: 'Interview deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});




// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
