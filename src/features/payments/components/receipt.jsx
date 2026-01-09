import React from "react";
import { Separator } from "@/components/ui/separator";

export default function Receipt() {
  const items = [
    {
      description: "Wireless Headphones",
      quantity: 2,
      unitPrice: 50.0,
      totalPrice: 100.0,
    },
    {
      description: "Bluetooth Speaker",
      quantity: 1,
      unitPrice: 120.0,
      totalPrice: 120.0,
    },
  ];

  const subtotal = 220.0;
  const tax = 22.0;
  const total = 242.0;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-start mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gray-700 rounded flex items-center justify-center">
              <img src="../../../../public/images/logo.png" alt="" />
            </div>
          </div>
          <div className="text-right text-sm text-gray-600">
            <div>inquire@startra.mail</div>
            <div>receiptName | RECEIPT00001 </div>
          </div>
        </div>

        <Separator className="mb-12" />

        {/* Title */}
        <h1 className="text-5xl font-bold text-center mb-12">Receipt</h1>

        {/* Date */}
        <div className="mb-8">
          <p className="text-gray-800">Date: November 5, 2050</p>
        </div>

        {/* Received From */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 mb-2">Received From:</h2>
          <p className="font-bold text-gray-900 mb-1">Efrain Abshire</p>
          <p className="text-gray-700">
            Email: <span className="font-bold">efrain@you.mail</span>
          </p>
        </div>

        {/* Description Section */}
        <div className="mb-8">
          <h2 className="font-bold text-gray-900 mb-4">
            Description of Services or Products:
          </h2>

          {/* Table */}
          <table className="w-full border-collapse mb-6">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-200 px-4 py-3 text-left text-gray-600">
                  Item Description
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center text-gray-600">
                  Quantity
                </th>
                <th className="border border-gray-200 px-4 py-3 text-center text-gray-600">
                  Unit Price
                </th>
                <th className="border border-gray-200 px-4 py-3 text-right text-gray-600">
                  Total Price
                </th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="border border-gray-200 px-4 py-3 text-gray-900">
                    {item.description}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-gray-900">
                    {item.quantity}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-center text-gray-900">
                    ${item.unitPrice.toFixed(2)}
                  </td>
                  <td className="border border-gray-200 px-4 py-3 text-right font-bold text-gray-900">
                    ${item.totalPrice.toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="space-y-2 mb-12">
          <p className="text-gray-900">
            <span className="font-bold">Subtotal:</span> ${subtotal.toFixed(2)}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Tax (10%):</span> ${tax.toFixed(2)}
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Total Amount:</span> ${total.toFixed(2)}
          </p>
        </div>

        {/* Payment Details */}
        <div className="space-y-2 mb-12">
          <p className="text-gray-900">
            <span className="font-bold">Payment Method:</span> Credit Card (****
            **** **** 1234)
          </p>
          <p className="text-gray-900">
            <span className="font-bold">Transaction ID:</span> 789456123
          </p>
        </div>

        {/* Footer Message */}
        <p className="text-gray-700 leading-relaxed">
          Thank you for your purchase! If you have any questions or need
          assistance, feel free to contact us at{" "}
          <span className="font-bold">[YOUR EMAIL]</span>.
        </p>
      </div>
    </div>
  );
}
