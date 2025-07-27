import { Messages, columns } from './columns';
import { DataTable } from './data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useEffect, useState } from 'react';
import PaginationBar from './pegination';
import Message from './messages.json';

const MessageTable = () => {
  const [page, setPage] = useState(1);
  const [last, setLast] = useState(1);
  const [fetch, setFetch] = useState<boolean>(false);
  const [filteredProducts, setFilteredProducts] = useState<Messages[]>([]);

  useEffect(() => {
    setPage(1);
  }, [fetch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data: Messages[] = Message.Message as Messages[];
        const startIndex = (page - 1) * 5;
        const endIndex = startIndex + 5;
        setFilteredProducts(data.slice(startIndex, endIndex));
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, [page, fetch]);

  useEffect(() => {
    const fetchLast = async () => {
      try {
        const messages: Messages[] = Message.Message as Messages[];
        const data = messages.length / 5;
        setLast(data);
      } catch (err) {
        console.error('Error Fetching Data');
      }
    };
    fetchLast();
  }, [fetch]);

  const handlePrev = () => {
    if (page > 1) {
      setPage((prevState) => prevState - 1);
    }
  };

  const handleNext = () => {
    if (page < last) {
      setPage((prevState) => prevState + 1);
    }
  };
  const handleSearchValueChange = (value: string) => {
    if (!value) {
      setFetch(!fetch);
    }
  };

  const handleClick = (currentPage: number) => {
    setPage(currentPage);
  };

  const handleSearch = () => {
    setFetch(!fetch);
  };

  return (
    <div className="px-4 py-5">
      <div className="flex justify-between rounded-lg bg-white p-[25px] text-xl font-bold text-slate-800 dark:bg-[#161629] dark:text-slate-200">
        <div>Inbox</div>
        <div>
          <Select>
            <SelectTrigger className="flex h-[41px] w-[106px] items-center justify-center gap-[3px] rounded-[80px] bg-slate-100 py-3 text-sm font-normal text-slate-800 dark:text-slate-300">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">Read</SelectItem>
              <SelectItem value="dark">Unread</SelectItem>
              <SelectItem value="system">System</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <DataTable
        columns={columns}
        onSearchClick={handleSearch}
        onSearchValueChange={handleSearchValueChange}
        data={filteredProducts}
      />
      <PaginationBar
        lastPage={last}
        currentPage={page}
        handlePrev={handlePrev}
        handleNext={handleNext}
        handleClick={handleClick}
      />
    </div>
  );
};

export default MessageTable;
