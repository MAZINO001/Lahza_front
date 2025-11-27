// // import Header from "@/Components/Header";
// // import Dashboard from "./client/Dashboard";
// // import { Outlet } from "react-router-dom";

// // export default function AppLayout() {
// //   return (
// //     <div className="flex flex-col min-h-screen bg-accent-foreground ">
// //       <header className="w-full border-b">
// //         <Header />
// //       </header>

// //       <div>
// //         <Outlet />
// //         {/* <Dashboard /> */}
// //       </div>
// //     </div>
// //   );
// // }

// import { Outlet } from "react-router-dom";
// import Header from "@/Components/layout/Header";
// import { AppSidebar } from "../../Components/app-sidebar";
// import { SidebarInset, SidebarProvider } from "../../Components/ui/sidebar";

// export default function AppLayout() {
//   return (
//     <SidebarProvider
//       style={{
//         "--sidebar-width": "calc(var(--spacing) * 60)",
//         "--header-height": "calc(var(--spacing) * 6)",
//       }}
//     >
//       <AppSidebar variant="inset" />
//       <SidebarInset>
//         <div className="flex flex-col min-h-screen">
//           <header className="w-full border-b">
//             <Header />
//           </header>
//           <div className="flex flex-1">
//             <div className="@container/main flex flex-1 flex-col gap-4">
//               <Outlet />
//             </div>
//           </div>
//         </div>
//       </SidebarInset>
//     </SidebarProvider>
//   );
// }

import { Outlet } from "react-router-dom";
import Header from "@/Components/layout/Header";
import { AppSidebar } from "../../Components/app-sidebar";
import { SidebarInset, SidebarProvider } from "../../Components/ui/sidebar";
import { useRef } from "react";
import { LoadingProvider } from "@/hooks/LoadingContext";

export default function AppLayout() {
  const contentRef = useRef(null);
  return (
    <SidebarProvider
      style={{
        "--sidebar-width": "calc(var(--spacing) * 60)",
        "--header-height": "calc(var(--spacing) * 6)",
      }}
    >
      <AppSidebar variant="inset" />
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="w-full border-b">
            <Header />
          </header>
          <main ref={contentRef}>
            <LoadingProvider containerRef={contentRef}>
              <div className="mx-auto max-w-7xl">
                <Outlet />
              </div>
            </LoadingProvider>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
