import type { Metadata } from 'next'
import Link from 'next/link'
import { FaLock, FaCloud, FaShareAlt, FaHistory, FaUserFriends, FaMobile } from 'react-icons/fa'

export const metadata: Metadata = {
  title: 'Features | Droply',
  description: 'Discover all the powerful features that make Droply the best choice for file sharing',
}

const features = [
  {
    name: 'End-to-End Encryption',
    description: 'Your files are encrypted in transit and at rest, ensuring maximum security.',
    icon: FaLock,
  },
  {
    name: 'Cloud Storage',
    description: 'Access your files from anywhere with secure cloud storage.',
    icon: FaCloud,
  },
  {
    name: 'Easy Sharing',
    description: 'Share files and folders with anyone, with customizable access controls.',
    icon: FaShareAlt,
  },
  {
    name: 'Version History',
    description: 'Keep track of changes with automatic version history.',
    icon: FaHistory,
  },
  {
    name: 'Team Collaboration',
    description: 'Work together seamlessly with team sharing and permissions.',
    icon: FaUserFriends,
  },
  {
    name: 'Mobile Access',
    description: 'Access your files on any device with our responsive platform.',
    icon: FaMobile,
  },
]

export default function FeaturesPage() {
  return (
    <div className="bg-white py-12 sm:py-16 lg:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl md:text-6xl">
            Powerful features for seamless file sharing
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Discover why Droply is the preferred choice for individuals and teams looking for secure and
            efficient file sharing solutions.
          </p>
        </div>

        {/* Features Grid */}
        <div className="mt-20">
          <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.name} className="relative">
                <div className="flex items-center space-x-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-md bg-indigo-500 text-white">
                    <span className="h-6 w-6" aria-hidden="true" ><feature.icon /></span>
                    
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">{feature.name}</h3>
                </div>
                <p className="mt-2 text-base text-gray-500 ml-16">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Detailed Features Sections */}
        <div className="mt-32 space-y-32">
          {/* Security Section */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex flex-col justify-center">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Enterprise-Grade Security
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Your security is our top priority. We use industry-leading encryption standards to protect
                your data both in transit and at rest. With end-to-end encryption, even we can't access
                your files.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500" ><FaLock /></span>
                  
                  <span className="ml-2 text-gray-600">End-to-end encryption</span>
                </li>
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500" ><FaLock /></span>
                  
                  <span className="ml-2 text-gray-600">Two-factor authentication</span>
                </li>
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500" ><FaLock /></span>
                  
                  <span className="ml-2 text-gray-600">SOC 2 Type II compliant</span>
                </li>
              </ul>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-full h-64 bg-gray-100 rounded-lg"></div>
            </div>
          </div>

          {/* Collaboration Section */}
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:gap-8">
            <div className="flex items-center justify-center lg:order-2">
              <div className="w-full h-64 bg-gray-100 rounded-lg"></div>
            </div>
            <div className="flex flex-col justify-center lg:order-1">
              <h2 className="text-3xl font-bold tracking-tight text-gray-900">
                Seamless Team Collaboration
              </h2>
              <p className="mt-4 text-lg text-gray-500">
                Work together efficiently with your team. Share files, set permissions, and track changes
                in real-time. Our collaboration features make teamwork smooth and productive.
              </p>
              <ul className="mt-8 space-y-4">
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500"><FaUserFriends  /></span>
                  
                  <span className="ml-2 text-gray-600">Team workspaces</span>
                </li>
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500" ><FaHistory /></span>
                  
                  <span className="ml-2 text-gray-600">Version control</span>
                </li>
                <li className="flex items-center">
                    <span className="h-5 w-5 text-indigo-500"><FaShareAlt  /></span>
                  
                  <span className="ml-2 text-gray-600">Granular permissions</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-32 text-center">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">
            Ready to get started?
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-500">
            Join thousands of users who trust Droply for their file sharing needs.
          </p>
          <div className="mt-8 flex justify-center">
            <Link href="/dashboard" className="rounded-md bg-indigo-600 px-8 py-3 text-base font-semibold text-white shadow hover:bg-indigo-700">
              Try Droply for Free
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
