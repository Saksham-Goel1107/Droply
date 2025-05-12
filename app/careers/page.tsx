import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Careers | Droply',
  description: 'Join our team and help build the future of file sharing',
}

const positions = [
  {
    title: 'Senior Full Stack Developer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Product Designer',
    department: 'Design',
    location: 'San Francisco, CA',
    type: 'Full-time',
  },
  {
    title: 'DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
  },
  {
    title: 'Marketing Manager',
    department: 'Marketing',
    location: 'New York, NY',
    type: 'Full-time',
  },
]

const benefits = [
  {
    title: 'Competitive Salary',
    description: 'We offer top-market compensation packages.',
  },
  {
    title: 'Health Insurance',
    description: 'Comprehensive medical, dental, and vision coverage.',
  },
  {
    title: 'Remote Work',
    description: 'Work from anywhere in the world.',
  },
  {
    title: 'Learning Budget',
    description: 'Annual budget for courses and conferences.',
  },
  {
    title: 'Flexible Hours',
    description: "Work when you're most productive."
  },
  {
    title: 'Paid Time Off',
    description: 'Generous vacation policy and paid holidays.',
  },
]

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-indigo-700 text-white py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold mb-4">Join Our Team</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
            Help us build the future of file sharing and make collaboration easier for everyone.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Values Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Innovation</h3>
              <p className="text-gray-600">
                We constantly push boundaries and embrace new technologies to solve complex problems.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Collaboration</h3>
              <p className="text-gray-600">
                We believe great ideas come from working together and sharing knowledge.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Impact</h3>
              <p className="text-gray-600">
                We're committed to making a positive difference in how people work and share.
              </p>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Benefits & Perks</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit) => (
              <div key={benefit.title} className="bg-white p-6 rounded-lg shadow">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Open Positions Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Open Positions</h2>
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="divide-y divide-gray-200">
              {positions.map((position) => (
                <div key={position.title} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-1">
                        {position.title}
                      </h3>
                      <div className="text-gray-500 space-x-4">
                        <span>{position.department}</span>
                        <span>•</span>
                        <span>{position.location}</span>
                        <span>•</span>
                        <span>{position.type}</span>
                      </div>
                    </div>
                    <button className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
                      Apply Now
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Don't see the right position?</h2>
          <p className="text-gray-600 mb-6">
            We're always looking for talented individuals to join our team. Send us your resume and
            we'll keep it on file for future opportunities.
          </p>
          <a
            href="mailto:careers@droply.com"
            className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md hover:bg-indigo-700"
          >
            Contact Us
          </a>
        </div>
      </div>
    </div>
  )
}
