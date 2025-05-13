// src/app/(store)/about/page.tsx
'use client'

import { Card } from '@/components/ui/card'
import { Target, Lightbulb, Users, Award, Code, Zap } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Me</h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
          I'm a passionate full-stack developer with a keen interest in building modern, user-friendly web applications.
          This e-commerce project showcases my expertise in fullstack development with React, Next.js, and Spring Boot.
        </p>
      </div>

      {/* Mission & Vision */}
      <div className="grid md:grid-cols-2 gap-8 mb-16">
        <Card className="p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-300" />
          <Target className="h-12 w-12 text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-4">Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            To create seamless, efficient, and scalable e-commerce solutions that enhance the online shopping experience
            while maintaining high performance and security standards.
          </p>
        </Card>

        <Card className="p-8 relative overflow-hidden group hover:shadow-lg transition-all duration-300">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-300" />
          <Lightbulb className="h-12 w-12 text-primary mb-6" />
          <h2 className="text-2xl font-bold mb-4">Vision</h2>
          <p className="text-muted-foreground leading-relaxed">
            To become a leading developer in creating innovative e-commerce solutions that set new standards
            for user experience and technical excellence.
          </p>
        </Card>
      </div>

      {/* Core Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Core Values</h2>
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Code className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Technical Excellence</h3>
            <p className="text-muted-foreground">
              Committed to writing clean, efficient, and maintainable code that follows industry best practices.
            </p>
          </Card>

          <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">User-Centric Design</h3>
            <p className="text-muted-foreground">
              Focusing on creating intuitive and engaging user experiences that meet customer needs.
            </p>
          </Card>

          <Card className="p-6 text-center group hover:shadow-lg transition-all duration-300">
            <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
              <Zap className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-bold mb-3">Innovation</h3>
            <p className="text-muted-foreground">
              Continuously exploring new technologies and approaches to deliver cutting-edge solutions.
            </p>
          </Card>
        </div>
      </div>

      {/* Skills & Expertise */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center mb-12">Skills & Expertise</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              Frontend Development
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                React & Next.js
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                TypeScript
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Zustand state management
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Responsive Design
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                SSR and SEO optimization
              </li>
            </ul>
          </Card>

          <Card className="p-8">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
              <Award className="h-6 w-6 text-primary" />
              Backend Development
            </h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Spring Boot
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Spring Security
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                JPA and Hibernate
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Java
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                RESTful APIs
              </li>
              <li className="flex items-center gap-2">
                <span className="w-2 h-2 bg-primary rounded-full" />
                Database Design
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </div>
  )
}
