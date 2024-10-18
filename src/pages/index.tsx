import React, { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input"
import { Currency, Search } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export const description =
  "A products dashboard with a sidebar navigation. The sidebar has icon navigation. The content area has a breadcrumb and search in the header. It displays a list of products in a table with actions.";

const Dashboard: React.FC = () => {

  const [apiKey, setApiKey] = useState('USD');
  const [targetKey, setTargetKey] = useState('USD');

  const [conversionRates, setConversionRates] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch(`https://v6.exchangerate-api.com/v6/13b83b39301485f447565dda/latest/${apiKey}/${targetKey}`);
        const data = await response.json();
        setConversionRates(data.conversion_rates);
      } catch (error) {
        console.error('Error fetching conversion rates:', error);
      }
    };

    fetchConversionRates();
  }, [apiKey, targetKey]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <div className="flex flex-col sm:gap-4 sm:py-4 sm:pl-14">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0">
          </div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card x-chunk="dashboard-06-chunk-0">
                <CardHeader>
                  <CardTitle>Currency</CardTitle>
                  <CardDescription>
                    Manage currency exchange rates.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Input 
                          placeholder='From' 
                          onChange={(e) => setApiKey(e.target.value)} 
                          />
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          <Input 
                          placeholder='To' 
                          onChange={(e) => setTargetKey(e.target.value)} 
                          />
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Object.keys(data.conversion_rates).map(key => ({ key, rate: data.conversion_rates[key] })) */}
                        {Object.entries(conversionRates).map(([currency, rate]) => {
                          const target = targetKey; // Replace 'USD' with the desired target currency
                          return (
                          <tr key={currency}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{currency}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{target}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{rate}</td>
                          </tr>
                          );
                        })}
                      
                    </tbody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;