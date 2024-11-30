const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { buildSchema } = require('graphql');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config(); // Dùng để load biến môi trường từ file .env

const app = express();

// Kết nối MongoDB Atlas
mongoose
  .connect(process.env.URL_MONGO_DB, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Kết nối MongoDB Atlas thành công'))
  .catch((err) => console.error('Lỗi kết nối MongoDB:', err));

// Định nghĩa Schema MongoDB
const UserSchema = new mongoose.Schema({
  username: String,
  description: String,
});

const User = mongoose.model('User', UserSchema);

// Định nghĩa Schema GraphQL
const schema = buildSchema(`
    type User {
        id: ID!
        username: String!
        description: String
    }

    type Query {
        getUser(username: String!): User
    }

    type Mutation {
        addUser(username: String!, description: String): User
        updateDescription(username: String!, description: String!): User
    }
`);

// Định nghĩa Resolver
const root = {
  // Query lấy thông tin user
  getUser: async ({ username }) => {
    return await User.findOne({ username });
  },
  // Mutation thêm user mới
  addUser: async ({ username, description }) => {
    const user = new User({ username, description });
    await user.save();
    return user;
  },
  // Mutation cập nhật mô tả của user
  updateDescription: async ({ username, description }) => {
    const user = await User.findOneAndUpdate(
      { username },
      { description },
      { new: true }
    );
    return user;
  },
};

// Sử dụng middleware CORS
app.use(cors({
  origin: 'http://localhost:3000', // Địa chỉ frontend của bạn
  credentials: true, // Nếu sử dụng cookie hoặc xác thực
}));

// Cấu hình endpoint GraphQL
app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true, // Công cụ UI để test GraphQL
  })
);

// Lắng nghe cổng 4000
app.listen(4000, () => {
  console.log('Server is running on http://localhost:4000/graphql');
});
