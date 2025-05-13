'use client'

import { Card } from '@/components/ui/card'
import { Mail, Linkedin, Github, Globe } from 'lucide-react'
import Link from 'next/link'

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-12">
            {/* Hero Section */}
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">Contact Me</h1>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                    I'm always happy to hear from you to talk more about the project and my dev process. Get in touch with me through any of the following channels.
                </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                {/* Contact Information */}
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
                    <div className="space-y-4">
                        <div className="flex items-center gap-4">
                            <Mail className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <h3 className="font-medium">Email</h3>
                                <p className="text-muted-foreground">yorkyu16@gmail.com</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* Professional Profiles */}
                <Card className="p-8">
                    <h2 className="text-2xl font-bold mb-6">Professional Profiles</h2>
                    <div className="space-y-4">
                        <Link
                            href="https://www.linkedin.com/in/york-yinkui-yu-6b53a317a/"
                            target="_blank"
                            className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                        >
                            <Linkedin className="h-5 w-5 text-[#0077B5]" />
                            <div>
                                <h3 className="font-medium">LinkedIn</h3>
                                <p className="text-muted-foreground">Connect with me on LinkedIn</p>
                            </div>
                        </Link>
                        <Link
                            href="https://github.com/Back2016"
                            target="_blank"
                            className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                        >
                            <Github className="h-5 w-5" />
                            <div>
                                <h3 className="font-medium">GitHub</h3>
                                <p className="text-muted-foreground">Check out my projects</p>
                            </div>
                        </Link>
                        <Link
                            href="https://your-portfolio.com"
                            target="_blank"
                            className="flex items-center gap-4 p-4 rounded-lg hover:bg-accent transition-colors"
                        >
                            <Globe className="h-5 w-5 text-muted-foreground" />
                            <div>
                                <h3 className="font-medium">Portfolio</h3>
                                <p className="text-muted-foreground">View my personal portfolio</p>
                            </div>
                        </Link>
                    </div>
                </Card>
            </div>
        </div>
    )
}
