"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useCurrencyStore } from "@/stores/currencyStore";
import { Globe } from "lucide-react";

const currencies = ["USD", "NGN", "GBP", "EUR", "KES", "ZAR", "CAD"];

export default function CurrencySelector() {
  const { currency, setCurrency } = useCurrencyStore();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1 text-sm font-medium hover:text-[#3c9ee0]">
        <Globe className="w-4 h-4" /> {currency}
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-32">
        {currencies.map((c) => (
          <DropdownMenuItem
            key={c}
            onClick={() => setCurrency(c)}
            className={
              c === currency
                ? "bg-[#3c9ee0]/15 text-[#3c9ee0] font-semibold"
                : ""
            }
          >
            {c}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
