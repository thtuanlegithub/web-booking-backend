// stryker.conf.js
module.exports = {
  mutate: ['src/**/*.js',
    '!src/seeders/*.js',
    '!src/migrations/*.js',
    '!src/models/*.js'], // Thư mục chứa mã nguồn của bạn
  mutator: 'javascript',
  testRunner: 'jest',
  reporters: ['progress', 'clear-text', 'html'], // Các báo cáo bạn muốn sử dụng
  jest: {
    projectType: 'custom',
    configFile: './jest.config.js', // Đường dẫn đến file Jest config của bạn
  },
}
