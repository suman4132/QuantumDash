
import { useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/use-auth";
import { 
  Zap, 
  Shield, 
  Code, 
  BookOpen, 
  Users, 
  Atom,
  ArrowRight,
  Check,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Menu,
  X,
  Sparkles,
  Globe
} from "lucide-react";

// Floating particles component
const FloatingParticles = () => {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    size: Math.random() * 4 + 2,
    left: Math.random() * 100,
    animationDelay: Math.random() * 5,
    duration: Math.random() * 10 + 10
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-blue-400/20 rounded-full"
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
          }}
          animate={{
            y: [window.innerHeight + 100, -100],
            opacity: [0, 1, 1, 0],
            scale: [0, 1, 1, 0]
          }}
          transition={{
            duration: particle.duration,
            delay: particle.animationDelay,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

export default function Landing() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, login, signup } = useAuth();
  
  const { scrollYProgress } = useScroll();
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  const handleLogin = () => {
    // Simulate login with demo user data
    login({
      id: 'demo-user',
      name: 'Demo User',
      email: 'demo@quantumcloud.com'
    });
  };

  const handleSignUp = () => {
    // Simulate signup with demo user data
    signup({
      name: 'New User',
      email: 'newuser@quantumcloud.com'
    });
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      window.location.href = '/dashboard';
    } else {
      handleSignUp();
    }
  };

  const features = [
    {
      icon: <Zap className="w-8 h-8 text-blue-400" />,
      title: "Quantum Systems on Cloud",
      description: "Run real experiments on quantum hardware with instant access"
    },
    {
      icon: <Code className="w-8 h-8 text-purple-400" />,
      title: "Developer-Friendly SDKs",
      description: "Easy integration with Qiskit & APIs for seamless development"
    },
    {
      icon: <Shield className="w-8 h-8 text-green-400" />,
      title: "Scalable & Secure",
      description: "Enterprise-ready platform with bank-level security"
    },
    {
      icon: <BookOpen className="w-8 h-8 text-pink-400" />,
      title: "Learning Resources",
      description: "Comprehensive tutorials, docs, and guided quantum labs"
    }
  ];

  const useCases = [
    "Education & Research",
    "Enterprise Applications", 
    "AI + Quantum Integration",
    "Optimization Problems"
  ];

  const plans = [
    {
      name: "Free",
      price: "$0",
      features: ["5 quantum jobs/month", "Basic tutorials", "Community support"],
      cta: "Start Free"
    },
    {
      name: "Professional",
      price: "$99",
      features: ["Unlimited jobs", "Priority queue", "Advanced features", "Email support"],
      cta: "Start Trial",
      popular: true
    },
    {
      name: "Enterprise", 
      price: "Custom",
      features: ["Dedicated resources", "Custom integrations", "24/7 support", "SLA guarantee"],
      cta: "Contact Sales"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-900 text-white overflow-x-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div 
          className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/20 to-pink-900/20"
          style={{ y: backgroundY }}
        />
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 20px 20px, rgba(156, 146, 172, 0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }} />
        </div>
        
        {/* Floating geometric shapes */}
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 border border-blue-400/20 rounded-full"
          animate={{
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 border border-purple-400/20"
          animate={{
            rotate: [0, -180, 0],
            y: [-10, 10, -10],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute bottom-40 left-20 w-16 h-16 bg-gradient-to-r from-pink-400/10 to-blue-400/10 rounded-lg"
          animate={{
            rotate: [0, 45, 0],
            x: [-5, 5, -5],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <FloatingParticles />
      </div>

      {/* Header */}
      <motion.header 
        className="fixed top-0 w-full z-50 backdrop-blur-md bg-gray-900/80 border-b border-gray-800"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Atom className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                QuantumCloud
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#home" className="hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="hover:text-blue-400 transition-colors">Pricing</a>
              <a href="#docs" className="hover:text-blue-400 transition-colors">Docs</a>
            </nav>

            <div className="hidden md:flex items-center space-x-4">
              {isAuthenticated ? (
                <Button onClick={() => window.location.href = '/dashboard'} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Go to Dashboard
                </Button>
              ) : (
                <>
                  <Button variant="ghost" onClick={handleLogin}>Login</Button>
                  <Button onClick={handleSignUp} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                    Sign Up
                  </Button>
                </>
              )}
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <motion.div 
            className="md:hidden bg-gray-800 border-t border-gray-700"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
          >
            <div className="px-4 py-4 space-y-4">
              <a href="#home" className="block hover:text-blue-400 transition-colors">Home</a>
              <a href="#features" className="block hover:text-blue-400 transition-colors">Features</a>
              <a href="#pricing" className="block hover:text-blue-400 transition-colors">Pricing</a>
              <a href="#docs" className="block hover:text-blue-400 transition-colors">Docs</a>
              <div className="pt-4 border-t border-gray-700 space-y-2">
                {isAuthenticated ? (
                  <Button onClick={() => window.location.href = '/dashboard'} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                    Go to Dashboard
                  </Button>
                ) : (
                  <>
                    <Button variant="ghost" onClick={handleLogin} className="w-full">Login</Button>
                    <Button onClick={handleSignUp} className="w-full bg-gradient-to-r from-blue-600 to-purple-600">
                      Sign Up
                    </Button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </motion.header>

      {/* Hero Section */}
      <section id="home" className="relative min-h-screen flex items-center justify-center pt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            style={{ y: textY }}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.h1 
              className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Experience the Future of{" "}
              <motion.span 
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent inline-block"
                animate={{
                  backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear"
                }}
                style={{
                  backgroundSize: "200% 100%"
                }}
              >
                Quantum Computing
              </motion.span>
              {" "}in the Cloud
            </motion.h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-4xl mx-auto">
              Run, learn, and innovate with powerful quantum systems accessible anywhere. 
              Join the quantum revolution today.
            </p>
            <motion.div 
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button 
                  onClick={handleGetStarted}
                  size="lg" 
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-8 py-4 relative overflow-hidden group"
                >
                  <motion.div
                    className="absolute inset-0 bg-white/20"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: "100%" }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative flex items-center">
                    Get Started <ArrowRight className="ml-2 w-5 h-5" />
                  </span>
                </Button>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button variant="outline" size="lg" className="text-lg px-8 py-4 border-gray-600 text-white hover:bg-gray-800 relative group">
                  <span className="relative flex items-center">
                    <BookOpen className="mr-2 w-5 h-5" />
                    Explore Docs
                  </span>
                </Button>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Powerful Quantum Features
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Everything you need to harness the power of quantum computing
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                whileHover={{ y: -10 }}
              >
                <Card className="bg-gray-800/50 border-gray-700 backdrop-blur-sm hover:bg-gray-800/70 hover:border-blue-500/50 transition-all duration-300 group relative overflow-hidden">
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100"
                    transition={{ duration: 0.3 }}
                  />
                  <CardContent className="p-6 text-center relative z-10">
                    <motion.div 
                      className="mb-4 group-hover:scale-110 transition-transform duration-300"
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      {feature.icon}
                    </motion.div>
                    <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                    <p className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Intuitive Dashboard
            </h2>
            <p className="text-xl text-gray-300">
              Manage jobs, track results, and scale effortlessly
            </p>
          </motion.div>

          <motion.div 
            className="relative max-w-4xl mx-auto"
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl blur-xl opacity-50"
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.7, 0.5],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-1 rounded-xl relative">
                <div className="bg-gray-900 rounded-lg overflow-hidden">
                  <div className="h-64 md:h-96 bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center relative">
                    <motion.div
                      className="text-center"
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.8, delay: 0.3 }}
                    >
                      <motion.div
                        animate={{ 
                          rotate: [0, 360],
                          scale: [1, 1.1, 1]
                        }}
                        transition={{ 
                          duration: 4, 
                          repeat: Infinity,
                          ease: "linear"
                        }}
                      >
                        <Atom className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                      </motion.div>
                      <p className="text-gray-400 mb-2">Quantum Dashboard</p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                        <Sparkles className="w-4 h-4" />
                        <span>Real-time quantum computing</span>
                        <Globe className="w-4 h-4" />
                      </div>
                    </motion.div>
                    
                    {/* Simulated dashboard elements */}
                    <div className="absolute top-4 left-4 right-4 flex justify-between items-center opacity-30">
                      <div className="flex space-x-2">
                        <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                      </div>
                      <div className="text-xs text-gray-500">QuantumCloud Dashboard</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Use Cases & Solutions
            </h2>
            <p className="text-xl text-gray-300">
              Quantum computing for every industry
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {useCases.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="bg-gradient-to-r from-gray-800/50 to-gray-700/50 border-gray-600 hover:border-blue-500/50 transition-all duration-300 group">
                  <CardContent className="p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Atom className="w-6 h-6 text-white" />
                      </div>
                      <h3 className="text-2xl font-semibold">{useCase}</h3>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-800/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Choose Your Plan
            </h2>
            <p className="text-xl text-gray-300">
              Start free, scale as you grow
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className={`relative bg-gray-800/50 border-gray-700 hover:border-blue-500/50 transition-all duration-300 ${
                  plan.popular ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                }`}>
                  {plan.popular && (
                    <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600">
                      Most Popular
                    </Badge>
                  )}
                  <CardContent className="p-8 text-center">
                    <h3 className="text-2xl font-bold mb-4">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold">{plan.price}</span>
                      {plan.price !== 'Custom' && <span className="text-gray-400">/month</span>}
                    </div>
                    <ul className="space-y-3 mb-8">
                      {plan.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center justify-center space-x-2">
                          <Check className="w-5 h-5 text-green-400" />
                          <span className="text-gray-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full ${
                        plan.popular 
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                          : 'bg-gray-700 hover:bg-gray-600'
                      }`}
                      onClick={handleGetStarted}
                    >
                      {plan.cta}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Join Our Quantum Network
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Connect with researchers, developers, and innovators worldwide
            </p>
            <div className="flex items-center justify-center space-x-4">
              <Users className="w-6 h-6 text-blue-400" />
              <span className="text-lg">10,000+ Active Users</span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">500+ Organizations</span>
              <span className="text-gray-500">•</span>
              <span className="text-lg">50+ Countries</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-900/50 via-purple-900/50 to-pink-900/50 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Get Started with Quantum Today
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Ready to explore the quantum frontier? Join thousands of researchers and developers.
            </p>
            <Button 
              onClick={handleGetStarted}
              size="lg" 
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-lg px-12 py-4"
            >
              Sign Up Free <ArrowRight className="ml-2 w-6 h-6" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Logo & Tagline */}
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Atom className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  QuantumCloud
                </span>
              </div>
              <p className="text-gray-400">
                Empowering the future through quantum computing in the cloud.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <div className="space-y-2">
                <a href="#about" className="block text-gray-400 hover:text-white transition-colors">About</a>
                <a href="#docs" className="block text-gray-400 hover:text-white transition-colors">Documentation</a>
                <a href="#careers" className="block text-gray-400 hover:text-white transition-colors">Careers</a>
                <a href="#blog" className="block text-gray-400 hover:text-white transition-colors">Blog</a>
                <a href="#contact" className="block text-gray-400 hover:text-white transition-colors">Contact</a>
              </div>
            </div>

            {/* Social Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Twitter className="w-6 h-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Youtube className="w-6 h-6" />
                </a>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 QuantumCloud. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
