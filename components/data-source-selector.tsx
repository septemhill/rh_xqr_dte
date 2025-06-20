"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { translations, type Language } from "@/lib/translations"; // 導入 translations 和 Language 類型

interface DataSourceSelectorProps {
  selectedDataSource: string;
  onDataSourceChange: (value: string) => void;
  dataSources: string[];
  t: {
    issuer: {
      roundhill: string;
      yieldmax: string;
    };
  };
}

const DataSourceSelector: React.FC<DataSourceSelectorProps> = ({
  selectedDataSource,
  onDataSourceChange,
  dataSources,
  t, // 接收 t prop
}) => {
  return (
    <Select onValueChange={onDataSourceChange} defaultValue={selectedDataSource}>
      <SelectTrigger className="w-[180px]">
        {/* 顯示選中的資料來源的翻譯值 */}
        <SelectValue placeholder="Select Data Source">
          {t.issuer[selectedDataSource as keyof typeof t.issuer] || selectedDataSource}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {dataSources.map((ds) => (
          <SelectItem key={ds} value={ds}>
            {/* 顯示每個資料來源選項的翻譯值 */}
            {t.issuer[ds as keyof typeof t.issuer] || ds}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default DataSourceSelector;