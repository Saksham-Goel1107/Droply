import type { Metadata } from 'next'
import { FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa'

export const metadata: Metadata = {
    title: 'Contact Us | Droply',
    description: 'Get in touch with our team for support or inquiries',
}

export default function ContactPage() {
    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-16">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <p className="text-sm font-semibold text-indigo-600 tracking-wide uppercase mb-2">Get in Touch</p>
                    <h1 className="text-4xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
                        Contact Us
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        We'd love to hear from you. Our team is always here to help and answer any questions you might have.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                    {/* Contact Information */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
                            Contact Information
                        </h2>

                        <div className="space-y-8">
                            <div className="flex items-start group">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                                    <FaEnvelope size="20" />
                                </div>

                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Email</h3>
                                    <p className="mt-1 text-gray-600">
                                        <a
                                            href="mailto:sakshamgoel1107@gmail.com"
                                            className="hover:text-indigo-600 transition-colors duration-300"
                                        >
                                            sakshamgoel1107@gmail.com
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start group">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                                    <FaPhone size="20" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Phone</h3>
                                    <p className="mt-1 text-gray-600">
                                        <a
                                            href="tel:+918882534712"
                                            className="hover:text-indigo-600 transition-colors duration-300"
                                        >
                                            (+91) 8882534712
                                        </a>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start group">
                                <div className="h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center group-hover:bg-indigo-100 transition-colors duration-300">
                                    <FaMapMarkerAlt size="20" />
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-semibold text-gray-900">Office</h3>
                                    <p className="mt-1 text-gray-600">
                                        123 New Delhi
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-100">
                        <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-8">
                            Send us a Message
                        </h2>

                        <form className="space-y-6">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                                    Full Name
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
                                    required
                                    placeholder="Saksham"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
                                    required
                                    placeholder="saksham@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    className="p-2 mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
                                    required
                                    placeholder="How can we help?"
                                />
                            </div>

                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                                    Message
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={4}
                                    className="p-1 mt-1 block w-full rounded-lg border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 transition-colors duration-200"
                                    required
                                    placeholder="Your message here..."
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-4 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-all duration-300 font-medium"
                            >
                                Send Message
                            </button>
                        </form>
                    </div>
                </div>

                {/* FAQ Section */}
                <div className="mt-24">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600 mb-12">
                            Frequently Asked Questions
                        </h2>

                        <div className="grid grid-cols-1 gap-8">
                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">What are your support hours?</h3>
                                <p className="mt-2 text-gray-600">
                                    Our support team is available Monday through Friday, 9 AM to 6 PM EST.
                                </p>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <h3 className="text-lg font-semibold text-gray-900">How quickly do you respond?</h3>
                                <p className="mt-2 text-gray-600">
                                    We aim to respond to all inquiries within 24 hours during business days.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
