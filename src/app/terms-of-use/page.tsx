
export default function TermsOfUsePage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1>Terms of Use</h1>
        <p className="lead">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <p>Welcome to Aether — a digital space for future-shaping architects. By using our website or joining our ecosystem, you agree to the following terms:</p>

        <h2>1. Respect the Ecosystem</h2>
        <p>
         We’re building a positive and inclusive learning environment. By joining our communities, you agree to:
        </p>
        <ul>
          <li>Be respectful, collaborative, and constructive</li>
          <li>Not post harmful, hateful, or misleading content</li>
          <li>Abide by the rules of each community platform (e.g., Discord or WhatsApp)</li>
        </ul>

        <h2>2. Intellectual Property</h2>
        <p>
         All content on this website (unless otherwise stated) — including branding, course content, visuals, and language — is the property of Aether and Buildr Africa.
        </p>
        <p>Do not copy, reproduce, or use our materials commercially without permission.</p>
        
        <h2>3. Ecosystem Access</h2>
        <p>
          Access to the ecosystem does not guarantee participation in every feature (e.g., Horizon Studio is application-based). We reserve the right to modify access levels, programs, or remove users violating guidelines.
        </p>

        <h2>4. Liability</h2>
        <p>
          While we strive to provide accurate and helpful content, Aether is not liable for decisions or actions taken based on our website or communications.
        </p>
      </div>
    </main>
  );
}
