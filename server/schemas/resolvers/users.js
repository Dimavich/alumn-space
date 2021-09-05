const User = require('../../models/User');
const { signToken } = require('../../utils/auth');

module.exports = {
    Query: {
    users: async () => {
      return User.find();
    },
    user: async (_, args) => {
      return User.findById(args.id);
    },
  },
  Mutation: {
    addUser: async (_, {registerInput: { username, email, password, yearOfGraduation, className }}) => {
      const user = await User.create({ username, email, password, yearOfGraduation, className });
      const token = signToken(user);
      return { token, user };
    },
    login: async (_, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError('No user found with this email address');
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError('Incorrect credentials');
      }

      const token = signToken(user);

      return { token, user };
    },
    }    
};