import { useEffect, useState } from "react";
import api from "@/lib/utils/axios"; // ← Use your configured instance!
import { Document, Page, pdfjs } from "react-pdf";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

export default function PdfPreview({ src }) {
  const [blobUrl, setBlobUrl] = useState(null);
  const [error, setError] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let revoke;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const res = await api.get(src, {
          responseType: "blob",
        });
        const url = URL.createObjectURL(res.data);
        setBlobUrl(url);
        revoke = () => URL.revokeObjectURL(url);
      } catch (e) {
        console.error("PDF Error:", e.response || e);
        setError("Failed to load PDF");
      } finally {
        setLoading(false);
      }
    }
    if (src) load();
    return () => {
      if (revoke) revoke();
    };
  }, [src]);

  const onLoadSuccess = ({ numPages: n }) => setNumPages(n);

  if (loading)
    return (
      <div style={{ display: "grid", placeItems: "center", height: "100vh" }}>
        Loading PDF…
      </div>
    );
  if (error) return <div style={{ color: "red", padding: 16 }}>{error}</div>;
  if (!blobUrl) return null;

  return (
    <div className="flex flex-col items-center justify-start w-full min-h-screen bg-background">
      <Document
        file={blobUrl}
        onLoadSuccess={onLoadSuccess}
        loading={null}
        error={null}
      >
        {numPages &&
          Array.from({ length: numPages }, (_, i) => i + 1).map((page) => (
            <div
              key={page}
              className="border border-border rounded-lg overflow-hidden mb-4"
            >
              <Page
                pageNumber={page}
                renderTextLayer={false}
                renderAnnotationLayer={false}
                scale={1.5}
              />
            </div>
          ))}
      </Document>
    </div>
  );
}
