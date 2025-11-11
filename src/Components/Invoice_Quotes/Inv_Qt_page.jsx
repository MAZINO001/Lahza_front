/* eslint-disable no-unused-vars */
import { Download, Edit2, Printer, Send } from "lucide-react";
import React from "react";
import { Button } from "../ui/button";
import { useAuth } from "@/hooks/useAuth";
import { Link, Outlet, useParams } from "react-router-dom";

export default function Inv_Qt_page({ type, data }) {
  const title = type === "invoices" ? "All Invoices" : "All Quotes";
  const { id } = useParams();
  const { role } = useAuth();
  return (
    <div className="flex-1 flex flex-col">
      <div className="bg-white border-b px-2 py-4 flex items-center justify-between">
        <div className="text-lg font-semibold">QT-0004</div>
        <div className="flex items-center gap-2">
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Link to={`/${role}/${type}/new`} state={{ quoteId: id }}>
              <Edit2 size={20} />
            </Link>
          </button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Download size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Printer size={20} />
          </button>
          <button className="p-2 hover:bg-gray-100 rounded cursor-pointer">
            <Send size={20} />
          </button>
          {type === "quote" ? (
            <div>
              <div className="w-px h-6 bg-gray-300 mx-2"></div>
              <Button variant="outline" className="text-sm">
                Convert to Invoice
              </Button>
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className="flex items-center justify-center">
        {/* this where the preview will be an this the quote id {id} */}
        <div className="min-h-screen bg-gray-50 p-8">
          <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
            {/* Header */}
            <div className="bg-linear-to-r from-blue-600 to-blue-800 text-white p-8">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold mb-2">FACTURE</h1>
                  <p className="text-blue-100">Invoice</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">INV-000634</div>
                  <div className="text-sm text-blue-100 mt-1">
                    N° de facture
                  </div>
                </div>
              </div>
            </div>

            {/* Company Info & Client Info */}
            <div className="grid grid-cols-2 gap-8 p-8 border-b">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-3">
                  LAHZA HM SARL
                </h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>Rue Sayed Kotb, Rés. Assedk,</p>
                  <p>Etg 1 Bureau 12, 90000 Tanger</p>
                  <p>Morocco</p>
                  <p className="mt-3 font-medium text-gray-700">
                    +2126 27 34 08 75
                  </p>
                  <p className="text-blue-600">contact@lahza.ma</p>
                  <p className="text-blue-600">www.lahza.ma</p>
                </div>
                <div className="mt-4 text-xs text-gray-500">
                  <p>ICE: 002 056 959 000 039</p>
                  <p>RC: 88049</p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-gray-500 mb-2">
                  FACTURÉ À
                </h3>
                <h2 className="text-xl font-bold text-gray-800 mb-3">NEWERA</h2>
                <div className="text-sm text-gray-600 space-y-1">
                  <p>7 Angle Rue de Fès & Rue de Uruguay,</p>
                  <p>5ème Ét. N°21</p>
                  <p>Tanger, 90000</p>
                  <p>Morocco</p>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-8 px-8 py-6 bg-gray-50">
              <div>
                <p className="text-xs text-gray-500 mb-1">Date de facture</p>
                <p className="text-lg font-semibold text-gray-800">
                  06 août 2025
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Date d'échéance</p>
                <p className="text-lg font-semibold text-gray-800">
                  06 août 2025
                </p>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="p-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b-2 border-gray-300">
                    <th className="text-left py-3 text-sm font-semibold text-gray-700">
                      Article & Description
                    </th>
                    <th className="text-center py-3 text-sm font-semibold text-gray-700 w-24">
                      Quantité
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 w-32">
                      Prix HT
                    </th>
                    <th className="text-right py-3 text-sm font-semibold text-gray-700 w-32">
                      Montant TTC
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-gray-200">
                    <td className="py-4">
                      <p className="font-semibold text-gray-800 mb-2">
                        Serveur d'hébergement WEB - Full Pack
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1 ml-4">
                        <li>• Offre de 100 Dh / mois</li>
                        <li>• Nom de domaine Gratuit</li>
                        <li>• Certificat de sécurité SSL</li>
                        <li>• Espace du serveur 80GB</li>
                        <li>• Sous domaine illimités</li>
                        <li>• Databases illimité</li>
                        <li>• Web mail Active</li>
                        <li>• Adresses mail professionnels</li>
                        <li>• Système LiteSpeed</li>
                        <li>• Sauvegarde automatique 24h / 24</li>
                        <li>• Sécurité du Serveur 24/h</li>
                        <li>• FTP & SFTP Access</li>
                      </ul>
                    </td>
                    <td className="py-4 text-center text-gray-700">1.00</td>
                    <td className="py-4 text-right text-gray-700">1,200.00</td>
                    <td className="py-4 text-right font-semibold text-gray-800">
                      1,440.00
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Totals */}
              <div className="mt-8 flex justify-end">
                <div className="w-80">
                  <div className="flex justify-between py-2 border-t border-gray-200">
                    <span className="text-gray-600">Sous-total</span>
                    <span className="font-semibold text-gray-800">
                      1,440.00 MAD
                    </span>
                  </div>
                  <div className="flex justify-between py-3 border-t-2 border-gray-800 mt-2">
                    <span className="text-lg font-bold text-gray-800">
                      Total TTC
                    </span>
                    <span className="text-xl font-bold text-blue-600">
                      1,440.00 MAD
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Info */}
            <div className="bg-gray-50 px-8 py-6 border-t">
              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    Mode de paiement :
                  </h3>
                  <p className="text-sm text-gray-600">
                    Par virement, ou Chèque.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-800 mb-2">
                    ATTIJARI WAFABANK
                  </h3>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>LAHZA HM</p>
                    <p>R.I.B: 007640001433200000026029</p>
                    <p>CODE SWIFT: BCMAMAMC</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="px-8 py-6 bg-blue-50 border-t">
              <h3 className="font-semibold text-gray-800 mb-2 text-sm">
                Conditions d'utilisation
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                En signant la facture, le client accepte sans réserves nos
                conditions. Pour plus d'informations, consultez les politiques
                de notre entreprise sur :
                <a
                  href="https://lahza.ma/politique-de-confidentialite/"
                  className="text-blue-600 hover:underline ml-1"
                >
                  https://lahza.ma/politique-de-confidentialite/
                </a>
              </p>
            </div>

            {/* Signature */}
            <div className="px-8 py-6 border-t">
              <div className="text-center">
                <p className="text-sm text-gray-500 mb-12">
                  Signature du destinataire
                </p>
                <div className="border-t border-gray-400 w-64 mx-auto"></div>
              </div>
            </div>

            {/* Footer */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white text-center py-4">
              <p className="text-sm">Merci de votre confiance.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
