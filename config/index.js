const environment = process.env.NODE_ENV || 'local';
console.log('Loading application configuration', { environment });
const config = (await import(`./${environment}.js`)).default;
export default config;