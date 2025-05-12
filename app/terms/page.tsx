import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms & Conditions | Droply',
  description: 'Terms and conditions for using Droply file sharing service',
}

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
              <p>
                By accessing and using Droply ("the Service"), you accept and agree to be bound by the terms
                and provision of this agreement.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Use License</h2>
              <p>
                Permission is granted to temporarily download one copy of the materials (information or software)
                on Droply for personal, non-commercial transitory viewing only.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Account</h2>
              <p>
                To use certain features of the Service, you must register for an account. You must provide
                accurate and complete information and keep your account information updated.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Privacy Policy</h2>
              <p>
                Your use of Droply is also governed by our Privacy Policy. Please review our Privacy Policy,
                which also governs the Site and informs users of our data collection practices.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">5. File Sharing Rules</h2>
              <p>
                Users are responsible for all files they upload and share through the Service. Prohibited
                content includes but is not limited to: illegal content, malware, and copyrighted material
                without proper authorization.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Termination</h2>
              <p>
                We may terminate or suspend your account and bar access to the Service immediately, without
                prior notice or liability, under our sole discretion, for any reason whatsoever.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Limitations</h2>
              <p>
                In no event shall Droply or its suppliers be liable for any damages arising out of the use
                or inability to use the materials on Droply's website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Information</h2>
              <p>
                If you have any questions about these Terms, please contact us at support@droply.com.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
