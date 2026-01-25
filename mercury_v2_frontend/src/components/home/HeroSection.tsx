import { motion, type Variants } from 'framer-motion';
import { MessageCircle, Palette, ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';

const HeroSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.section
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="max-w-[1200px] mx-auto text-center pt-8 pb-20 px-4 md:px-6"
    >
      <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-3 py-1 bg-primary-50 rounded-full text-primary-600 text-sm font-medium mb-4">
        <Sparkles size={14} />
        <span>Next Gen Footwear Design</span>
      </motion.div>

      <div className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-[1.1] mb-12 min-h-[1.2em]">
        <WavyText text="Transform Your Ideas" className="inline-block" />
        <span className="hidden sm:inline">{' '}</span>
        <br className="sm:hidden" />
        <WavyText text="Into Reality" className="text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-teal-500 inline-block" delay={0.5} />
      </div>

      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 max-w-4xl mx-auto"
      >
        <CTACard
          title="Text to Design"
          subtitle="Describe and Generate"
          description="Simply describe your vision, and let our AI generate photorealistic designs instantly."
          href="/chat/new"
          image="https://images.unsplash.com/photo-1552346154-21d32810aba3?auto=format&fit=crop&q=80&w=1000" // Running shoes concept
          accentColor="bg-blue-600"
          icon={MessageCircle}
        />
        <CTACard
          title="Sketch to Design"
          subtitle="Draw and Refine"
          description="Upload a sketch or draw on our canvas to transform rough ideas into polished renders."
          href="/canvas/new"
          image="https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&q=80&w=1000" // Drafting/Sketching
          accentColor="bg-purple-600"
          icon={Palette}
        />
      </motion.div>
    </motion.section>
  );
};

// "Wavy" text animation component
const WavyText = ({ text, className, delay = 0 }: { text: string, className?: string, delay?: number }) => {
  const container: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.05, delayChildren: 0.04 * i + delay }
    })
  };

  const child: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 100
      }
    }
  };

  return (
    <motion.div
      style={{ display: "inline-block" }} // Changed from flex to handle wrapping naturally if needed, but for wavy usually flex is easier. Actually inline-block for words works best.
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {text.split("").map((letter, index) => (
        <motion.span variants={child} key={index} className="inline-block whitespace-pre">
          {letter === " " ? "\u00A0" : letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

// redesigned premium card
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const CTACard = ({ title, subtitle, description, href, image, icon: Icon }: any) => {
  return (
    <Link to={href} className="block group relative overflow-hidden rounded-3xl h-[360px] md:h-[420px] shadow-xl hover:shadow-2xl transition-all duration-500 w-full">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img 
          src={image} 
          alt={title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/90 group-hover:via-black/50 group-hover:to-black/95 transition-all duration-500" />
      </div>

      {/* Content */}
      <div className="relative h-full flex flex-col justify-end p-6 md:p-8 text-left text-white z-10">
        {/* Hover Highlight Line */}
        <div className={cn("absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/50 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-0 group-hover:opacity-100")} />

        <div className="mb-auto pt-4 transform translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500 delay-100">
             <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-white mb-4 border border-white/30">
                <Icon size={24} />
             </div>
        </div>

        <span className="inline-block py-1 px-3 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 text-xs font-semibold tracking-wider uppercase mb-3 w-fit">
          {subtitle}
        </span>
        
        <h3 className="font-heading text-2xl md:text-3xl font-bold mb-3 group-hover:text-primary-300 transition-colors">
          {title}
        </h3>
        
        <p className="text-gray-300 text-sm leading-relaxed mb-6 max-w-[95%] opacity-90 hidden sm:block">
          {description}
        </p>

        <div className="flex items-center gap-3 font-medium text-white group-hover:gap-5 transition-all duration-300 relative">
          <span className="relative">
            Start Creating
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-400 group-hover:w-full transition-all duration-500" />
          </span>
          <div className={cn("w-8 h-8 rounded-full flex items-center justify-center transition-colors", "bg-primary-600 text-white")}>
             <ArrowRight size={14} />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default HeroSection;
