// Test script to check blog data
// Run with: node test-blog-fetch.js

const testBlogFetch = async () => {
  try {
    console.log('Testing blog fetch from API...\n');
    
    // Test 1: Fetch all blogs
    const response = await fetch('http://localhost:3000/api/crud/blog/fetch?status=published');
    const data = await response.json();
    
    console.log('API Response:');
    console.log('- Success:', data.success);
    console.log('- Total blogs:', data.data?.length || 0);
    
    if (data.data && data.data.length > 0) {
      console.log('\nFirst blog:');
      console.log('- Title:', data.data[0].blogTitle);
      console.log('- Slug:', data.data[0].blogSlug);
      console.log('- Published:', data.data[0].blogPublished);
      console.log('- Status:', data.data[0].xStaus);
      console.log('- Created:', data.data[0].createdAt);
    } else {
      console.log('\n❌ No published blogs found in database');
      console.log('\nTo add blogs:');
      console.log('1. Go to your admin dashboard');
      console.log('2. Navigate to Blog Management');
      console.log('3. Create a new blog post');
      console.log('4. Make sure to set blogPublished = true and xStaus = "active"');
    }
    
  } catch (error) {
    console.error('Error:', error.message);
    console.log('\nMake sure:');
    console.log('1. Your Next.js app is running (npm run dev)');
    console.log('2. The database connection is working');
    console.log('3. The blog table exists in your database');
  }
};

testBlogFetch();
