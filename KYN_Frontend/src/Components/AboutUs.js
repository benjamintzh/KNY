function AboutUs() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-4">About Us</h2>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p className="text-gray-700 mb-4">
          Know-Your-Neighborhood is a community-focused platform designed to connect residents, share local updates, and foster a sense of belonging.
        </p>
        <h3 className="text-lg font-semibold mb-2">Our Mission</h3>
        <p className="text-gray-700 mb-4">
          To empower communities by providing a secure and user-friendly platform for interaction and information sharing.
        </p>
        <h3 className="text-lg font-semibold mb-2">Our Team</h3>
        <p className="text-gray-700 mb-4">
          We are a group of passionate developers and community advocates working to make neighborhoods more connected.
        </p>
        <h3 className="text-lg font-semibold mb-2">Why Choose Us?</h3>
        <ul className="list-disc list-inside text-gray-700">
          <li>Secure login with Google OAuth2 integration.</li>
          <li>Easy-to-use interface built with modern web technologies.</li>
          <li>Committed to user privacy and data security.</li>
        </ul>
      </div>
    </div>
  );
}

export default AboutUs;