import { mockStats } from '@/mocks/data/home';

const QuickStatsSection = () => {
  return (
    <section className="max-w-[1400px] mx-auto px-4 md:px-8 py-20">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 text-sm font-medium text-gray-600">
         <div className="flex items-center gap-2">
           <span>📊</span>
           <span>Total Designs: {mockStats.totalDesigns}</span>
         </div>
         <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
         <div className="flex items-center gap-2">
           <span>📅</span>
           <span>This Week: {mockStats.thisWeek}</span>
         </div>
         <div className="hidden sm:block h-4 w-px bg-gray-300"></div>
         <div className="flex items-center gap-2">
           <span>💾</span>
           <span>Storage: {mockStats.storage}</span>
         </div>
      </div>
    </section>
  );
};

export default QuickStatsSection;
