import type { Metadata } from 'next'
import Image from 'next/image'
import { FaCloud, FaLock, FaUserFriends } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'About Us | Droply',
  description: 'Learn more about Droply and our mission to make file sharing simple and secure',
}

const features = [
  {
    name: 'Cloud Storage',
    description: 'Store your files securely in the cloud with enterprise-grade encryption.',
    icon: FaCloud,
  },
  {
    name: 'Security First',
    description: 'Your privacy and security are our top priorities with end-to-end encryption.',
    icon: FaLock,
  },
  {
    name: 'Collaboration',
    description: 'Share files easily with teammates, clients, or friends.',
    icon: FaUserFriends,
  },
]

const team = [
  {
    name: 'Jane Smith',
    role: 'CEO & Founder',
    image: '/team/jane-smith.jpg',
  },
  {
    name: 'John Doe',
    role: 'CTO',
    image: '/team/john-doe.jpg',
  },
  {
    name: 'Sarah Johnson',
    role: 'Head of Design',
    image: '/team/sarah-johnson.jpg',
  },
]

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <div className="relative bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
              About Droply
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
              We're on a mission to make file sharing simple, secure, and accessible to everyone. Our platform
              combines powerful features with an intuitive interface.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-lg font-semibold text-indigo-600">Features</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              A better way to share files
            </p>
          </div>

          <div className="mt-10">
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => (
                <div key={feature.name} className="pt-6">
                  <div className="flow-root rounded-lg bg-gray-50 px-6 pb-8">
                    <div className="-mt-6">
                      <div>
                        <span className="inline-flex items-center justify-center rounded-md bg-indigo-500 p-3 shadow-lg">
                          <span className="h-6 w-6 text-white">
                            <feature.icon aria-hidden="true" />
                          </span>
                        </span>
                      </div>
                      <h3 className="mt-8 text-lg font-medium tracking-tight text-gray-900">
                        {feature.name}
                      </h3>
                      <p className="mt-5 text-base text-gray-500">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-lg font-semibold text-indigo-600">Our Mission</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Empowering global collaboration
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We believe in breaking down barriers to collaboration. Our platform is built to help teams and
              individuals share files securely and efficiently, no matter where they are in the world.
            </p>
          </div>
        </div>
      </div>

      <div className="py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-lg font-semibold text-indigo-600">Our Values</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              What we stand for
            </p>
          </div>

          <div className="mt-10">
            <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900">Security</h3>
                <p className="mt-2 text-base text-gray-500">
                  We prioritize the security of your data with industry-leading encryption and security measures.
                </p>
              </div>

              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900">Simplicity</h3>
                <p className="mt-2 text-base text-gray-500">
                  We believe powerful tools should be simple to use, with intuitive interfaces and clear workflows.
                </p>
              </div>

              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900">Privacy</h3>
                <p className="mt-2 text-base text-gray-500">
                  Your privacy is fundamental. We're committed to protecting your data and being transparent
                  about how we use it.
                </p>
              </div>

              <div className="relative">
                <h3 className="text-xl font-medium text-gray-900">Innovation</h3>
                <p className="mt-2 text-base text-gray-500">
                  We're constantly innovating and improving our platform to provide the best possible experience.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="lg:text-center">
            <h2 className="text-lg font-semibold text-indigo-600">Get in Touch</h2>
            <p className="mt-2 text-3xl font-bold leading-8 tracking-tight text-gray-900 sm:text-4xl">
              Want to learn more?
            </p>
            <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
              We'd love to hear from you. Reach out to us at{' '}
              <a href="mailto:sakshamgoel1107@gmail.com" className="text-indigo-600 hover:text-indigo-500">
                sakshamgoel1107@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
