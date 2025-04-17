"use no memo";

import { Ban } from "lucide-react";
import { Main } from "~/lib/components/layout/main";
import { ViolationsTable } from "./components/violations-table";

interface ViolationsProps {
  data: any[];
}

export function Violations({ data }: ViolationsProps) {
  return (
    <Main>
      <div className="mb-2 flex flex-wrap items-center justify-between space-y-2">
        <div className="flex items-center">
          <Ban className="mr-2 h-5 w-5" />
          <h2 className="text-1xl font-bold tracking-tight">Violations</h2>
        </div>
      </div>

      <div className="-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-x-12 lg:space-y-0">
        <ViolationsTable data={data} />
      </div>
    </Main>
  );
}
