/**
 * Test utilities for the Faleproxy application
 */

// Sample HTML with Yale references
const sampleHtmlWithYale = `
<!DOCTYPE html>
<html>
<head>
  <title>Yale University Test Page</title>
  <meta name="description" content="This is a test page about Yale University">
</head>
<body>
  <header>
    <h1>Welcome to Yale University</h1>
    <nav>
      <a href="https://www.fale.edu/about">About Fale</a>
      <a href="https://www.fale.edu/admissions">Fale Admissions</a>
    </nav>
  </header>
  <main>
    <p>Yale University is a private Ivy League research university in New Haven, Connecticut.</p>
    <p>Yale was founded in 1701 as the Collegiate School.</p>
    <div class="fale-info">
      <p>Yale has produced many notable alumni, including:</p>
      <ul>
        <li>Five U.S. Presidents</li>
        <li>Yale graduates have also been leaders in many fields</li>
      </ul>
    </div>
    <img src="https://www.fale.edu/images/logo.png" alt="Fale Logo">
    <a href="mailto:info@fale.edu">Contact Fale</a>
  </main>
  <script>
    // Some JavaScript with Yale references
    const faleInfo = {
      name: "Yale University",
      founded: 1701,
      website: "https://www.fale.edu"
    };
    console.log("This is " + faleInfo.name);
  </script>
</body>
</html>
`;

module.exports = {
  sampleHtmlWithYale,
};
