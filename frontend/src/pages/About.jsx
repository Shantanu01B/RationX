import { motion } from 'framer-motion';
import { HeartHandshake, ShieldCheck, Leaf, Users } from 'lucide-react';

const About = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-hidden">
      {/* Hero Section */}
      <div className="bg-primary text-white py-24 px-6 text-center relative">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h1 className="text-5xl font-extrabold mb-6 tracking-tight">About RationX</h1>
          <p className="text-xl text-indigo-100 max-w-2xl mx-auto leading-relaxed">
            Revolutionizing the Public Distribution System with Transparency, Efficiency, and Technology.
          </p>
        </motion.div>
        
        {/* Decorative Circles */}
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 8, repeat: Infinity }}
          className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl opacity-20 -translate-x-1/2 -translate-y-1/2"
        />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.1, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-400 rounded-full mix-blend-overlay filter blur-3xl opacity-20 translate-x-1/3 translate-y-1/3"
        />
      </div>

      <div className="container mx-auto px-6 py-16">
        {/* Mission Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Mission</h2>
          <p className="text-gray-600 max-w-3xl mx-auto leading-relaxed text-lg">
            RationX aims to eliminate inefficiencies in ration distribution by digitizing the entire process. 
            We empower citizens with real-time information about their entitlements and ensure that every grain 
            reaches the right beneficiary through secure QR-based verification.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {[
            { 
              icon: <HeartHandshake size={32} />, 
              color: "text-blue-600", 
              bg: "bg-blue-100",
              title: "Fair Distribution", 
              desc: "Ensuring every family receives their full quota without discrepancies." 
            },
            { 
              icon: <ShieldCheck size={32} />, 
              color: "text-green-600", 
              bg: "bg-green-100",
              title: "Secure & Verified", 
              desc: "QR-based authentication prevents fraud and impersonation." 
            },
            { 
              icon: <Leaf size={32} />, 
              color: "text-yellow-600", 
              bg: "bg-yellow-100",
              title: "Digital Records", 
              desc: "Paperless tracking of stock, distribution, and history." 
            },
            { 
              icon: <Users size={32} />, 
              color: "text-purple-600", 
              bg: "bg-purple-100",
              title: "Beneficiary First", 
              desc: "Easy slot booking and complaint redressal for citizens." 
            }
          ].map((item, index) => (
            <motion.div 
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10, transition: { duration: 0.2 } }}
              className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 text-center"
            >
              <div className={`${item.bg} ${item.color} w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner`}>
                {item.icon}
              </div>
              <h3 className="font-bold text-xl mb-3 text-gray-800">{item.title}</h3>
              <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default About;