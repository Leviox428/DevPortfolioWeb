"use client"

import { useAuth } from "@/src/contexts/AuthContext";
import AuthCard from "../portfolioSections/reviewSection/AuthCard";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../shadcnComponents/Tabs";
import AboutMeDashboardSection from "./dashboardSection/AboutMeDashboardSection";

export default function AdminDashboard() {
    const { isAuth } = useAuth();
     return (
    <div className="flex h-screen w-full items-center justify-center bg-black/65 p-8">
      {!isAuth && <AuthCard isAdmin={true} />}

      {isAuth && (
        <Tabs
          defaultValue="about-me"
          className="w-full max-w-3xl h-[80vh] max-h-[80vh] rounded-xl bg-zinc-800 p-4"
        >
          <TabsList className="flex w-full justify-between rounded-lg bg-zinc-700 p-1">
            <TabsTrigger
              value="about-me"
              className="w-full rounded-md text-zinc-300 transition
                         data-[state=active]:bg-zinc-800
                         data-[state=active]:text-white"
            >
              About Me
            </TabsTrigger>

            <TabsTrigger
              value="reviews"
              className="w-full rounded-md text-zinc-300 transition
                         data-[state=active]:bg-zinc-800
                         data-[state=active]:text-white"
            >
              Reviews
            </TabsTrigger>

            <TabsTrigger
              value="projects"
              className="w-full rounded-md text-zinc-300 transition
                         data-[state=active]:bg-zinc-800
                         data-[state=active]:text-white"
            >
              Projects
            </TabsTrigger>
          </TabsList>
          <div className="mt-4 rounded-lg bg-zinc-800 p-4">
            <TabsContent value="about-me" className="text-zinc-200">
                <AboutMeDashboardSection></AboutMeDashboardSection>
            </TabsContent>

            <TabsContent value="reviews" className="text-zinc-200">
              <h2 className="mb-2 text-lg font-semibold">Reviews</h2>
              <p className="text-sm text-zinc-400">

              </p>
            </TabsContent>

            <TabsContent value="projects" className="text-zinc-200">
              <h2 className="mb-2 text-lg font-semibold">Projects</h2>
              <p className="text-sm text-zinc-400">

              </p>
            </TabsContent>
          </div>
        </Tabs>
      )}
    </div>
  );
}
