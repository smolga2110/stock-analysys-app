import { title } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import stockData from "../../public/stock-data.json"
import { useCallback, useEffect, useMemo, useState } from "react";
import { Select, SelectItem } from "@heroui/select";
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "@heroui/table";

export default function DocsPage() {
  const [stocks, setStocks] = useState(stockData);
  
  const [ticket, setTicket] = useState({ticket: ""});

  const handleTicketChange = useCallback((key: string, value: string) => {
    setTicket(prev => ({ ...prev, [key]: value}))
  }, [])

  const filterTicker = useMemo(() => {
    return stocks.stocks.find(stock => stock.ticker === ticket.ticket)
  }, [stocks.stocks, ticket.ticket])

  return (
    <DefaultLayout>
      <Select
        label="Ticket"
        selectedKeys={ticket.ticket}
        onChange={(e) => handleTicketChange("ticket", e.target.value)}
      >
        {stocks.stocks.map((value) => 
          <SelectItem key={value.ticker}>{`${value.ticker} (${value.companyName})`}</SelectItem>
        )}
      </Select>
      {ticket.ticket && <Table>
        <TableHeader>
          <TableColumn>Info</TableColumn>
          <TableColumn>Value</TableColumn>
        </TableHeader>
        <TableBody>
          <TableRow key="1">
            <TableCell>Company Name</TableCell>
            <TableCell>{filterTicker?.companyName}</TableCell>
          </TableRow>
          <TableRow key="2">
            <TableCell>Price</TableCell>
            <TableCell>{filterTicker?.currentPrice}</TableCell>
          </TableRow>
          <TableRow key="3">
            <TableCell>Verdict</TableCell>
            <TableCell>{filterTicker?.overallVerdict === true ? "Good" : "Bad"}</TableCell>
          </TableRow>
          <TableRow key="4">
            <TableCell>Market Cap</TableCell>
            <TableCell>{filterTicker?.stages.quickScreening.criteria.marketCap.value}</TableCell>
          </TableRow>
          <TableRow key="5">
            <TableCell>P/E Ratio</TableCell>
            <TableCell>{filterTicker?.stages.quickScreening.criteria.peRatio.value}</TableCell>
          </TableRow>
          <TableRow key="6">
            <TableCell>P/B Ratio</TableCell>
            <TableCell>{filterTicker?.stages.quickScreening.criteria.pbRatio.value}</TableCell>
          </TableRow>
          <TableRow key="7">
            <TableCell>ROE</TableCell>
            <TableCell>{filterTicker?.stages.quickScreening.criteria.roe.value}</TableCell>
          </TableRow>
        </TableBody>
      </Table>}
    </DefaultLayout>
  );
}
