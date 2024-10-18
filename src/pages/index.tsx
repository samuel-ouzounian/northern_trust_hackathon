"use client";

import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Table } from "@/components/ui/table";
import { Tabs, TabsContent } from "@/components/ui/tabs";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useRouter } from "next/router";

interface CurrencyComboboxProps {
  value: string;
  setValue: (value: string) => void;
  currencies: string[];
  placeholder: string;
  excludeCurrency?: string;
}

const CurrencyCombobox: React.FC<CurrencyComboboxProps> = ({
  value,
  setValue,
  currencies,
  placeholder,
  excludeCurrency,
}) => {
  const [open, setOpen] = React.useState(false);

  const filteredCurrencies = currencies.filter(
    (currency) => currency !== excludeCurrency
  );

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value || placeholder}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search currency..." />
          <CommandList>
            <CommandEmpty>No currency found.</CommandEmpty>
            <CommandGroup>
              {filteredCurrencies.map((currency) => (
                <CommandItem
                  key={currency}
                  value={currency}
                  onSelect={(currentValue: string) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === currency ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {currency}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface ConversionRates {
  [key: string]: number;
}

const Dashboard: React.FC = () => {
  const [baseKey, setBaseKey] = useState<string>("USD");
  const [targetKey, setTargetKey] = useState<string>("EUR");
  const [conversionRates, setConversionRates] = useState<ConversionRates>({});
  const router = useRouter();

  useEffect(() => {
    const fetchConversionRates = async () => {
      try {
        const response = await fetch(
          `https://v6.exchangerate-api.com/v6/13b83b39301485f447565dda/latest/${baseKey}/`
        );
        const data = await response.json();
        setConversionRates(data.conversion_rates);
      } catch (error) {
        console.error("Error fetching conversion rates:", error);
      }
    };

    fetchConversionRates();
  }, [baseKey]);

  useEffect(() => {
    // Reset targetKey if it's the same as the new baseKey
    if (targetKey === baseKey) {
      setTargetKey("");
    }
  }, [baseKey, targetKey]);

  const currencies = Object.keys(conversionRates);

  const handleBaseKeyChange = (newBaseKey: string) => {
    setBaseKey(newBaseKey);
    if (newBaseKey === targetKey) {
      setTargetKey("");
    }
  };

  const handleRowClick = () => {
    router.push("/exchange");
  };

  const renderTableRows = () => {
    const rows: JSX.Element[] = [];

    // Add the target key row at the top
    if (targetKey && conversionRates[targetKey]) {
      rows.push(
        <tr key={targetKey} className="cursor-pointer" onClick={handleRowClick}>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {baseKey}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {targetKey}
          </td>
          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
            {conversionRates[targetKey]}
          </td>
        </tr>
      );
    }

    // Add the rest of the rows, excluding the base key and target key
    Object.entries(conversionRates).forEach(([currency, rate]) => {
      if (currency !== baseKey && currency !== targetKey) {
        rows.push(
          <tr
            key={currency}
            className="cursor-pointer"
            onClick={handleRowClick}
          >
            {" "}
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {baseKey}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {currency}
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
              {rate}
            </td>
          </tr>
        );
      }
    });

    return rows;
  };

  return (
    <div className="flex w-full max-h-screen flex-col p-20">
      <div className="flex flex-col max-h-screen">
        <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
          <div className="relative ml-auto flex-1 md:grow-0"></div>
        </header>
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <Tabs defaultValue="all">
            <TabsContent value="all">
              <Card>
                <CardHeader>
                  <CardTitle>Explore</CardTitle>
                  <CardDescription>Currency exchange rates</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-4 mb-4">
                    <div className="w-1/2">
                      <CurrencyCombobox
                        value={baseKey}
                        setValue={handleBaseKeyChange}
                        currencies={currencies}
                        placeholder="Select base currency..."
                      />
                    </div>
                    <div className="w-1/2">
                      <CurrencyCombobox
                        value={targetKey}
                        setValue={setTargetKey}
                        currencies={currencies}
                        placeholder="Select target currency..."
                        excludeCurrency={baseKey}
                      />
                    </div>
                  </div>
                  <Table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Base Currency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Target Currency
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Exchange Rate
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {renderTableRows()}
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
};

export default Dashboard;
