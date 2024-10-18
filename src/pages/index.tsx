import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const description =
  "A products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

const Dashboard: React.FC = () => {
  const [conversionRates, setConversionRates] = useState<{
    [key: string]: number;
  }>({});

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch(
          "https://v6.exchangerate-api.com/v6/13b83b39301485f447565dda/latest/USD"
        );
        const data = await response.json();
        setConversionRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRates();
  }, []);

  return (
    <div className="flex w-full max-h-screen flex-col p-20">
      <div className="flex flex-col max-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0"></div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Explore</CardTitle>
                  <CardDescription>Currency exchange rates</CardDescription>
                </CardHeader>
                <CardContent>
                  {/* Added a wrapper div for the table */}
                  <div
                    className="table-container"
                    style={{ height: "70vh", overflowY: "auto" }}
                  >
                    <Table className="min-w-full divide-y divide-gray-200">
                      <thead>
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Input placeholder="From" />
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            <Input placeholder="To" />
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {Object.entries(conversionRates).map(
                          ([currency, rate]) => (
                            <tr key={currency}>
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {currency}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {rate}
                              </td>
                            </tr>
                          )
                        )}
                      </tbody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
