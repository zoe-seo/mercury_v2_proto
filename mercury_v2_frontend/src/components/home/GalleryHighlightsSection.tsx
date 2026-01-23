import { motion } from 'framer-motion';
import { ArrowRight, Image as ImageIcon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockDesigns } from '../../api/mockData';

const GalleryHighlightsSection = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 pt-20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-heading text-2xl font-bold text-gray-800">
          Gallery Highlights
        </h2>
        <Link to="/gallery" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
          Explore Gallery <ArrowRight size={16} />
        </Link>
      </div>

      {mockDesigns.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {mockDesigns.map((design) => (
            <motion.div variants={itemVariants} key={design.id}>
               <Link to={`/gallery/${design.id}`}>
                 <div className="group relative aspect-square bg-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer">
                    {/* Image */}
                    {design.thumbnailUrl ? (
                      <img 
                        src={design.thumbnailUrl} 
                        alt={design.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-300">
                        <ImageIcon size={64} />
                      </div>
                    )}

                    {/* Overlay (Hover) */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                      <h3 className="text-white font-semibold text-lg translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        {design.name}
                      </h3>
                      <p className="text-gray-300 text-xs translate-y-4 group-hover:translate-y-0 transition-transform duration-300 delay-75">
                        {design.createdAt}
                      </p>
                    </div>
                 </div>
               </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
         <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <ImageIcon className="mx-auto text-gray-400 mb-2" size={48} />
           <p className="text-gray-500 text-sm">No designs yet. Create your first design!</p>
        </div>
      )}

       <div className="mt-8 text-center sm:hidden">
         <Link to="/gallery" className="text-sm font-medium text-primary-600 flex items-center justify-center gap-1">
          Explore Gallery <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default GalleryHighlightsSection;
