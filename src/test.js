console.log('🧪 Test.js loading...');

const root = document.getElementById("root");
if (root) {
  console.log('✅ Root found in test.js');
  root.innerHTML = '<h1 style="color: green; text-align: center; padding: 50px;">JavaScript module loading works!</h1>';
} else {
  console.error('❌ Root not found in test.js');
}
