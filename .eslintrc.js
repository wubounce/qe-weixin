module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es6: true
  },
  // extends: ['plugin:vue/essential', '@vue/prettier'],
  // extends: ['plugin:vue/recommended', 'eslint:recommended'],
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'vue/no-use-v-if-with-v-for': ['off'],
    'vue/component-name-in-template-casing': ['off'],
    'vue/no-unused-components': ['off'],
    'no-unused-vars': [
      'error',
      {
        // 允许声明未使用变量
        vars: 'local',
        // 参数不检查
        args: 'none'
      }
    ],
    'vue/valid-v-model': 'off',
    'vue/no-use-v-if-with-v-for': 'off',
    'no-useless-escape': 'off'
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module'
  }
};
