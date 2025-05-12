import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | Droply',
  description: 'Learn about how we use cookies and similar technologies',
}

export default function CookiesPage() {
  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="bg-white p-8 rounded-lg shadow">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Cookie Policy</h1>
          
          <div className="space-y-6 text-gray-600">
            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">What Are Cookies?</h2>
              <p>
                Cookies are small text files that are placed on your computer or mobile device when you
                visit a website. They are widely used to make websites work more efficiently and provide
                information to the website owners.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">How We Use Cookies</h2>
              <p className="mb-4">We use cookies for the following purposes:</p>
              <ul className="list-disc pl-5 space-y-2">
                <li>
                  <strong>Essential cookies:</strong> Required for the website to function properly
                </li>
                <li>
                  <strong>Authentication cookies:</strong> Help us show you the right information and
                  personalize your experience
                </li>
                <li>
                  <strong>Analytics cookies:</strong> Help us understand how visitors interact with our
                  website
                </li>
                <li>
                  <strong>Preference cookies:</strong> Remember your settings and preferences
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Types of Cookies We Use</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium text-gray-900">Strictly Necessary Cookies</h3>
                  <p>Required for core site functionality. Cannot be disabled.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Performance Cookies</h3>
                  <p>Help us improve our website by collecting and reporting information about usage.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Functional Cookies</h3>
                  <p>Enable enhanced functionality and personalization.</p>
                </div>
                
                <div>
                  <h3 className="font-medium text-gray-900">Marketing Cookies</h3>
                  <p>Track you across websites for marketing purposes.</p>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Managing Cookies</h2>
              <p className="mb-4">
                Most web browsers allow you to control cookies through their settings preferences.
                However, limiting cookies may impact your experience using our website.
              </p>
              <p>
                To learn more about cookies and how to manage them, visit:
              </p>
              <ul className="list-disc pl-5 space-y-2 mt-4">
                <li>
                  <a
                    href="https://www.aboutcookies.org/"
                    className="text-indigo-600 hover:text-indigo-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AboutCookies.org
                  </a>
                </li>
                <li>
                  <a
                    href="https://www.allaboutcookies.org/"
                    className="text-indigo-600 hover:text-indigo-500"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    AllAboutCookies.org
                  </a>
                </li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Changes to This Policy</h2>
              <p>
                We may update our Cookie Policy from time to time. We will notify you of any changes by
                posting the new Cookie Policy on this page.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-900 mb-3">Contact Us</h2>
              <p>
                If you have any questions about our Cookie Policy, please contact us at{' '}
                <a href="mailto:sakshamgoel1107@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                  sakshamgoel1107@gmail.com
                </a>
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}
