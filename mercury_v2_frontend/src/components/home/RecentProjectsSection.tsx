import { motion } from 'framer-motion';
import { ArrowRight, MessageCircle, Palette, FolderOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockProjects } from '../../api/mockData';
import { cn } from '../../utils/cn';

const RecentProjectsSection = () => {
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
          Recent Projects
        </h2>
        <Link to="/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700 flex items-center gap-1 transition-colors">
          View All <ArrowRight size={16} />
        </Link>
      </div>

      {mockProjects.length > 0 ? (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4"
        >
          {mockProjects.map((project) => (
            <motion.div variants={itemVariants} key={project.id}>
              <Link to={project.type === 'chat' ? `/chat/${project.id}` : `/canvas/${project.id}`}>
                <div className="group bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer h-full flex flex-col">
                  {/* Thumbnail Area */}
                  <div className="aspect-video bg-gray-100 flex items-center justify-center relative overflow-hidden">
                    {project.thumbnailUrl ? (
                      <img 
                        src={project.thumbnailUrl} 
                        alt={project.name} 
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <FolderOpen className="text-gray-300 group-hover:text-gray-400 transition-colors" size={48} />
                    )}
                    
                    {/* Badge */}
                    <div className={cn(
                      "absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
                      project.type === 'chat' 
                        ? "bg-primary-50/90 text-primary-700 border border-primary-100"
                        : "bg-accent-50/90 text-accent-700 border border-accent-100"
                    )}>
                      {project.type === 'chat' ? 'Chat' : 'Canvas'}
                    </div>
                  </div>

                  {/* Content Area */}
                  <div className="p-4 flex flex-col flex-1">
                    <h3 className="font-sans font-semibold text-gray-800 truncate mb-1" title={project.name}>
                      {project.name}
                    </h3>
                    <div className="flex items-center justify-between text-xs text-gray-500 mt-auto">
                      <span>{project.updatedAt}</span>
                      {project.type === 'chat' ? <MessageCircle size={14} /> : <Palette size={14} />}
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
           <FolderOpen className="mx-auto text-gray-400 mb-2" size={48} />
           <p className="text-gray-500 text-sm">No projects yet. Start creating!</p>
        </div>
      )}
      
      <div className="mt-8 text-center sm:hidden">
         <Link to="/projects" className="text-sm font-medium text-primary-600 flex items-center justify-center gap-1">
          View All Projects <ArrowRight size={16} />
        </Link>
      </div>
    </section>
  );
};

export default RecentProjectsSection;
