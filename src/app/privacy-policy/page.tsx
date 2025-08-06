
export default function PrivacyPolicyPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>
        <p className="lead">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>Welcome to Aether</h2>
        <p>
          Aether Ecosystem ("Aether," "we," "us," or "our") is a digital-first architecture and design school creating new futures for African creatives. We are powered by Buildr Africa. This Privacy Policy explains how we collect, use, and protect your personal information when you use our website (the "Site").
        </p>
        <p>
          By using our Site and submitting your information, you agree to the terms of this Privacy Policy.
        </p>

        <h2>1. Information We Collect</h2>
        <p>
          When you apply to join the Aether Ecosystem, we collect the following information through our form:
        </p>
        <ul>
          <li>Full Name</li>
          <li>Email Address</li>
          <li>Age Range</li>
          <li>City & Country</li>
          <li>Your current role (e.g., Student, Graduate, Professional)</li>
          <li>Your main interests (e.g., Courses, Studio, Community)</li>
          <li>Preferred community platform (e.g., Discord, WhatsApp)</li>
          <li>Social Media Handle (optional)</li>
          <li>Your reason for joining Aether</li>
          <li>Referral Code (optional)</li>
        </ul>

        <h2>2. How We Use Your Information</h2>
        <p>
          We use the information you provide for the following purposes:
        </p>
        <ul>
          <li><strong>To Generate Your Aether ID:</strong> To create your unique identifier for accessing our ecosystem.</li>
          <li><strong>To Communicate With You:</strong> To send you a welcome email and provide information about getting started.</li>
          <li><strong>For Internal Insights:</strong> To understand who is joining our community, what they are interested in, and how we can better serve them. This helps us improve our programs and offerings.</li>
        </ul>

        <h2>3. Data Storage and Processing</h2>
        <p>
          Your personal data is stored securely in Airtable, a third-party database service. We may also use services like Zapier to automate workflows related to your data, such as sending welcome emails. We do not store your data on our own servers.
        </p>

        <h2>4. Data Sharing and Third Parties</h2>
        <p>
          We respect your privacy. We do not sell, trade, or rent your personal information to others. Your data is only shared with trusted third-party services that help us operate our website and community, such as:
        </p>
        <ul>
          <li><strong>Airtable:</strong> For data storage.</li>
          <li><strong>Zapier:</strong> For data processing and automation.</li>
          <li><strong>Google Analytics:</strong> To analyze website traffic and user behavior (see our Cookie section below).</li>
        </ul>
        <p>
          Our Site contains links to third-party community platforms like Discord, WhatsApp, and Telegram, and social media sites like Instagram, X (Twitter), and Facebook. This Privacy Policy does not cover the privacy practices of those third-party sites. We encourage you to read their privacy policies.
        </p>

        <h2>5. Your Data Rights (GDPR)</h2>
        <p>
          Even though we are based in Nigeria, we respect global privacy standards like the GDPR. You have the right to:
        </p>
        <ul>
          <li><strong>Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Correction:</strong> Request that we correct any inaccurate or incomplete data.</li>
          <li><strong>Deletion:</strong> Request that we delete your personal data from our records.</li>
        </ul>
        <p>
          To exercise any of these rights, please contact us through our <a href="/contact">Contact Page</a>. We will respond to your request within a reasonable timeframe.
        </p>

        <h2>6. Cookies and Analytics</h2>
        <p>
          We use cookies for one main purpose: to understand how visitors use our website. We use Google Analytics to collect anonymous data about page views, traffic sources, and user interactions. This helps us improve the user experience. We do not use cookies for advertising or tracking you across other websites.
        </p>

        <h2>7. Data Security</h2>
        <p>
          We take reasonable measures to protect your information by using trusted third-party services with strong security practices. However, no method of transmission over the Internet or electronic storage is 100% secure.
        </p>

        <h2>8. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the "Last Updated" date.
        </p>

        <h2>9. Contact Us</h2>
        <p>
          If you have any questions about this Privacy Policy, please <a href="/contact">contact us</a>.
        </p>
      </div>
    </main>
  );
}
