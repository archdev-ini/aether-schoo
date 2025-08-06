
export default function TermsOfUsePage() {
  return (
    <main className="container py-12 md:py-24 animate-in fade-in duration-500">
      <div className="max-w-3xl mx-auto prose prose-lg">
        <h1>Terms of Use</h1>
        <p className="lead">Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>

        <h2>Welcome to Aether</h2>
        <p>
          These Terms of Use ("Terms") govern your access to and use of the Aether Ecosystem website (the "Site"), operated by Buildr Africa. By accessing or using our Site, you agree to be bound by these Terms.
        </p>

        <h2>1. Using Our Site</h2>
        <p>
          Our Site provides information about our educational programs and a way for you to join our community. You agree to use the Site for its intended purpose and in a lawful manner. You are not permitted to:
        </p>
        <ul>
          <li>Disrupt or interfere with the security or accessibility of the Site.</li>
          <li>Use the Site for any illegal or fraudulent purpose.</li>
          <li>Attempt to gain unauthorized access to any part of our systems.</li>
        </ul>

        <h2>2. Aether ID and Community Access</h2>
        <p>
          Upon successful submission of the join form, you will be issued a unique Aether ID. This ID is your key to the ecosystem. Our Site redirects you to third-party community platforms like Discord, WhatsApp, and Telegram. Your participation in these communities is governed by their respective terms of use and community guidelines.
        </p>
        
        <h2>3. Community Standards</h2>
        <p>
          We are building a respectful, collaborative, and professional community. While on third-party platforms associated with Aether, we expect you to:
        </p>
        <ul>
          <li><strong>Be Respectful:</strong> Treat all members with courtesy and respect, even when you disagree. Harassment, hate speech, and bullying will not be tolerated.</li>
          <li><strong>Be Collaborative:</strong> Share knowledge, offer constructive feedback, and contribute positively to discussions.</li>
          <li><strong>Act with Integrity:</strong> Do not share misleading information, spam, or engage in deceptive practices.</li>
        </ul>
        <p>
          Aether reserves the right to revoke access to our communities for members who violate these standards, at our sole discretion.
        </p>
        
        <h2>4. Intellectual Property</h2>
        <p>
          All content on this Site, including text, graphics, logos, and the "Aether" name and brand, are the exclusive property of Buildr Africa and are protected by copyright and other intellectual property laws. You may not use, reproduce, or distribute any content from the Site without our prior written permission.
        </p>
        <p>
          You retain ownership of the intellectual property you create as part of your projects within Aether School or Horizon Studio, subject to any specific agreements for those programs.
        </p>
        
        <h2>5. Disclaimers and Limitation of Liability</h2>
        <p>
          The Site and its content are provided "as is" without any warranties, express or implied. While we strive to provide accurate information, we do not guarantee its completeness or correctness.
        </p>
        <p>
          To the fullest extent permitted by law, Aether and Buildr Africa shall not be liable for any indirect, incidental, or consequential damages arising out of your use of the Site or participation in our communities.
        </p>
        
        <h2>6. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria, without regard to its conflict of law principles.
        </p>

        <h2>7. Changes to These Terms</h2>
        <p>
          We may revise these Terms of Use at any time. The "Last Updated" date at the top of this page indicates the latest revision. Your continued use of the Site after any changes constitutes your acceptance of the new Terms.
        </p>

        <h2>8. Contact Us</h2>
        <p>
          If you have any questions about these Terms, please <a href="/contact">contact us</a>.
        </p>
      </div>
    </main>
  );
}
