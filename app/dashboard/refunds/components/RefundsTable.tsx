'use client';

import { refund_records } from '@prisma/client';
import { useAuth } from '@/lib/AuthContext';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  RefreshCw,
  Plus,
  Search,
  Filter,
  Badge,
  Box,
  Receipt,
} from 'lucide-react';
import { prisma } from '@/lib/prisma';
import { pid } from 'process';
import { toast } from 'sonner';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNavigationWithAlert } from '@/hooks/useNavigationWithAlert';
import Loader from '@/components/uix/Loader';
import { Landmark, User } from 'lucide-react';
import { BiMoney } from 'react-icons/bi';

export default async function RefundTable({ records }: any) {
  const router = useRouter();
  //const [param1, setParam1] = useState(useSearchParams.get('statusx') || '') as any;

  const { user, logout } = useAuth(); //DATA FROM SESSION
  const [pidUser, setPidUser] = useState(user?.pidUser);
  const navigateWithAlert = useNavigationWithAlert();

  //const [statusz, setStatus] = useState(statusx);

  const [refunds, setRefunds] = useState<any>(records as any); // Explicitly type refunds as RefundData[]
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [confirmationChecked, setConfirmationChecked] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('pending');
  const [newRefund, setNewRefund] = useState<Partial<any>>({
    currency: 'USD',
    refundStatus: 'pending',
    serviceType: 'standard',
  });

  // Filter refunds based on search and status
  const filteredRefunds = refunds.filter((refund: any) => {
    const matchesSearch =
      searchTerm === '' ||
      Object.values(refund).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    // const matchesStatus =
    //   statusFilter === 'all' || refund.refundStatus === statusFilter;
    const matchesStatus = refund.refundStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // const getStatusBadge = (status?: string) => {
  //   const statusConfig = {
  //     pending: { variant: "secondary" as const, label: "Pending" },
  //     approved: { variant: "default" as const, label: "Approved" },
  //     rejected: { variant: "destructive" as const, label: "Rejected" },
  //     processing: { variant: "outline" as const, label: "Processing" },
  //     completed: { variant: "default" as const, label: "Completed" },
  //   }

  //   const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending
  //   return <span className={`badge badge-${config.variant}`}>{config.label}</span>
  // }

  const handleCreateRefund = async () => {
    if (!confirmationChecked) return;

    //e.preventDefault();
    //await new Promise((resolve) => setTimeout(resolve, 3000));

    // const formData = new FormData() as any;
    // formData.append('pidUser', pidUser);
    // formData.append('userEmail', user?.userEmail);
    const email = user?.userEmail;
    const pidUser = user?.pidUser;
    //formData.append('amount', refunds.reduce((sum:any, r:any) => sum + Number.parseFloat(r.amount || "0"), 0));

    //MAKE REQUEST ATTEMPT
    try {
      toast.info('Processing Refund Request . . .');
      //MAKE REQUEST
      const res = await fetch(
        '/api/refunds/refund-request?email=' + email + '&pidUser=' + pidUser,
      );

      // GET & PROCESS RESPONSE FROM API
      const data: any = await res.json();

      // if (data.statusx == 'SUCCESS') {
      //   navigateWithAlert(
      //     '/dashboard/refunds',
      //     'success',
      //     data.message,
      //   );
      // }

      if (data.statusx == 'SUCCESS') {
        toast.success(data.message);
        window.location.reload();
        //router.push('/dashboard/refunds');
      }

      if (data.statusx == 'FAILED') {
        toast.warning(data.message);
      }
    } catch (error: any) {
      console.log(error.message);
    } finally {
      //setLoading(false);
    }

    setConfirmationChecked(false);
    setIsDialogOpen(false);
  };

  return (
    <div className="w-full space-y-6 bg-slate-200 p-6 dark:bg-slate-800">
      <CardHeader>
        <div className="flex flex-col gap-4 rounded-lg p-7 dark:bg-slate-700 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {/* <CardTitle className="text-2xl font-bold">Refunds Management</CardTitle> */}
            <p className="mt-1 text-gray-800 dark:text-gray-400">
              <b>Track Refunds & Requests across all services</b>
            </p>
          </div>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            {/* <button 
              onClick={() => viewPendingRequest()}
              className="flex items-center gap-2 bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-orange-500">
                <Receipt className="h-4 w-4" />
                View Pending Request
              </button> */}

            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Request Refund
              </Button>
            </DialogTrigger>
            <DialogContent className="dark:bg-slate-800 sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Create Refund Request</DialogTitle>
                <DialogDescription>
                  Request for all your refunds here{' '}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="flex items-center space-x-2 border-t pt-4">
                  <Checkbox
                    id="confirmation"
                    checked={confirmationChecked}
                    onCheckedChange={(checked) =>
                      setConfirmationChecked(checked as boolean)
                    }
                  />
                  <Label htmlFor="confirmation" className="text-sm">
                    I confirm that this refund request is accurate and
                    authorized
                  </Label>
                </div>
              </div>

              <DialogFooter>
                <Button
                  onClick={handleCreateRefund}
                  disabled={!confirmationChecked}
                  className="w-full"
                >
                  Create Refund Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>

      <CardContent className="bg-slate-100 dark:bg-slate-800">
        {/* Filters and Search */}
        <div className="mb-6 flex flex-col gap-4 p-2 dark:bg-slate-800 sm:flex-row">
          <div className="relative flex-1 text-xl">
            {/* <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground " />
                <Input
                  placeholder="Search refunds..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-slate-200 dark:bg-slate-700 text-gray-800 dark:text-gray-200"
                /> */}
            Total Amount: $
            {
              filteredRefunds
                .reduce(
                  (sum: any, r: any) =>
                    sum + Number.parseFloat(r.amount || '0'),
                  0,
                )
                .toFixed(2)
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
            }{' '}
          </div>

          <div className="flex gap-2">
            Search by{' '}
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[140px]">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="dark:bg-slate-600">
                {/* <SelectItem value="all">All Status</SelectItem> */}
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="requested">Requested</SelectItem>
                <SelectItem value="paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-hidden rounded-md p-2 dark:bg-slate-700">
          <div className="overflow-x-auto dark:bg-slate-700">
            <Table>
              <TableHeader>
                <TableRow className="text-gray-900 dark:bg-slate-600 dark:text-gray-900">
                  <TableHead className="font-semibold">
                    <b>Refund ID</b>
                  </TableHead>
                  {/* <TableHead className="font-semibold"><b>User ID</b></TableHead> */}
                  <TableHead className="font-semibold">
                    <b>Order ID</b>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <b>Amount (USD)</b>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <b>Status</b>
                  </TableHead>
                  <TableHead className="font-semibold">
                    <b>Service Type</b>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRefunds.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={6}
                      className="py-8 text-center text-muted-foreground"
                    >
                      No refunds found matching your criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRefunds.map((refund: any) => (
                    <TableRow
                      key={refund.pidRefund}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <TableCell className="font-mono font-medium">
                        {refund.pidRefund}
                      </TableCell>
                      {/* <TableCell className="font-mono text-muted-foreground">{refund.pidUser || "—"}</TableCell> */}
                      <TableCell className="font-mono text-muted-foreground">
                        {refund.pidOrder || '—'}
                      </TableCell>
                      <TableCell className="font-semibold">
                        $
                        {
                          ((refund.amount as number) / 1)
                            .toFixed(2)
                            .toString()
                            .replace(/\B(?=(\d{3})+(?!\d))/g, ',') as string
                        }{' '}
                      </TableCell>
                      {/* <TableCell>{getStatusBadge(refund.refundStatus)}</TableCell> */}
                      <TableCell className="capitalize">
                        {refund.refundStatus}
                      </TableCell>
                      <TableCell>{refund.serviceType}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </div>

        {/* Summary */}
        <div className="m-5 mt-4 flex flex-col items-center justify-between border-t p-7 pt-4 text-sm text-muted-foreground dark:bg-slate-800 sm:flex-row">
          <div>
            Showing {filteredRefunds.length} of {refunds.length} refunds
          </div>
          {/* <div className="flex gap-4 mt-2 sm:mt-0 text-xl">
                <span>
                  Total Amount: <b>${refunds.reduce((sum:any, r:any) => sum + Number.parseFloat(r.amount || "0"), 0).toFixed(2)}</b>
                </span>
              </div> */}
        </div>
      </CardContent>
    </div>
  );
}
function useEffect(arg0: () => void, arg1: any[]) {
  throw new Error('Function not implemented.');
}
