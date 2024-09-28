// import NavigationSideBar from "@/components/navigation/navigation-sidebar";
// import { BottomTabs } from "@/components/tma/bottom-tab-navigation";

// interface MainLayputProps {
//   children: React.ReactNode;
// }

// const MainLayput: React.FC<MainLayputProps> = ({ children }) => {
//   return (
//     <div className="h-full">
//       <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
//         <NavigationSideBar />
//       </div>
//       <div className="md:pl-[72px] h-full">
//       {children}
//       </div>
//       <BottomTabs/>
//     </div>
//   );
// };

// export default MainLayput;


import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import { BottomTabs } from "@/components/tma/bottom-tab-navigation";

interface MainLayputProps {
  children: React.ReactNode;
}

const MainLayput: React.FC<MainLayputProps> = ({ children }) => {
  return (
    <div className="h-full relative">
      {/* Sidebar for larger screens */}
      <div className="hidden md:flex h-full w-[72px] z-30 flex-col fixed inset-y-0">
        {/* <NavigationSideBar /> */}
      </div>

      {/* Main content area */}
      <div className="md:pl-[72px] h-full pb-[64px]">
        {/* pb-[64px] adds padding to the bottom of the content to ensure it's not overlapped by BottomTabs */}
        {children}
      </div>

      {/* Bottom Tabs */}
      <div className="fixed bottom-0 w-full md:hidden">
        {/* Ensure it's fixed at the bottom and hidden on larger screens */}
        {/* <BottomTabs /> */}
      </div>
    </div>
  );
};

export default MainLayput;
