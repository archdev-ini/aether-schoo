
export default function PrivacyPolicyPage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1>Privacy Policy</h1>
        <p className="lead">Effective Date: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        <p>Built by Buildr Africa</p>

        <p>
         At Aether, your privacy matters. We're committed to protecting your data while you explore and grow within our creative ecosystem for architects and designers.
        </p>
        
        <h2>1. What We Collect</h2>
        <p>
          When you join the Aether Ecosystem, we may collect:
        </p>
        <ul>
          <li>Your full name</li>
          <li>Email address</li>
          <li>City or location</li>
          <li>Area of interest (e.g., Aether School, Horizon Studio, Community)</li>
          <li>Social handles (optional)</li>
          <li>Referral or how you heard about us</li>
        </ul>
        <p>This data is collected via a form on our website and securely stored using Airtable, with automation handled by Zapier.</p>

        <h2>2. How We Use Your Data</h2>
        <p>
          We use your data to:
        </p>
        <ul>
            <li>Generate your Aether ID</li>
            <li>Send you a welcome email and onboarding content</li>
            <li>Invite you to join our communities (e.g., Discord, WhatsApp, Telegram)</li>
            <li>Understand who’s joining and how to serve you better (internal analytics)</li>
        </ul>
        <p>We do not sell or share your data with third parties for marketing purposes.</p>

        <h2>3. Cookies & Tracking</h2>
        <p>
          We use basic cookies through Google Analytics to understand how visitors interact with our website and improve performance.
        </p>

        <h2>4. Your Rights</h2>
        <p>
          You can request:
        </p>
        <ul>
          <li>Access to your data</li>
          <li>Correction or deletion</li>
          <li>Removal from our contact list</li>
        </ul>
        <p>
          To request changes or deletion, please <a href="/contact">contact us</a>.
        </p>
      </div>
    </main>
  );
}
