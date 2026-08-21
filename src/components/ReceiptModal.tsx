import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  Printer,
  CheckCircle,
  QrCode,
  FileText,
  BadgeCheck,
  Heart,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import type { Receipt, EventCategory } from "@/types";
import { APP_NAME, CATEGORY_WATERMARK_COLORS, CATEGORIES } from "@/constants";

interface ReceiptModalProps {
  receipt: Receipt | null;
  open: boolean;
  onClose: () => void;
}

export default function ReceiptModal({ receipt, open, onClose }: ReceiptModalProps) {
  const receiptRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const t = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(t);
    }
  }, [copied]);

  if (!receipt) return null;

  const watermarkColor = CATEGORY_WATERMARK_COLORS[receipt.category] || "#6b7280";
  const catInfo = CATEGORIES.find((c) => c.value === receipt.category);

  const handleDownload = () => {
    const el = receiptRef.current;
    if (!el) return;
    try {
      const canvas = document.createElement("canvas");
      const scale = 2;
      canvas.width = el.offsetWidth * scale;
      canvas.height = el.offsetHeight * scale;
      const ctx = canvas.getContext("2d");
      if (!ctx) { toast.error("Could not generate image"); return; }
      ctx.scale(scale, scale);
      const data = new XMLSerializer().serializeToString(el);
      const svgStr = `<svg xmlns="http://www.w3.org/2000/svg" width="${el.offsetWidth}" height="${el.offsetHeight}"><foreignObject width="100%" height="100%"><div xmlns="http://www.w3.org/1999/xhtml">${data}</div></foreignObject></svg>`;
      const img = new Image();
      const blob = new Blob([svgStr], { type: "image/svg+xml;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      img.onload = () => {
        ctx.drawImage(img, 0, 0);
        URL.revokeObjectURL(url);
        const link = document.createElement("a");
        link.download = `receipt-${receipt.receiptNumber}.png`;
        link.href = canvas.toDataURL("image/png");
        link.click();
        toast.success("Receipt downloaded successfully!");
      };
      img.onerror = () => toast.error("Could not download receipt");
      img.src = url;
    } catch {
      toast.error("Could not download receipt");
    }
  };

  const handlePrint = () => {
    const el = receiptRef.current;
    if (!el) return;
    const win = window.open("", "_blank");
    if (win) {
      win.document.write(`
        <html>
          <head><title>Receipt ${receipt.receiptNumber}</title></head>
          <body style="margin:0;display:flex;justify-content:center;padding:20px">
            ${el.outerHTML}
            <script>
              window.onload = function() { setTimeout(function() { window.print(); window.close(); }, 500); };
            <\/script>
          </body>
        </html>
      `);
      win.document.close();
    }
  };

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(receipt.adminPhone);
    setCopied(true);
    toast.success("Admin number copied!");
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="w-full max-w-lg max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Action Bar */}
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Payment Receipt
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handleDownload}
                >
                  <Download className="h-3.5 w-3.5" />
                  Save
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  className="h-8 gap-1.5 text-xs"
                  onClick={handlePrint}
                >
                  <Printer className="h-3.5 w-3.5" />
                  Print
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-white hover:bg-white/20"
                  onClick={onClose}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Receipt Card */}
            <Card
              ref={receiptRef}
              className="relative overflow-hidden bg-white p-6 shadow-2xl border-0"
              style={{ minHeight: 500 }}
            >
              {/* Watermark */}
              <div
                className="absolute inset-0 pointer-events-none flex items-center justify-center"
                style={{ opacity: 0.08, transform: "rotate(-30deg)" }}
              >
                <span
                  className="text-[120px] font-black tracking-widest select-none"
                  style={{ color: watermarkColor }}
                >
                  {receipt.category.toUpperCase()}
                </span>
              </div>

              {/* Content */}
              <div className="relative z-10">
                {/* Header */}
                <div className="text-center mb-6">
                  <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-emerald-100 mb-3">
                    <BadgeCheck className="h-7 w-7 text-emerald-600" />
                  </div>
                  <h1 className="text-lg font-bold text-gray-900">{APP_NAME}</h1>
                  <p className="text-xs text-gray-500">Official Payment Receipt</p>
                  <div className="flex items-center justify-center gap-1.5 mt-2">
                    <Badge className={catInfo?.bgColor + " " + catInfo?.color + " border-0 text-xs"}>
                      {receipt.category}
                    </Badge>
                    <Badge variant="outline" className="text-[10px] border-emerald-300 text-emerald-700">
                      VERIFIED
                    </Badge>
                  </div>
                </div>

                <Separator className="mb-4" />

                {/* Receipt Number & QR */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Receipt No.</p>
                    <p className="text-sm font-bold text-gray-900 font-mono">{receipt.receiptNumber}</p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(receipt.createdAt).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="h-14 w-14 bg-gray-100 rounded-lg flex items-center justify-center">
                      <QrCode className="h-10 w-10 text-gray-700" />
                    </div>
                    <p className="text-[8px] text-gray-400 mt-0.5">Scan to verify</p>
                  </div>
                </div>

                {/* Event Info */}
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider">Event</p>
                  <p className="text-sm font-semibold text-gray-900">{receipt.eventTitle}</p>
                </div>

                {/* Contributor Details */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Contributor</p>
                    <p className="text-sm font-medium text-gray-900">{receipt.contributorName}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Phone</p>
                    <p className="text-sm font-medium text-gray-900">{receipt.contributorPhone}</p>
                  </div>
                </div>

                {/* Amount */}
                <div className="bg-emerald-50 rounded-lg p-3 mb-4 text-center">
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider">Amount Paid</p>
                  <p className="text-2xl font-bold text-emerald-700">
                    ${receipt.amount.toLocaleString()}
                  </p>
                  {receipt.reason && (
                    <p className="text-xs text-gray-500 mt-1">
                      Reason: {receipt.reason}
                    </p>
                  )}
                </div>

                {/* Balance Breakdown */}
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Suggested Individual Target</span>
                    <span className="font-medium">${receipt.suggestedIndividualTarget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Individual Balance</span>
                    <span className={receipt.individualBalance <= 0 ? "text-emerald-600 font-medium" : "text-amber-600 font-medium"}>
                      {receipt.individualBalance <= 0
                        ? `$${Math.abs(receipt.individualBalance).toLocaleString()} overpaid`
                        : `$${receipt.individualBalance.toLocaleString()} due`}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Event Total Collected</span>
                    <span className="font-medium">${receipt.eventTotalCollected.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-gray-500">Event Target</span>
                    <span className="font-medium">${receipt.eventTargetAmount.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-gray-700">Event Remaining</span>
                    <span className={receipt.eventRemainingTarget <= 0 ? "text-emerald-600" : "text-rose-600"}>
                      {receipt.eventRemainingTarget <= 0
                        ? "Goal Reached!"
                        : `$${receipt.eventRemainingTarget.toLocaleString()}`}
                    </span>
                  </div>
                </div>

                <Separator className="mb-3" />

                {/* Admin Details */}
                <div className="text-center">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">Admin Deposit Number</p>
                  <div className="flex items-center justify-center gap-2">
                    <p className="text-sm font-mono font-bold text-gray-900">{receipt.adminPhone}</p>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={handleCopyNumber}>
                      {copied ? <CheckCircle className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                    </Button>
                  </div>
                </div>

                {/* Footer Seal */}
                <div className="mt-6 pt-3 border-t text-center">
                  <div className="flex items-center justify-center gap-2 text-emerald-700">
                    <Heart className="h-3.5 w-3.5 fill-emerald-500" />
                    <span className="text-[10px] font-semibold tracking-wider">
                      JG EVENT MANAGER - VERIFIED
                    </span>
                    <Heart className="h-3.5 w-3.5 fill-emerald-500" />
                  </div>
                  <p className="text-[8px] text-gray-400 mt-1">
                    This is a computer-generated receipt. No signature required.
                  </p>
                </div>
              </div>
            </Card>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}