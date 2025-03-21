"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight, CheckCircle, Award, Search, Calendar, BookOpen, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <header
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          scrolled ? "bg-background/95 backdrop-blur-md shadow-sm py-3" : "bg-transparent py-5",
        )}
      >
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Award className="h-8 w-8 text-primary" />
            <span className="font-bold text-xl">GrantFinder</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-sm font-medium hover:text-primary transition-colors">
              Features
            </Link>
            <Link href="#benefits" className="text-sm font-medium hover:text-primary transition-colors">
              Benefits
            </Link>
            <Link href="#testimonials" className="text-sm font-medium hover:text-primary transition-colors">
              Testimonials
            </Link>
          </div>
          <Button asChild>
            <Link href="/finder">
              Get Started <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/20 via-background to-background"></div>
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/2 h-3/4 bg-primary/5 rounded-l-full blur-3xl -z-10"></div>

        <div className="container relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                  Discover <span className="text-primary">Educational Grants</span> That Fuel Your Classroom
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Find, track, and apply for grants designed specifically for educators. Never miss an opportunity to
                  fund your educational vision.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Button size="lg" asChild className="text-base">
                    <Link href="/finder">
                      Explore Grants <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                  <Button size="lg" variant="outline" asChild className="text-base">
                    <Link href="#how-it-works">How It Works</Link>
                  </Button>
                </div>

                <div className="mt-8 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-primary/80 border-2 border-background flex items-center justify-center text-xs text-white font-medium"
                      >
                        {i}
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">1,000+</span> educators found grants this month
                  </p>
                </div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="relative z-10 bg-gradient-to-br from-background to-muted p-2 rounded-xl shadow-xl border">
                <Image
                  src="/placeholder.svg?height=600&width=800"
                  width={800}
                  height={600}
                  alt="Grant Finder Dashboard"
                  className="rounded-lg w-full"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-24 h-24 bg-primary rounded-full blur-2xl opacity-50"></div>
              <div className="absolute -top-6 -left-6 w-32 h-32 bg-primary/30 rounded-full blur-3xl"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-muted/50">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">$25M+</p>
              <p className="text-sm text-muted-foreground">Grant Funding Available</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</p>
              <p className="text-sm text-muted-foreground">Active Grants</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">15K+</p>
              <p className="text-sm text-muted-foreground">Educators Served</p>
            </div>
            <div className="text-center">
              <p className="text-3xl md:text-4xl font-bold text-primary mb-2">98%</p>
              <p className="text-sm text-muted-foreground">Satisfaction Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Educators</h2>
            <p className="text-xl text-muted-foreground">
              Our comprehensive platform helps you find, track, and apply for educational grants with ease.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: <Search className="h-10 w-10 text-primary" />,
                title: "Smart Search",
                description: "Find grants that match your specific needs with our intelligent filtering system.",
              },
              {
                icon: <Calendar className="h-10 w-10 text-primary" />,
                title: "Deadline Tracking",
                description: "Never miss an important deadline with automated reminders and calendar integration.",
              },
              {
                icon: <BookOpen className="h-10 w-10 text-primary" />,
                title: "Application Guidance",
                description: "Get step-by-step guidance through the application process for higher success rates.",
              },
              {
                icon: <Users className="h-10 w-10 text-primary" />,
                title: "Collaboration Tools",
                description: "Work with colleagues on grant applications with built-in sharing and commenting.",
              },
              {
                icon: <Award className="h-10 w-10 text-primary" />,
                title: "Success Tracking",
                description: "Monitor your application status and track your success rate over time.",
              },
              {
                icon: <CheckCircle className="h-10 w-10 text-primary" />,
                title: "Personalized Recommendations",
                description: "Receive tailored grant suggestions based on your profile and interests.",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border rounded-xl p-6 hover:shadow-md transition-all"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 bg-muted/30">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">How GrantFinder Works</h2>
            <p className="text-xl text-muted-foreground">
              A simple three-step process to find and secure funding for your educational initiatives.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-primary/30 -z-10"></div>

            {[
              {
                step: "01",
                title: "Create Your Profile",
                description: "Set up your educator profile with your interests, school type, and funding needs.",
              },
              {
                step: "02",
                title: "Discover Grants",
                description: "Browse and filter grants that match your specific requirements and deadlines.",
              },
              {
                step: "03",
                title: "Apply & Track",
                description: "Submit applications and track your progress all in one centralized dashboard.",
              },
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-background border rounded-xl p-8 relative z-10">
                  <div className="absolute -top-5 -left-5 w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white font-bold">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-20 md:py-32">
        <div className="container">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Educators Say</h2>
            <p className="text-xl text-muted-foreground">
              Hear from teachers and administrators who have successfully funded their projects.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote:
                  "GrantFinder helped me secure $5,000 for my classroom STEM project. The process was incredibly straightforward.",
                author: "Sarah Johnson",
                role: "5th Grade Teacher, Lincoln Elementary",
              },
              {
                quote:
                  "As a principal, I've recommended GrantFinder to all our teachers. We've seen a 300% increase in grant funding this year alone.",
                author: "Michael Rodriguez",
                role: "Principal, Washington High School",
              },
              {
                quote:
                  "The deadline reminders and application checklists were game-changers for me. I was able to submit my application with confidence.",
                author: "Emily Chen",
                role: "Art Teacher, Westview Middle School",
              },
              {
                quote:
                  "GrantFindr has revolutionized how our district approaches funding opportunities. It&apos;s saved us countless hours.",
                author: "John Doe",
                role: "Superintendent, Springfield School District",
              },
            ].map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="bg-card border rounded-xl p-6 relative"
              >
                <div className="absolute -top-4 left-6 text-primary text-6xl opacity-20">&quot;</div>
                <p className="text-lg mb-6 relative z-10">{testimonial.quote}</p>
                <div>
                  <p className="font-semibold">{testimonial.author}</p>
                  <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary/5 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-[url('/placeholder.svg?height=100&width=100')] opacity-5 -z-10"></div>
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/20 rounded-full blur-3xl -z-10"></div>

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto text-center"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Find Your Perfect Grant?</h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of educators who have already discovered and secured funding for their educational
              initiatives.
            </p>
            <Button size="lg" asChild className="text-base px-8">
              <Link href="/finder">
                Start Finding Grants <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <p className="mt-4 text-sm text-muted-foreground">No credit card required. Free for all educators.</p>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-muted/30">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Award className="h-6 w-6 text-primary" />
              <span className="font-bold text-lg">GrantFinder</span>
            </div>
            <div className="flex gap-8">
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Terms of Service
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                Contact Us
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} GrantFinder. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

