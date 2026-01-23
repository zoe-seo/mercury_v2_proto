import { motion } from 'framer-motion';
import { Layout } from '../components/layout/Layout';
import HeroSection from '../components/home/HeroSection';
import RecentProjectsSection from '../components/home/RecentProjectsSection';
import GalleryHighlightsSection from '../components/home/GalleryHighlightsSection';
import QuickStatsSection from '../components/home/QuickStatsSection';

export const Home = () => {
  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3, ease: [0, 0, 0.2, 1] }}
        className="min-h-[calc(100vh-64px)]"
      >
        <HeroSection />
        <RecentProjectsSection />
        <GalleryHighlightsSection />
        <QuickStatsSection />
      </motion.div>
    </Layout>
  );
};

