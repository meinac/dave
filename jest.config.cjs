module.exports = {
  testMatch: [
    "**/spec/**/*.[jt]s?(x)",
    "**/?(*.)+(spec|test).[jt]s?(x)"
  ],
  transform: {
    '^.+\\.js$': 'babel-jest',
  }
};
