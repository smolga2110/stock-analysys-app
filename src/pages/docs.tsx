import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import stockData from "../../public/stock-data.json"
import { label } from "framer-motion/client";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  getKeyValue,
} from "@heroui/table";
import { isBoolean } from "tailwind-variants/utils";
import { useCallback, useMemo, useState } from "react";
import { Input } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select"
import { Button } from "@heroui/button";

export default function DocsPage() {
  const [stockings, setStockings] = useState(stockData);
  const [filters, setFilters] = useState({
    verdict: "all",
    minPrice: "",
    maxPrice: "",
    searchTerm: "",
  });

  const handleFilterChange = useCallback((key: string, value: string) =>
    {
      setFilters(prev => ({ ...prev, [key]: value}))
    }, []);

  const clearFilters = useCallback(() => {
    setFilters({
      verdict: "all",
      minPrice: "",
      maxPrice: "",
      searchTerm: "",
    })
  }, []);
  
  const filteredStocks = useMemo(() => {
    return stockings.stocks.filter(stock => {
      if (filters.verdict !== "all"){
        const goodChoise = filters.verdict === "good";
        if (stock.overallVerdict !== goodChoise) return false;
      }

      if (filters.minPrice && stock.currentPrice < parseFloat(filters.minPrice)) return false;

      if (filters.maxPrice && stock.currentPrice > parseFloat(filters.maxPrice)) return false;

      if (filters.searchTerm && !stock.companyName.toLowerCase().includes(filters.searchTerm.toLowerCase())) return false;

      return true;
    })
  }, [stockings.stocks, filters]);

  const stats = useMemo(() => {
    const total = filteredStocks.length;
    const goodStocks = filteredStocks.filter(stock => stock.overallVerdict).length;
    const badStocks = total - goodStocks;

    return {total, goodStocks, badStocks};
  }, [filteredStocks])

  const columns = [
    {
      key: "companyName",
      label: "Company",
    },
    {
      key: "currentPrice",
      label: "Price",
    },
    {
      key: "overallVerdict",
      label: "Verdict",
    }
  ]

  return (
    <DefaultLayout>
      <div className="mb-6 p-4 bg-content2 rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
          <Input
            label="Search company"
            value={filters.searchTerm}
            onChange={(e) => handleFilterChange("searchTerm", e.target.value)}
            placeholder="Apple, Microsoft, etc..."
          />
          
          <Select
            label="Verdict"
            selectedKeys={[filters.verdict]}
            onChange={(value) => handleFilterChange("verdict", value.target.value)}
          >
            <SelectItem key="all">All stocks</SelectItem>
            <SelectItem key="good">Good only</SelectItem>
            <SelectItem key="bad">Bad only</SelectItem>
          </Select>

          <Input
            label="Min price"
            type="number"
            value={filters.minPrice}
            onChange={(e) => handleFilterChange("minPrice", e.target.value)}
            placeholder="0"
          />

          <Input
            label="Max price"
            type="number"
            value={filters.maxPrice}
            onChange={(e) => handleFilterChange("maxPrice", e.target.value)}
            placeholder="1000"
          />
        </div>

        <div className="flex justify-between items-center">
          <Button onPress={clearFilters} variant="flat" size="sm">
            Clear filters
          </Button>
          <div className="text-sm text-default-500">
            Showing {stats.total} stocks ({stats.goodStocks} good, {stats.badStocks} bad)
          </div>
        </div>
      </div>

      <Table >
        <TableHeader columns={columns}>
          {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
        </TableHeader>
        <TableBody items={filteredStocks}>
          {(item) => (
            <TableRow key={item.lastUpdated}>
              {/* Строку ниже можно оптимизировать (Значения столбцов уже True/False) */}
              {(columnKey) => <TableCell>{(isBoolean(getKeyValue(item, columnKey)) ? ((getKeyValue(item, columnKey) === true) ? "Good" : "Bad") : getKeyValue(item, columnKey))}</TableCell>}
            </TableRow>
          )}
        </TableBody>
      </Table>
    </DefaultLayout>
  );
}
