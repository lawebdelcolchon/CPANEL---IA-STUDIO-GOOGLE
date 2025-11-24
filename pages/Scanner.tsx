import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import { X, Search, CheckCircle, AlertTriangle, Box, Truck, Scan } from 'lucide-react';
import { MOCK_SHIPMENTS } from '../constants';
import { Shipment } from '../types';

export const Scanner: React.FC = () => {
  const [scannedResult, setScannedResult] = useState<string | null>(null);
  const [scannedShipment, setScannedShipment] = useState<Shipment | null>(null);
  const [statusMessage, setStatusMessage] = useState<string>('');
  const [isScanning, setIsScanning] = useState(true);

  useEffect(() => {
    // Initialize Scanner only if scanning is active and container exists
    let scanner: Html5QrcodeScanner | null = null;
    
    if (isScanning && !scannedResult) {
       // Timeout to ensure DOM element exists
       const timer = setTimeout(() => {
          const element = document.getElementById('reader');
          if (element) {
             scanner = new Html5QrcodeScanner(
                "reader",
                { fps: 10, qrbox: { width: 250, height: 250 } },
                /* verbose= */ false
             );

             scanner.render(onScanSuccess, onScanFailure);
          }
       }, 500);
       return () => clearTimeout(timer);
    }

    function onScanSuccess(decodedText: string, decodedResult: any) {
      if (scanner) {
         scanner.clear().catch(err => console.error(err));
      }
      setIsScanning(false);
      handleScan(decodedText);
    }

    function onScanFailure(error: any) {
      // Handle scan failure, usually better to ignore in UI to avoid spam
      // console.warn(`Code scan error = ${error}`);
    }
    
    return () => {
       if (scanner) {
          scanner.clear().catch(err => console.error("Failed to clear scanner", err));
       }
    };
  }, [isScanning, scannedResult]);

  const handleScan = (text: string) => {
     setScannedResult(text);
     
     // Try to parse JSON (our new QR format) or just use raw text (legacy or barcodes)
     let searchId = text;
     try {
        const data = JSON.parse(text);
        if (data.id) searchId = data.id;
        else if (data.order) searchId = data.order;
     } catch (e) {
        // Not JSON, assume direct ID string
     }

     // Lookup in Mock Data
     const shipment = MOCK_SHIPMENTS.find(s => 
        s.id === searchId || 
        s.trackingNumber === searchId || 
        s.orderId === searchId
     );

     if (shipment) {
        setScannedShipment(shipment);
        setStatusMessage("Envío localizado correctamente.");
     } else {
        setScannedShipment(null);
        setStatusMessage("No se encontró ningún envío con ese código.");
     }
  };

  const resetScanner = () => {
     setScannedResult(null);
     setScannedShipment(null);
     setStatusMessage('');
     setIsScanning(true);
  };

  const updateStatus = (newStatus: 'Delivered' | 'Exception') => {
     if (!scannedShipment) return;
     // In a real app, this would make an API call
     // Here we just mock visual feedback
     alert(`Envío ${scannedShipment.id} actualizado a: ${newStatus === 'Delivered' ? 'Entregado' : 'Incidencia'}`);
     resetScanner();
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-gray-100 pb-20">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm border-b border-gray-200 sticky top-0 z-10 flex justify-between items-center">
         <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Scan size={20} className="text-primary-600"/> Escáner Móvil
         </h2>
         {scannedResult && (
            <button onClick={resetScanner} className="text-sm font-medium text-primary-600 hover:underline">
               Escanear otro
            </button>
         )}
      </div>

      <div className="p-4 space-y-4">
         
         {/* Scanner Area */}
         {isScanning ? (
            <div className="bg-black rounded-xl overflow-hidden shadow-lg relative aspect-square">
               <div id="reader" className="w-full h-full"></div>
               <div className="absolute inset-0 pointer-events-none border-2 border-primary-500/50 rounded-xl"></div>
               <p className="absolute bottom-4 w-full text-center text-white text-xs bg-black/50 py-1">
                  Apunta al código QR o de barras
               </p>
            </div>
         ) : (
            <div className="bg-white p-6 rounded-xl shadow-sm text-center border border-gray-200">
               <div className="inline-flex p-3 rounded-full bg-green-100 text-green-600 mb-3">
                  <CheckCircle size={32} />
               </div>
               <h3 className="font-bold text-gray-900">Lectura Completada</h3>
               <p className="text-xs font-mono text-gray-500 mt-1 break-all bg-gray-50 p-2 rounded">{scannedResult}</p>
            </div>
         )}

         {/* Result Card */}
         {!isScanning && (
            <div className="animate-in slide-in-from-bottom-4">
               {scannedShipment ? (
                  <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                     <div className="bg-primary-600 p-4 text-white">
                        <div className="flex justify-between items-start">
                           <div>
                              <p className="text-xs opacity-80 uppercase font-bold">Envío Identificado</p>
                              <h2 className="text-2xl font-bold">{scannedShipment.id}</h2>
                           </div>
                           <Box size={24} className="opacity-80" />
                        </div>
                        <p className="text-sm mt-1 opacity-90">{scannedShipment.provider} Express</p>
                     </div>
                     <div className="p-4 space-y-4">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                           <div>
                              <span className="text-xs text-gray-500 block">Cliente</span>
                              <span className="font-medium">{scannedShipment.customerName}</span>
                           </div>
                           <div>
                              <span className="text-xs text-gray-500 block">Estado Actual</span>
                              <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${
                                 scannedShipment.status === 'Delivered' ? 'bg-green-100 text-green-700' : 
                                 'bg-blue-100 text-blue-700'
                              }`}>
                                 {scannedShipment.status}
                              </span>
                           </div>
                           <div className="col-span-2">
                              <span className="text-xs text-gray-500 block">Destino</span>
                              <span className="font-medium">{scannedShipment.destinationAddress}</span>
                           </div>
                        </div>

                        <div className="pt-4 border-t border-gray-100 flex gap-3">
                           <button 
                              onClick={() => updateStatus('Delivered')}
                              className="flex-1 bg-green-600 text-white py-3 rounded-lg font-bold shadow-md hover:bg-green-700 flex flex-col items-center justify-center gap-1"
                           >
                              <CheckCircle size={18} /> Confirmar Entrega
                           </button>
                           <button 
                              onClick={() => updateStatus('Exception')}
                              className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-lg font-bold hover:bg-red-50 flex flex-col items-center justify-center gap-1"
                           >
                              <AlertTriangle size={18} /> Reportar Incidencia
                           </button>
                        </div>
                     </div>
                  </div>
               ) : (
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-red-100 text-center">
                     <AlertTriangle size={32} className="text-red-500 mx-auto mb-3" />
                     <h3 className="font-bold text-gray-900">No encontrado</h3>
                     <p className="text-sm text-gray-500 mt-1">{statusMessage}</p>
                     <button 
                        onClick={resetScanner}
                        className="mt-4 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-black w-full"
                     >
                        Intentar de nuevo
                     </button>
                  </div>
               )}
            </div>
         )}
      </div>
    </div>
  );
};